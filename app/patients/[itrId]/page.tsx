import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import PatientInformation from "@/components/patients/patient-information";
import PatientMedicalHistory from "@/components/patients/patient-medical-history";
import PatientWorkspaceTabs from "@/components/patients/patient-workspace-tabs";
import PatientHistoryAccordion from "@/components/patients/patient-history-accordion";

export const instant = false;

type PatientITRPageProps = {
  params: Promise<{ itrId: string }>;
};

export default async function PatientITRPage({
  params,
}: PatientITRPageProps) {
  const supabase = await createClient();

    // Verify authentication.
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    // To verify if user is *AUTHORIZED to access Patient search feature
    const {data: profile, error: profileError} = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

    const allowedRoles = ["NM", "BHW", "Doctor"];

    if (
        profileError ||
        !profile ||
        !allowedRoles.includes(profile.role) ||
        !profile.is_active
    ) {
        redirect("/login");
    }

    const {itrId} = await params;

    //Retrieve Active Visits from the database
    const {data: activeVisit, error: visitError} = await supabase
        .from("patient_visits")
        .select("visit_id,status")
        .eq("itr_id", itrId)
        .not("status", "in", '("COMPLETED","CANCELLED")')
        .maybeSingle();

    if (visitError) {
    console.error("Active visit retrieval failed:", visitError);
    throw new Error("Unable to retrieve active visit information.");
    }


    // Retrieve all visits associated with this ITR.
    const { data: visitHistory, error: historyError } = await supabase
        .from("patient_visits")
        .select("visit_id, status, created_at")
        .eq("itr_id", itrId)
        .order("created_at", { ascending: false });

    if (historyError) {
        console.error("Visit history retrieval failed:", historyError);
        throw new Error("Unable to retrieve patient visit history.");
    }


    // Retrieve the requested ITR.
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

    if (patientError) {
        console.error("ITR retrieval failed:", patientError);
        throw new Error("Unable to retrieve the patient record.");
    }

    if (!patient) {
        notFound();
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
                                    {label: "Asthma / Allergies", value: patient.family_history_asthma_allergies},
                                    {label: "Birth Defects", value: patient.family_history_birth_defects},
                                    {label: "Cancer", value: patient.family_history_cancer},
                                    {label: "Dementia", value: patient.family_history_dementia},
                                    {label: "Diabetes", value: patient.family_history_diabetes},
                                    {label: "Hypertension", value: patient.family_history_hypertension},
                                    {label: "Kidney Disease", value: patient.family_history_kidney_disease},
                                    {label: "Mental Illness", value: patient.family_history_mental_illness},
                                    ];

    const formatYesNo = (value: boolean | null) => {
                        if (value === null) return "Not recorded";
                        return value ? "Yes" : "No";
                        };

    const socialHistory = [
                            {label: "Healthy Diet", value: patient.social_healthy_diet},
                            {
                                label: "Adequate Physical Activity",
                                value: patient.social_adequate_physical_activity,
                            },
                            {label: "Sufficient Sleep", value: patient.social_sufficient_sleep},
                            {
                                label: "Normal Growth / Development",
                                value: patient.social_normal_growth_development,
                            },
                            {
                                label: "Multiple Sexual Partners",
                                value: patient.social_multiple_sex_partners,
                            },
                            {label: "Smokes Tobacco", value: patient.social_smokes_tobacco},
                            {label: "Drinks Alcohol", value: patient.social_drinks_alcohol},
                            {label: "Takes Illicit Drugs", value: patient.social_takes_illicit_drugs},
                            ];

    // Retrieve the patient's reported allergies.
        const {data: allergies, error: allergiesError} = await supabase
        .from("itr_allergies")
        .select("allergy_id, allergy_name")
        .eq("itr_id", itrId)
        .order("allergy_name", {ascending: true});

        if (allergiesError) {
        console.error("Allergy retrieval failed:", allergiesError);
        throw new Error("Unable to retrieve patient allergies.");
        }

    // Retrieve additional medical conditions.
        const {data: additionalConditions, error: conditionsError} =
        await supabase
            .from("itr_additional_conditions")
            .select("condition, category, condition_name")
            .eq("itr_id", itrId);

        if (conditionsError) {
        console.error("Additional conditions retrieval failed:", conditionsError);
        throw new Error("Unable to retrieve additional medical conditions.");
        }

    // Retrieve maintenance medications.
        const {data: medications, error: medicationsError} =
        await supabase
            .from("itr_maintenance_medications")
            .select("medication_id, medication_name, frequency, dosage")
            .eq("itr_id", itrId);

        if (medicationsError) {
        console.error("Medication retrieval failed:", medicationsError);
        throw new Error("Unable to retrieve maintenance medications.");
        }

    // Retrieve previous illnesses and surgeries.
        const {data: previousHistory, error: previousHistoryError} =
        await supabase
            .from("itr_previous_illnesses_surgeries")
            .select("history_id, type, description")
            .eq("itr_id", itrId);

        if (previousHistoryError) {
        console.error("Previous history retrieval failed:", previousHistoryError);
        throw new Error("Unable to retrieve previous illnesses and surgeries.");
        }

    // Retrieve immunization history.
        const {data: immunizations, error: immunizationsError} =
        await supabase
            .from("itr_immunization_history")
            .select(
            "history_id, vaccine_name, dose_label, date_administered, vaccine_brand, remarks"
            )
            .eq("itr_id", itrId);

        if (immunizationsError) {
        console.error("Immunization retrieval failed:", immunizationsError);
        throw new Error("Unable to retrieve immunization history.");
        }

    // Main page
    return (
        <main className="min-h-screen bg-slate-100 p-8">
        <div className="mx-auto max-w-5xl">
            {/*<Link
            href="/patients"
            className="text-sm font-medium text-blue-700 hover:underline"
            >
            ← Back to Patient Search
            </Link>*/}

            <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex sm:flex-col sm:justify-center">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Individual Treatment Record
                        </h1>

                        <p className="mt-2 break-all text-sm text-slate-600">
                            ITR ID: {patient.itr_id}
                        </p>
                    </div>

                    {activeVisit ? (
                    <span className="text-red-500 font-bold border-2 p-2">
                        Active Visit in Progress
                    </span>
                    ) : profile.role === "BHW" ? (
                    <Link
                        href={`/bhw/visits/new?itrId=${patient.itr_id}`}
                        className="mt-4 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                    >
                        Start New Visit
                    </Link>
                    ) : null}
                    {/*<Link
                            href={`/bhw/visits/new?itrId=${patient.itr_id}`}
                            className="mt-4 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                    >
                        Start New Visit
                    </Link>*/}
                    {/* <Link
                            href={`/patients/${patient.itr_id}/active-visit`}
                            className="mt-4 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                    >
                        View Active Visit
                    </Link> */}
                </div>
                    
                    {/*This is the section that allows tabs for the patient's ITR*/}
                    <PatientWorkspaceTabs
                        itrContent={
                            <div className="space-y-4">
                                <PatientHistoryAccordion
                                    title="Patient Details"
                                    defaultOpen={true}
                                >
                                    <PatientInformation patient={patient} />
                                </PatientHistoryAccordion>

                                <PatientHistoryAccordion title="Medical History">
                                    <PatientMedicalHistory
                                                            pastMedicalConditions={pastMedicalConditions}
                                                            familyMedicalConditions={familyMedicalConditions}
                                                            socialHistory={socialHistory}
                                                            socialDetails={{
                                                                smoking: patient.social_smoking_packs_per_year,
                                                                alcohol: patient.social_alcohol_bottles_per_day,
                                                                illicitDrugs: patient.social_illicit_drugs_details,
                                                            }}
                                                            allergies={allergies ?? []}
                                                            additionalConditions={additionalConditions ?? []}
                                                            medications={medications ?? []}
                                                            previousHistory={previousHistory ?? []}
                                                            immunizations={immunizations ?? []}
                                                            immunizationStatus={{
                                                                noReported: patient.no_reported_immunizations,
                                                                remarks: patient.immunization_general_remarks,
                                                            }}
                                                        />
                                </PatientHistoryAccordion>
                            </div>
                            }
                        visitHistoryContent={
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Visit History
                                </h2>

                                {!visitHistory || visitHistory.length === 0 ? (
                                    <p className="mt-4 text-sm text-slate-600">
                                        No visits recorded for this patient.
                                    </p>
                                ) : (
                                    <div className="mt-4 space-y-3">
                                        {visitHistory.map((visit) => (
                                            <div
                                                key={visit.visit_id}
                                                className="rounded-md border border-slate-200 p-4"
                                            >
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {new Date(visit.created_at).toLocaleString(
                                                                "en-PH",
                                                                {
                                                                    dateStyle: "medium",
                                                                    timeStyle: "short",
                                                                    timeZone: "Asia/Manila",
                                                                }
                                                            )}
                                                        </p>

                                                        <p className="mt-1 text-sm text-slate-600">
                                                            Status: {visit.status}
                                                        </p>
                                                    </div>

                                                    {(profile.role === "NM" || profile.role === "Doctor") && (
                                                        <Link
                                                            href={`/patients/${itrId}/visits/${visit.visit_id}`}
                                                            className="text-sm font-medium text-blue-700 hover:underline"
                                                        >
                                                            View Visit Details
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        }
                        specialRecordsContent={
                            <section>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Special Records
                                </h2>

                                <p className="mt-3 text-sm text-slate-600">
                                    Disease-specific records such as NCD/CVD,
                                    maternal care, and tuberculosis will be
                                    available here in a future version.
                                </p>
                            </section>
                        }
                    />
               
            </div>

            
            

        </div>
        </main>
    );
}