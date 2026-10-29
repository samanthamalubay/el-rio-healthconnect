type ValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; error: string };

export type HistoryEntry = {
  category: "Cancer" | "Other";
  conditionName: string;
};

export type AllergyEntry = {
  allergyName: string;
};

export type MedicationEntry = {
  medicationName: string;
  frequency: string;
  dosage: string;
};

export type PreviousHistoryEntry = {
  type: "Illness" | "Surgery";
  description: string;
};

export type ImmunizationEntry = {
  vaccineName: string;
  doseLabel: string;
  dateAdministered: string;
  vaccineBrand: string;
  remarks: string;
};

export type MedicalHistoryData = {
  additionalConditions: HistoryEntry[];
  allergies: AllergyEntry[];
  medications: MedicationEntry[];
  previousHistory: PreviousHistoryEntry[];
  immunizations: ImmunizationEntry[];
};

export function validateHistoryArrays(
  formData: FormData
): ValidationResult<MedicalHistoryData> {
  const fields = [
    "additional_conditions",
    "allergies",
    "maintenance_medications",
    "previous_illnesses_surgeries",
    "immunization_history",
  ] as const;

  const parsed: Record<string, unknown> = {};

  for (const field of fields) {
    const raw = formData.get(field);

    if (typeof raw !== "string") {
      return {
        valid: false,
        error: `Missing medical history field: ${field}`,
      };
    }

    try {
      parsed[field] = JSON.parse(raw);
    } catch {
      return {
        valid: false,
        error: `Invalid medical history data: ${field}`,
      };
    }

    if (!Array.isArray(parsed[field])) {
      return {
        valid: false,
        error: `Medical history must be a list: ${field}`,
      };
    }
  }

  function isObject(value: unknown): value is Record<string, unknown> {
    return (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    );
  }

  function isText(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
  }

  const additionalConditions = parsed.additional_conditions as unknown[];
  const allergies = parsed.allergies as unknown[];
  const medications = parsed.maintenance_medications as unknown[];
  const previousHistory = parsed.previous_illnesses_surgeries as unknown[];
  const immunizations = parsed.immunization_history as unknown[];

  if (
    !additionalConditions.every(
      (item) =>
        isObject(item) &&
        (item.category === "Cancer" || item.category === "Other") &&
        isText(item.conditionName)
    )
  ) {
    return {
      valid: false,
      error: "Please complete all additional medical conditions.",
    };
  }

  if (
    !allergies.every(
      (item) => isObject(item) && isText(item.allergyName)
    )
  ) {
    return {
      valid: false,
      error: "Please complete all allergy entries.",
    };
  }

  if (
    !medications.every(
      (item) =>
        isObject(item) &&
        isText(item.medicationName) &&
        isText(item.frequency) &&
        typeof item.dosage === "string"
    )
  ) {
    return {
      valid: false,
      error: "Please complete medication names and frequencies.",
    };
  }

  if (
    !previousHistory.every(
      (item) =>
        isObject(item) &&
        (item.type === "Illness" || item.type === "Surgery") &&
        isText(item.description)
    )
  ) {
    return {
      valid: false,
      error: "Please complete all previous illness and surgery entries.",
    };
  }

  if (
    !immunizations.every(
      (item) =>
        isObject(item) &&
        isText(item.vaccineName) &&
        isText(item.doseLabel) &&
        typeof item.dateAdministered === "string" &&
        typeof item.vaccineBrand === "string" &&
        typeof item.remarks === "string"
    )
  ) {
    return {
      valid: false,
      error: "Please complete all immunization entries.",
    };
  }

  return {
    valid: true,
    data: {
      additionalConditions: additionalConditions as HistoryEntry[],
      allergies: allergies as AllergyEntry[],
      medications: medications as MedicationEntry[],
      previousHistory: previousHistory as PreviousHistoryEntry[],
      immunizations: immunizations as ImmunizationEntry[],
    },
  };
}

export function validateHistoryConfirmations(
  formData: FormData,
  history: MedicalHistoryData
): { valid: true } | { valid: false; error: string } {
  function confirmed(name: string): boolean {
    return formData.get(name) === "true";
  }

  const fixedConditions = [
    "has_hypertension",
    "has_diabetes",
    "has_sti_hiv",
    "has_heart_disease",
    "has_kidney_failure",
    "has_tuberculosis",
  ];

  const familyConditions = [
    "family_history_asthma_allergies",
    "family_history_birth_defects",
    "family_history_cancer",
    "family_history_dementia",
    "family_history_diabetes",
    "family_history_hypertension",
    "family_history_kidney_disease",
    "family_history_mental_illness",
  ];

  const hasFixedCondition = fixedConditions.some(
    (name) => formData.get(name) === "true"
  );

  const hasFamilyCondition = familyConditions.some(
    (name) => formData.get(name) === "true"
  );

  const checks = [
    {
      label: "Past Medical History",
      hasEntries: hasFixedCondition || history.additionalConditions.length > 0,
      noReported: confirmed("no_reported_conditions"),
    },
    {
      label: "Family Medical History",
      hasEntries: hasFamilyCondition,
      noReported: confirmed("no_reported_family_history"),
    },
    {
      label: "Maintenance Medications",
      hasEntries: history.medications.length > 0,
      noReported: confirmed("no_reported_medications"),
    },
    {
      label: "Previous Illnesses and Surgeries",
      hasEntries: history.previousHistory.length > 0,
      noReported: confirmed("no_reported_previous_history"),
    },
    {
      label: "Immunization History",
      hasEntries: history.immunizations.length > 0,
      noReported: confirmed("no_reported_immunizations"),
    },
  ];

  for (const check of checks) {
    if (check.hasEntries && check.noReported) {
      return {
        valid: false,
        error: `${check.label} contains contradictory answers.`,
      };
    }

    if (!check.hasEntries && !check.noReported) {
      return {
        valid: false,
        error: `Please complete ${check.label}.`,
      };
    }
  }

  return { valid: true };
}

