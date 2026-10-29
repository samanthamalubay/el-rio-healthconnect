"use server";

import { createClient } from "@/lib/supabase/server";
import {
         validateHistoryArrays,
         validateHistoryConfirmations,
         validateAdditionalHistory,
         validateFixedHistoryFields,
         validateImmunizationDates,
         validateHistoryLimits,
       } from "./history-validation";

export type RegistrationState = {
  error: string | null;
  success: boolean;
};

type DemographicValidationResult =
  | { valid: true }
  | { valid: false; error: string };

function validateDemographics(
  formData: FormData
): DemographicValidationResult {
  const requiredFields = [
    ["last_name", "Last name"],
    ["first_name", "First name"],
    ["date_of_birth", "Date of birth"],
    ["sex", "Sex"],
    ["house_street_address", "House/Street address"],
    ["barangay", "Barangay"],
    ["city", "City"],
  ] as const;

  // Check that each required field contains text.
  for (const [field, label] of requiredFields) {
    const value = formData.get(field);

    if (typeof value !== "string" || !value.trim()) {
      return {
        valid: false,
        error: `${label} is required.`,
      };
    }
  }

  const sex = formData.get("sex");

  if (sex !== "Male" && sex !== "Female") {
    return {
      valid: false,
      error: "Please select a valid sex.",
    };
  }

  // Validate the date and determine whether the patient is a minor.
  const dob = formData.get("date_of_birth") as string;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return {
      valid: false,
      error: "Please enter a valid date of birth.",
    };
  }

  const [year, month, day] = dob.split("-").map(Number);
  const birthDate = new Date(Date.UTC(year, month - 1, day));

  if (
    birthDate.getUTCFullYear() !== year ||
    birthDate.getUTCMonth() !== month - 1 ||
    birthDate.getUTCDate() !== day
  ) {
    return {
      valid: false,
      error: "Date of birth is invalid.",
    };
  }

  const today = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Manila",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                }).format(new Date());

  const [todayYear, todayMonth, todayDay] = today
                .split("-")
                .map(Number);

  if (
    year > todayYear ||
    (year === todayYear &&
      (month > todayMonth ||
        (month === todayMonth && day > todayDay)))
  ) {
    return {
      valid: false,
      error: "Date of birth cannot be in the future.",
    };
  }

  const age =
    todayYear -
    year -
    (todayMonth < month ||
    (todayMonth === month && todayDay < day)
      ? 1
      : 0);

  if (age < 18) {
    const minorFields = [
      ["guardian_name", "Guardian name"],
      ["guardian_relationship", "Guardian relationship"],
      ["emergency_contact_name", "Emergency contact name"],
      ["emergency_contact_relationship", "Emergency contact relationship"],
      ["emergency_contact_number", "Emergency contact number"],
    ] as const;

    for (const [field, label] of minorFields) {
      const value = formData.get(field);

      if (typeof value !== "string" || !value.trim()) {
        return {
          valid: false,
          error: `${label} is required for minors.`,
        };
      }
    }
  }

  return { valid: true };
}

function validateDemographicLengths(
  formData: FormData
    ): { valid: true } | { valid: false; error: string } {
      const limits: Record<string, number> = {
        last_name: 100,
        first_name: 100,
        middle_initial: 5,
        sex: 10,
        contact_number: 20,
        barangay: 100,
        city: 100,
        religion: 100,
        civil_status: 20,
        educational_attainment: 100,
        occupation: 100,
        spouse_maiden_name: 200,
        spouse_occupation: 100,
        spouse_contact_number: 20,
        guardian_name: 200,
        guardian_relationship: 100,
        emergency_contact_name: 200,
        emergency_contact_relationship: 100,
        emergency_contact_number: 20,
      };

      for (const [field, maximum] of Object.entries(limits)) {
        const value = formData.get(field);

        if (value !== null && typeof value !== "string") {
          return {
            valid: false,
            error: `Invalid value for ${field}.`,
          };
        }

        if (typeof value === "string" && value.trim().length > maximum) {
          return {
            valid: false,
            error: `${field.replaceAll("_", " ")} exceeds ${maximum} characters.`,
          };
        }
      }

      const civilStatus = formData.get("civil_status");

      const allowedStatuses = [
        "Single",
        "Married",
        "Widowed",
        "Annulled",
        "Separated",
        "Cohabitant",
      ];

      if (
        civilStatus !== null &&
        civilStatus !== "" &&
        !allowedStatuses.includes(civilStatus as string)
      ) {
        return {
          valid: false,
          error: "Please select a valid civil status.",
        };
      }

      return { valid: true };
}

