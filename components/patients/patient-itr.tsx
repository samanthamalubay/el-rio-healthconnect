import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import PatientInformation from "@/components/patients/patient-information";
import PatientMedicalHistory from "@/components/patients/patient-medical-history";
import Link from "next/link";

type PatientITRProps = {
    itrId: string;
};

export default async function PatientITR({itrId}: PatientITRProps) {
    const supabase = await createClient();

    // Verify the current authenticated NM.
    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    const {data: profile, error: profileError} = await supabase
        .from("staff_profiles")
        .select("role, is_active")
        .eq("user_id", user.id)
        .single();

    if (
        profileError ||
        !profile ||
        !["NM", "Doctor"].includes(profile.role) ||
        !profile.is_active
    ) {
        redirect("/login");
    }

    // Only display the ITR for this NM's active assessment or Doctors active consultation.

    const { data: assignedVisit, error: visitError } = await supabase
        .from("patient_visits")
        .select("visit_id")
        .eq("itr_id", itrId)
        .or(
            `and(assessment_started_by.eq.${user.id},status.eq.NM_ASSESSMENT_IN_PROGRESS),` +
            `and(consultation_started_by.eq.${user.id},status.eq.DOCTOR_CONSULTATION_IN_PROGRESS)`
        )
        .maybeSingle();

    if (visitError || !assignedVisit) {
        throw new Error(
            "Unable to verify access to this patient's ITR."
        );
    }


    // Retrieve the complete ITR information.
    const {data: patient, error: patientError} = await supabase
        .from("individual_treatment_records")
        .select(`
            itr_id,
            first_name,
            last_name,
            middle_initial,
            date_of_birth,
            sex,
            house_street_address,
            barangay,
            city,
            contact_number,
            religion,
            civil_status,
            educational_attainment,
            occupation,
            spouse_maiden_name,
            spouse_occupation,
            spouse_contact_number,
            guardian_name,
            guardian_relationship,
            emergency_contact_name,
            emergency_contact_relationship,
            emergency_contact_number,
            has_hypertension,
            has_diabetes,
            has_sti_hiv,
            has_heart_disease,
            has_kidney_failure,
            has_tuberculosis,
            family_history_asthma_allergies,
            family_history_birth_defects,
            family_history_cancer,
            family_history_dementia,
            family_history_diabetes,
            family_history_hypertension,
            family_history_kidney_disease,
            family_history_mental_illness,
            social_healthy_diet,
            social_adequate_physical_activity,
            social_sufficient_sleep,
            social_normal_growth_development,
            social_multiple_sex_partners,
            social_smokes_tobacco,
            social_drinks_alcohol,
            social_takes_illicit_drugs,
            social_smoking_packs_per_year,
            social_alcohol_bottles_per_day,
            social_illicit_drugs_details,
            no_reported_immunizations,
            immunization_general_remarks
        `)
        .eq("itr_id", itrId)
        .maybeSingle();

    if (patientError || !patient) {
        console.error("ITR retrieval failed:", patientError);
        throw new Error("Unable to retrieve patient ITR.");
    }

    // Retrieve the related ITR records.
    const [
        allergiesResult,
        conditionsResult,
        medicationsResult,
        historyResult,
        immunizationsResult,
    ] = await Promise.all([
        supabase
            .from("itr_allergies")
            .select("allergy_id, allergy_name")
            .eq("itr_id", itrId),

        supabase
            .from("itr_additional_conditions")
            .select("condition, category, condition_name")
            .eq("itr_id", itrId),

        supabase
            .from("itr_maintenance_medications")
            .select("medication_id, medication_name, frequency, dosage")
            .eq("itr_id", itrId),

        supabase
            .from("itr_previous_illnesses_surgeries")
            .select("history_id, type, description")
            .eq("itr_id", itrId),

        supabase
            .from("itr_immunization_history")
            .select(`
                history_id,
                vaccine_name,
                dose_label,
                date_administered,
                vaccine_brand,
                remarks
            `)
            .eq("itr_id", itrId),
    ]);

    // Fail explicitly rather than displaying incomplete clinical data.
    const retrievalErrors = [
        allergiesResult.error,
        conditionsResult.error,
        medicationsResult.error,
        historyResult.error,
        immunizationsResult.error,
    ].filter(Boolean);

    if (retrievalErrors.length > 0) {
        console.error("ITR related-record retrieval failed:", retrievalErrors);
        throw new Error("Unable to retrieve complete ITR history.");
    }

    const pastMedicalConditions = [
        {label: "Hypertension", value: patient.has_hypertension},
        {label: "Diabetes", value: patient.has_diabetes},
        {label: "STI / HIV", value: patient.has_sti_hiv},
        {label: "Heart Disease", value: patient.has_heart_disease},
        {label: "Kidney Failure", value: patient.has_kidney_failure},
        {label: "Tuberculosis", value: patient.has_tuberculosis},
    ];

    const familyMedicalConditions = [
        {
            label: "Asthma / Allergies",
            value: patient.family_history_asthma_allergies,
        },
        {
            label: "Birth Defects",
            value: patient.family_history_birth_defects,
        },
        { label: "Cancer", value: patient.family_history_cancer },
        { label: "Dementia", value: patient.family_history_dementia },
        { label: "Diabetes", value: patient.family_history_diabetes },
        {
            label: "Hypertension",
            value: patient.family_history_hypertension,
        },
        {
            label: "Kidney Disease",
            value: patient.family_history_kidney_disease,
        },
        {
            label: "Mental Illness",
            value: patient.family_history_mental_illness,
        },
    ];

    const socialHistory = [
        { label: "Healthy Diet", value: patient.social_healthy_diet },
        {
            label: "Adequate Physical Activity",
            value: patient.social_adequate_physical_activity,
        },
        { label: "Sufficient Sleep", value: patient.social_sufficient_sleep },
        {
            label: "Normal Growth / Development",
            value: patient.social_normal_growth_development,
        },
        {
            label: "Multiple Sexual Partners",
            value: patient.social_multiple_sex_partners,
        },
        { label: "Smokes Tobacco", value: patient.social_smokes_tobacco },
        { label: "Drinks Alcohol", value: patient.social_drinks_alcohol },
        { label: "Takes Illicit Drugs", value: patient.social_takes_illicit_drugs },
    ];

    return (
        <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">
                Patient ITR
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                Read-only medical record
                </p>
            </div>

            <Link
                href={`/patients/${itrId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md
                        border border-teal-200 bg-teal-50 px-3 py-2
                        text-sm font-medium text-teal-800
                        hover:bg-teal-100"
            >
                View Full Record ↗
            </Link>
            </div>

            <PatientInformation patient={patient} />

            <PatientMedicalHistory
                pastMedicalConditions={pastMedicalConditions}
                familyMedicalConditions={familyMedicalConditions}
                socialHistory={socialHistory}
                socialDetails={{
                    smoking: patient.social_smoking_packs_per_year,
                    alcohol: patient.social_alcohol_bottles_per_day,
                    illicitDrugs: patient.social_illicit_drugs_details,
                }}
                allergies={allergiesResult.data ?? []}
                additionalConditions={conditionsResult.data ?? []}
                medications={medicationsResult.data ?? []}
                previousHistory={historyResult.data ?? []}
                immunizations={immunizationsResult.data ?? []}
                immunizationStatus={{
                    noReported: patient.no_reported_immunizations,
                    remarks: patient.immunization_general_remarks,
                }}
            />
        </div>
    );
}