export function validateAdditionalHistory(
  formData: FormData,
  history: MedicalHistoryData
): { valid: true } | { valid: false; error: string } {
  // Allergies present must agree with the allergy entries.
  const hasAllergies = formData.get("has_allergies") === "true";

  if (hasAllergies && history.allergies.length === 0) {
    return {
      valid: false,
      error: "Please specify at least one reported allergy.",
    };
  }

  if (!hasAllergies && history.allergies.length > 0) {
    return {
      valid: false,
      error: "Allergy information contains contradictory answers.",
    };
  }

  const socialFields = [
    "social_healthy_diet",
    "social_adequate_physical_activity",
    "social_sufficient_sleep",
    "social_normal_growth_development",
    "social_multiple_sex_partners",
    "social_smokes_tobacco",
    "social_drinks_alcohol",
    "social_takes_illicit_drugs",
  ];

  for (const field of socialFields) {
    const answer = formData.get(field);

    if (answer !== "true" && answer !== "false") {
      return {
        valid: false,
        error: `Please complete the social-history field: ${field}.`,
      };
    }
  }

  return { valid: true };
}

export function validateFixedHistoryFields(
  formData: FormData
): { valid: true } | { valid: false; error: string } {
  const checkboxFields = [
    "has_hypertension",
    "has_diabetes",
    "has_sti_hiv",
    "has_heart_disease",
    "has_kidney_failure",
    "has_tuberculosis",
    "family_history_asthma_allergies",
    "family_history_birth_defects",
    "family_history_cancer",
    "family_history_dementia",
    "family_history_diabetes",
    "family_history_hypertension",
    "family_history_kidney_disease",
    "family_history_mental_illness",
  ];

  const confirmationFields = [
    "no_reported_conditions",
    "no_reported_family_history",
    "no_reported_medications",
    "no_reported_previous_history",
    "no_reported_immunizations",
    "has_allergies",
  ];

  for (const field of checkboxFields) {
    const values = formData.getAll(field);

    if (
      values.length > 1 ||
      (values.length === 1 && values[0] !== "true")
    ) {
      return {
        valid: false,
        error: `Invalid checkbox value: ${field}`,
      };
    }
  }

  for (const field of confirmationFields) {
    const values = formData.getAll(field);

    if (
      values.length !== 1 ||
      (values[0] !== "true" && values[0] !== "false")
    ) {
      return {
        valid: false,
        error: `Invalid confirmation value: ${field}`,
      };
    }
  }

  return { valid: true };
}

export function validateImmunizationDates(
  history: MedicalHistoryData
): { valid: true } | { valid: false; error: string } {
  const today = new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Manila",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                }).format(new Date());

  for (const entry of history.immunizations) {
    const date = entry.dateAdministered;

    // An unknown vaccination date is allowed.
    if (date === "") {
      continue;
    }

    // Require the YYYY-MM-DD format.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return {
        valid: false,
        error: `Invalid immunization date for ${entry.vaccineName}.`,
      };
    }

    // Check that the date exists on the calendar.
    const parsed = new Date(`${date}T00:00:00Z`);

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date
    ) {
      return {
        valid: false,
        error: `Invalid immunization date for ${entry.vaccineName}.`,
      };
    }

    // A vaccination cannot have occurred in the future.
    if (date > today) {
      return {
        valid: false,
        error: `Immunization date cannot be in the future: ${entry.vaccineName}.`,
      };
    }
  }

  return { valid: true };
}

export function validateHistoryLimits(
  formData: FormData,
  history: MedicalHistoryData
): { valid: true } | { valid: false; error: string } {
  const sections = [
    { name: "Additional conditions", entries: history.additionalConditions },
    { name: "Allergies", entries: history.allergies },
    { name: "Maintenance medications", entries: history.medications },
    { name: "Previous illnesses and surgeries", entries: history.previousHistory },
    { name: "Immunizations", entries: history.immunizations },
  ];

  // Limit the number of entries in each section.
  for (const section of sections) {
    if (section.entries.length > 50) {
      return {
        valid: false,
        error: `${section.name} exceeds the maximum of 50 entries.`,
      };
    }
  }

  // Limit text within each repeatable entry.
  for (const section of sections) {
    for (const entry of section.entries) {
      for (const value of Object.values(entry)) {
        if (typeof value === "string" && value.length > 1000) {
          return {
            valid: false,
            error: `${section.name} contains text exceeding 1000 characters.`,
          };
        }
      }
    }
  }

  // Limit additional free-text fields.
  const textFields = [
    "social_smoking_packs_per_year",
    "social_alcohol_bottles_per_day",
    "social_illicit_drugs_details",
    "immunization_general_remarks",
  ];

  for (const field of textFields) {
    const value = formData.get(field);

    if (
        value !== null &&
        (typeof value !== "string" || value.length > 2000)
        ) {
      return {
        valid: false,
        error: `Invalid or excessively long value for ${field}.`,
      };
    }
  }

  return { valid: true };
}