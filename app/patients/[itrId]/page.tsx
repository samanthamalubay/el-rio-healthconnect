import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

    const allowedRoles = ["NM", "BHW"];

    if (
        profileError ||
        !profile ||
        !allowedRoles.includes(profile.role) ||
        !profile.is_active
    ) {
        redirect("/login");
    }

  const { itrId } = await params;

  // Retrieve the requested ITR.
  const { data: patient, error: patientError } = await supabase
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
                                { label: "Hypertension", value: patient.has_hypertension },
                                { label: "Diabetes", value: patient.has_diabetes },
                                { label: "STI / HIV", value: patient.has_sti_hiv },
                                { label: "Heart Disease", value: patient.has_heart_disease },
                                { label: "Kidney Failure", value: patient.has_kidney_failure },
                                { label: "Tuberculosis", value: patient.has_tuberculosis },
                                ];

  const familyMedicalConditions = [
                                { label: "Asthma / Allergies", value: patient.family_history_asthma_allergies },
                                { label: "Birth Defects", value: patient.family_history_birth_defects },
                                { label: "Cancer", value: patient.family_history_cancer },
                                { label: "Dementia", value: patient.family_history_dementia },
                                { label: "Diabetes", value: patient.family_history_diabetes },
                                { label: "Hypertension", value: patient.family_history_hypertension },
                                { label: "Kidney Disease", value: patient.family_history_kidney_disease },
                                { label: "Mental Illness", value: patient.family_history_mental_illness },
                                ];

  const formatYesNo = (value: boolean | null) => {
                    if (value === null) return "Not recorded";
                    return value ? "Yes" : "No";
                    };

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

  // Retrieve the patient's reported allergies.
    const { data: allergies, error: allergiesError } = await supabase
    .from("itr_allergies")
    .select("allergy_id, allergy_name")
    .eq("itr_id", itrId)
    .order("allergy_name", { ascending: true });

    if (allergiesError) {
    console.error("Allergy retrieval failed:", allergiesError);
    throw new Error("Unable to retrieve patient allergies.");
    }

  // Retrieve additional medical conditions.
    const { data: additionalConditions, error: conditionsError } =
    await supabase
        .from("itr_additional_conditions")
        .select("condition, category, condition_name")
        .eq("itr_id", itrId);

    if (conditionsError) {
    console.error("Additional conditions retrieval failed:", conditionsError);
    throw new Error("Unable to retrieve additional medical conditions.");
    }

  // Retrieve maintenance medications.
    const { data: medications, error: medicationsError } =
    await supabase
        .from("itr_maintenance_medications")
        .select("medication_id, medication_name, frequency, dosage")
        .eq("itr_id", itrId);

    if (medicationsError) {
    console.error("Medication retrieval failed:", medicationsError);
    throw new Error("Unable to retrieve maintenance medications.");
    }

  // Retrieve previous illnesses and surgeries.
    const { data: previousHistory, error: previousHistoryError } =
    await supabase
        .from("itr_previous_illnesses_surgeries")
        .select("history_id, type, description")
        .eq("itr_id", itrId);

    if (previousHistoryError) {
    console.error("Previous history retrieval failed:", previousHistoryError);
    throw new Error("Unable to retrieve previous illnesses and surgeries.");
    }

  // Retrieve immunization history.
    const { data: immunizations, error: immunizationsError } =
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
        <Link
          href="/patients"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Back to Patient Search
        </Link>

        <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Individual Treatment Record
          </h1>

          <p className="mt-2 break-all text-sm text-slate-600">
            ITR ID: {patient.itr_id}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Patient Name</p>
              <p className="font-medium text-slate-900">
                {patient.first_name}{" "}
                {patient.middle_initial
                  ? `${patient.middle_initial} `
                  : ""}
                {patient.last_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Date of Birth</p>
              <p className="font-medium text-slate-900">
                {patient.date_of_birth}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Sex</p>
              <p className="font-medium text-slate-900">
                {patient.sex}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Contact Number</p>
              <p className="font-medium text-slate-900">
                {patient.contact_number || "Not provided"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-slate-500">Address</p>
              <p className="font-medium text-slate-900">
                {patient.house_street_address}, {patient.barangay},{" "}
                {patient.city}
              </p>
            </div>

            <section className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Past Medical History
                </h2>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {pastMedicalConditions.map((condition) => (
                    <p key={condition.label} className="text-slate-800">
                        <span className="font-medium">{condition.label}:</span>{" "}
                        {condition.value ? "Yes" : "No"}
                    </p>
                    ))}
                </div>
            </section>

            <section className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Family Medical History
                </h2>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {familyMedicalConditions.map((condition) => (
                    <p key={condition.label} className="text-slate-800">
                        <span className="font-medium">{condition.label}:</span>{" "}
                        {condition.value === null
                        ? "Not recorded"
                        : condition.value
                            ? "Yes"
                            : "No"}
                    </p>
                    ))}
                </div>
            </section>

            <section className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Personal / Social History
                </h2>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {socialHistory.map((item) => (
                    <p key={item.label} className="text-slate-800">
                        <span className="font-medium">{item.label}:</span>{" "}
                        {formatYesNo(item.value)}
                    </p>
                    ))}
                </div>

                {patient.social_smoking_packs_per_year && (
                    <p className="mt-3 text-slate-800">
                    <span className="font-medium">Smoking Details:</span>{" "}
                    {patient.social_smoking_packs_per_year}
                    </p>
                )}

                {patient.social_alcohol_bottles_per_day && (
                    <p className="mt-2 text-slate-800">
                    <span className="font-medium">Alcohol Consumption:</span>{" "}
                    {patient.social_alcohol_bottles_per_day}
                    </p>
                )}

                {patient.social_illicit_drugs_details && (
                    <p className="mt-2 text-slate-800">
                    <span className="font-medium">Illicit Drug Details:</span>{" "}
                    {patient.social_illicit_drugs_details}
                    </p>
                )}
            </section>

            <section className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900">
                Allergies
            </h2>

            {allergies && allergies.length > 0 ? (
                <ul className="mt-4 list-inside list-disc space-y-2 text-slate-800">
                {allergies.map((allergy) => (
                    <li key={allergy.allergy_id}>
                    {allergy.allergy_name}
                    </li>
                ))}
                </ul>
            ) : (
                <p className="mt-3 text-slate-600">
                No known or reported allergies.
                </p>
            )}
            </section>

            <section className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Additional Medical Conditions
                </h2>

                {additionalConditions && additionalConditions.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
                    {additionalConditions.map((item) => (
                        <li key={item.condition}>
                        {item.category}: {item.condition_name}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">No additional conditions recorded.</p>
                )}
            </section>

            <section className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Maintenance Medications
                </h2>

                {medications && medications.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
                    {medications.map((item) => (
                        <li key={item.medication_id}>
                        {item.medication_name} — {item.frequency}
                        {item.dosage ? ` (${item.dosage})` : ""}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">No maintenance medications recorded.</p>
                )}
            </section>

            <section className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Previous Illnesses and Surgeries
                </h2>

                {previousHistory && previousHistory.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
                    {previousHistory.map((item) => (
                        <li key={item.history_id}>
                        {item.type}: {item.description}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">
                    No previous illnesses or surgeries recorded.
                    </p>
                )}
            </section>

            <section className="mt-8 border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Immunization History
                </h2>

                {immunizations && immunizations.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-3 pl-6 text-slate-800">
                    {immunizations.map((item) => (
                        <li key={item.history_id}>
                        <span className="font-medium">{item.vaccine_name}</span>
                        {" — "}
                        {item.dose_label}
                        {item.date_administered
                            ? ` | ${item.date_administered}`
                            : " | Date not recorded"}
                        {item.vaccine_brand ? ` | ${item.vaccine_brand}` : ""}
                        {item.remarks && (
                            <p className="mt-1 text-sm text-slate-600">{item.remarks}</p>
                        )}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">
                    No immunization entries recorded.
                    </p>
                )}

                <p className="mt-4 text-sm text-slate-600">
                    <span className="font-medium">History Status:</span>{" "}
                        {patient.no_reported_immunizations
                        ? "No reported immunization history"
                        : immunizations && immunizations.length > 0
                        ? "Reported immunization entries listed above"
                        : "No immunization history status recorded"}
                </p>

                {patient.immunization_general_remarks && (
                    <p className="mt-2 text-sm text-slate-600">
                        <span className="font-medium">Additional Remarks:</span>{" "}
                        {patient.immunization_general_remarks}
                    </p>
                )}
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}