function validateContactCompleteness(
    formData: FormData
  ): { valid: true } | { valid: false; error: string } {
    const name = String(
      formData.get("emergency_contact_name") ?? ""
    ).trim();

    const relationship = String(
      formData.get("emergency_contact_relationship") ?? ""
    ).trim();

    const number = String(
      formData.get("emergency_contact_number") ?? ""
    ).trim();

    const hasAnyContactDetail =
      name !== "" || relationship !== "" || number !== "";

    const hasCompleteContact =
      name !== "" && relationship !== "" && number !== "";

    if (hasAnyContactDetail && !hasCompleteContact) {
      return {
        valid: false,
        error:
          "Please complete the emergency contact's name, relationship, and number.",
      };
    }

    return { valid: true };
}

function prepareDemographics(formData: FormData, userId: string) {
  // Required fields have already passed validation.
  function required(name: string): string {
    return (formData.get(name) as string).trim();
  }

  // Optional blank fields are stored as NULL in PostgreSQL.
  function optional(name: string): string | null {
    const value = formData.get(name);

    if (typeof value !== "string") {
      return null;
    }

    return value.trim() || null;
  }

  return {
    last_name: required("last_name"),
    first_name: required("first_name"),
    middle_initial: optional("middle_initial"),
    date_of_birth: required("date_of_birth"),
    sex: required("sex"),

    contact_number: optional("contact_number"),
    religion: optional("religion"),
    civil_status: optional("civil_status"),
    educational_attainment: optional("educational_attainment"),
    occupation: optional("occupation"),

    spouse_maiden_name: optional("spouse_maiden_name"),
    spouse_occupation: optional("spouse_occupation"),
    spouse_contact_number: optional("spouse_contact_number"),

    house_street_address: required("house_street_address"),
    barangay: required("barangay"),
    city: required("city"),

    guardian_name: optional("guardian_name"),
    guardian_relationship: optional("guardian_relationship"),

    emergency_contact_name: optional("emergency_contact_name"),
    emergency_contact_relationship: optional(
      "emergency_contact_relationship"
    ),
    emergency_contact_number: optional("emergency_contact_number"),

    created_by: userId,
  };
}

function prepareFixedMedicalHistory(formData: FormData) {
  function checked(name: string): boolean {
    return formData.get(name) === "true";
  }

  function yesNo(name: string): boolean {
    return formData.get(name) === "true";
  }

  function optional(name: string): string | null {
    const value = formData.get(name);

    if (typeof value !== "string") {
      return null;
    }

    return value.trim() || null;
  }

  return {
    // Past Medical History
    has_hypertension: checked("has_hypertension"),
    has_diabetes: checked("has_diabetes"),
    has_sti_hiv: checked("has_sti_hiv"),
    has_heart_disease: checked("has_heart_disease"),
    has_kidney_failure: checked("has_kidney_failure"),
    has_tuberculosis: checked("has_tuberculosis"),

    // Family Medical History
    family_history_asthma_allergies: checked("family_history_asthma_allergies"),
    family_history_birth_defects: checked("family_history_birth_defects"),
    family_history_cancer: checked("family_history_cancer"),
    family_history_dementia: checked("family_history_dementia"),
    family_history_diabetes: checked("family_history_diabetes"),
    family_history_hypertension: checked("family_history_hypertension"),
    family_history_kidney_disease: checked("family_history_kidney_disease"),
    family_history_mental_illness: checked("family_history_mental_illness"),

    // Personal / Social History
    social_healthy_diet: yesNo("social_healthy_diet"),
    social_adequate_physical_activity: yesNo("social_adequate_physical_activity"),
    social_sufficient_sleep: yesNo("social_sufficient_sleep"),
    social_normal_growth_development: yesNo("social_normal_growth_development"),
    social_multiple_sex_partners: yesNo("social_multiple_sex_partners"),
    social_smokes_tobacco: yesNo("social_smokes_tobacco"),
    social_drinks_alcohol: yesNo("social_drinks_alcohol"),
    social_takes_illicit_drugs: yesNo("social_takes_illicit_drugs"),

    // Additional Social History
    social_smoking_packs_per_year: optional("social_smoking_packs_per_year"),
    social_alcohol_bottles_per_day: optional("social_alcohol_bottles_per_day"),
    social_illicit_drugs_details: optional("social_illicit_drugs_details"),

    // Immunization History
    no_reported_immunizations: checked("no_reported_immunizations"),
    immunization_general_remarks: optional("immunization_general_remarks"),
  };
}

export async function registerPatient(
  previousState: RegistrationState,
  formData: FormData
): Promise<RegistrationState> {
  const supabase = await createClient();

  // Step 1: Verify the authenticated user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "You must be signed in to register a patient.",
      success: false,
    };
  }

  // Step 2: Verify the BHW's role and active status.
  const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "BHW" ||
    !profile.is_active
  ) {
    return {
      error: "You are not authorized to register patients.",
      success: false,
    };
  }

  // Step 3: Validate the submitted demographic information.
  const validation = validateDemographics(formData);

  if (!validation.valid) {
        return {
            error: validation.error,
            success: false,
        };
    }
  // Validate demographic field lengths and allowed values.
  const demographicLengths = validateDemographicLengths(formData);

  if (!demographicLengths.valid) {
    return {
      error: demographicLengths.error,
      success: false,
    };
  }

  // Validate optional emergency-contact completeness.
  const contactValidation = validateContactCompleteness(formData);

  if (!contactValidation.valid) {
    return {
      error: contactValidation.error,
      success: false,
    };
  }

  // Step 4: Validate the repeatable medical-history entries.
  const historyValidation = validateHistoryArrays(formData);

  if (!historyValidation.valid) {
    return {
      error: historyValidation.error,
      success: false,
    };
  }

  // Step 5: Prepare the demographic and history data.
  const patientData = prepareDemographics(formData, user.id);
  const medicalHistoryData = historyValidation.data;

  // Step 6: Validate medical-history confirmations.
  const confirmationValidation = validateHistoryConfirmations(
    formData,
    medicalHistoryData
  );

  if (!confirmationValidation.valid) {
    return {
      error: confirmationValidation.error,
      success: false,
    };
  }

  // Validate fixed medical-history checkbox values.
  const fixedHistoryValidation = validateFixedHistoryFields(formData);

  if (!fixedHistoryValidation.valid) {
    return {
      error: fixedHistoryValidation.error,
      success: false,
    };
  }

  // Validate dates supplied in immunization history.
  const immunizationDateValidation =
    validateImmunizationDates(medicalHistoryData);

  if (!immunizationDateValidation.valid) {
    return {
      error: immunizationDateValidation.error,
      success: false,
    };
  }

  // Validate medical-history entry counts and text lengths.
  const historyLimitsValidation = validateHistoryLimits(
    formData,
    medicalHistoryData
  );

  if (!historyLimitsValidation.valid) {
    return {
      error: historyLimitsValidation.error,
      success: false,
    };
  }

  // Step 7: Validate allergies and social-history answers.
  const additionalValidation = validateAdditionalHistory(
    formData,
    medicalHistoryData
  );

  if (!additionalValidation.valid) {
    return {
      error: additionalValidation.error,
      success: false,
    };
  }

  const fixedMedicalHistoryData = prepareFixedMedicalHistory(formData);

  const itrData = {
    ...patientData,
    ...fixedMedicalHistoryData,
  };

  const { data: itrId, error: registrationError } = await supabase.rpc(
    "register_complete_itr",
    {
      p_payload: {
        itr: itrData,
        allergies: medicalHistoryData.allergies,
        additionalConditions: medicalHistoryData.additionalConditions,
        medications: medicalHistoryData.medications,
        previousHistory: medicalHistoryData.previousHistory,
        immunizations: medicalHistoryData.immunizations,
      },
    }
  );

  if (registrationError) {
    console.error("Patient registration failed:", registrationError);

    return {
      error: "Unable to register patient. Please try again.",
      success: false,
    };
  }

  if (!itrId) {
    return {
      error: "Registration did not return an ITR ID.",
      success: false,
    };
  }

  return {
    error: null,
    success: true,
  };
}