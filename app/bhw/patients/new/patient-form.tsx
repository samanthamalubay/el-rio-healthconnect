"use client";

import { useActionState, useState } from "react";
import { registerPatient } from "./actions";

export default function PatientForm() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState("");
  const [sameAsGuardian, setSameAsGuardian] = useState(false);
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelationship, setEmergencyRelationship] = useState("");
  const [additionalConditions, setAdditionalConditions] = useState<
        { id: number; category: "Cancer" | "Other"; conditionName: string }[]
        >([]);
  const [noReportedConditions, setNoReportedConditions] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [allergies, setAllergies] = useState<
        { id: number; allergyName: string }[]
        >([]);
  const [maintenanceMedications, setMaintenanceMedications] = useState<
        {
          id: number;
          medicationName: string;
          frequency: string;
          dosage: string;
        }[]
        >([]);
  const [previousIllnessesSurgeries, setPreviousIllnessesSurgeries] =
        useState<
          {
            id: number;
            type: "Illness" | "Surgery";
            description: string;
          }[]
        >([]);
  const [selectedFamilyConditions, setSelectedFamilyConditions] =
        useState<string[]>([]);
  const [noReportedFamilyHistory, setNoReportedFamilyHistory] =
        useState(false);
  const [smokesTobacco, setSmokesTobacco] = useState("");
  const [drinksAlcohol, setDrinksAlcohol] = useState("");
  const [takesIllicitDrugs, setTakesIllicitDrugs] = useState("");
  const [immunizationHistory, setImmunizationHistory] = useState<
        {
          id: number;
          vaccineName: string;
          doseLabel: string;
          dateAdministered: string;
          vaccineBrand: string;
          remarks: string;
        }[]
        >([]);
  const [noReportedMedications, setNoReportedMedications] = useState(false);
  const [noReportedPreviousHistory, setNoReportedPreviousHistory] =
        useState(false);
  const [noReportedImmunizations, setNoReportedImmunizations] =
        useState(false);
  const [immunizationRemarks, setImmunizationRemarks] =
        useState("");
  const [registrationState, formAction, isPending] = useActionState(
          registerPatient,
          {
            error: null,
            success: false,
          }
        );


  const isMinor = dateOfBirth
    ? (() => {
        const today = new Date();
        const birthDate = new Date(`${dateOfBirth}T00:00:00`);

        let age = today.getFullYear() - birthDate.getFullYear();

        if (
          today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        return age < 18;
      })()
    : false;

  const inputStyle =
    "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900";

  const labelStyle =
    "block text-sm font-medium text-slate-700";

  return (
    <form action={formAction} className="space-y-8">
      {/* Personal Information */} 
      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Personal Information
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="last_name" className={labelStyle}>
              Last Name *
            </label>
            <input
              id="last_name"
              name="last_name"
              required
              maxLength={100}
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="first_name" className={labelStyle}>
              First Name *
            </label>
            <input
              id="first_name"
              name="first_name"
              required
              maxLength={100}
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="middle_initial" className={labelStyle}>
              Middle Initial
            </label>
            <input
              id="middle_initial"
              name="middle_initial"
              maxLength={5}
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="date_of_birth" className={labelStyle}>
              Date of Birth *
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              required
              value={dateOfBirth}
              onChange={(event) =>
                setDateOfBirth(event.target.value)
              }
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="sex" className={labelStyle}>
              Sex *
            </label>
            <select
              id="sex"
              name="sex"
              required
              defaultValue=""
              className={inputStyle}
            >
              <option value="" disabled>
                Select sex
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact_number" className={labelStyle}>
              Contact Number
            </label>
            <input
              id="contact_number"
              name="contact_number"
              type="tel"
              maxLength={20}
              className={inputStyle}
            />
          </div>
        </div>
      </section>

      {/* Additional Personal Information */} 
      <section>
        <h2 className="text-xl font-semibold text-slate-900">
            Additional Personal Information
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
            <label htmlFor="religion" className={labelStyle}>
                Religion
            </label>
            <input
                id="religion"
                name="religion"
                maxLength={100}
                className={inputStyle}
            />
            </div>

            <div>
            <label htmlFor="civil_status" className={labelStyle}>
                Civil Status
            </label>
            <select
                id="civil_status"
                name="civil_status"
                defaultValue=""
                className={inputStyle}
            >
                <option value="">Select civil status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Annulled">Annulled</option>
                <option value="Separated">Separated</option>
                <option value="Cohabitant">Cohabitant</option>
            </select>
            </div>

            <div>
            <label htmlFor="educational_attainment" className={labelStyle}>
                Educational Attainment
            </label>
            <input
                id="educational_attainment"
                name="educational_attainment"
                maxLength={100}
                className={inputStyle}
            />
            </div>

            <div>
            <label htmlFor="occupation" className={labelStyle}>
                Occupation
            </label>
            <input
                id="occupation"
                name="occupation"
                maxLength={100}
                className={inputStyle}
            />
            </div>
        </div>
      </section>

      {/* Spouse */} 
      <section>
        <h2 className="text-xl font-semibold text-slate-900">
            Spouse Information
        </h2>

        <p className="mt-1 text-sm text-slate-600">
            Complete when applicable.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
            <label htmlFor="spouse_maiden_name" className={labelStyle}>
                Spouse Maiden Name
            </label>
            <input
                id="spouse_maiden_name"
                name="spouse_maiden_name"
                maxLength={200}
                className={inputStyle}
            />
            </div>

            <div>
            <label htmlFor="spouse_occupation" className={labelStyle}>
                Spouse Occupation
            </label>
            <input
                id="spouse_occupation"
                name="spouse_occupation"
                maxLength={100}
                className={inputStyle}
            />
            </div>

            <div>
            <label htmlFor="spouse_contact_number" className={labelStyle}>
                Spouse Contact Number
            </label>
            <input
                id="spouse_contact_number"
                name="spouse_contact_number"
                type="tel"
                maxLength={20}
                className={inputStyle}
            />
            </div>
        </div>
      </section>

      {/* Address */}         
      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Address
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="house_street_address" className={labelStyle}>
              House Number / Street *
            </label>
            <input
              id="house_street_address"
              name="house_street_address"
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="barangay" className={labelStyle}>
              Barangay *
            </label>
            <input
              id="barangay"
              name="barangay"
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="city" className={labelStyle}>
              City *
            </label>
            <input
              id="city"
              name="city"
              required
              className={inputStyle}
            />
          </div>
        </div>
      </section>
      
      {/* Guardian */} 
      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Guardian Information
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Required for patients under 18 years old.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="guardian_name" className={labelStyle}>
              Guardian Name {isMinor ? "*" : ""}
            </label>
            <input
              id="guardian_name"
              name="guardian_name"
              required={isMinor}
              className={inputStyle}
              value={guardianName}
              onChange={(event) => setGuardianName(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="guardian_relationship" className={labelStyle}>
              Relationship {isMinor ? "*" : ""}
            </label>
            <input
              id="guardian_relationship"
              name="guardian_relationship"
              required={isMinor}
              className={inputStyle}
              value={guardianRelationship}
              onChange={(event) =>
                setGuardianRelationship(event.target.value)
                }
            />
          </div>
        </div>
      </section>

      {/* Emergency Contact */}           
      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Emergency Contact
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Required for minors; optional for adults.
        </p>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
            <input
                type="checkbox"
                checked={sameAsGuardian}
                onChange={(event) =>
                setSameAsGuardian(event.target.checked)
                }
                className="h-4 w-4"
            />
            Same as Guardian
        </label>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="emergency_contact_name"
              className={labelStyle}
            >
              Contact Name {isMinor ? "*" : ""}
            </label>
            <input
              id="emergency_contact_name"
              name="emergency_contact_name"
              required={isMinor}
              className={inputStyle}
              value={sameAsGuardian ? guardianName : emergencyName}
              onChange={(event) => setEmergencyName(event.target.value)}
              readOnly={sameAsGuardian}
            />
          </div>

          <div>
            <label
              htmlFor="emergency_contact_relationship"
              className={labelStyle}
            >
              Relationship {isMinor ? "*" : ""}
            </label>
            <input
              id="emergency_contact_relationship"
              name="emergency_contact_relationship"
              required={isMinor}
              className={inputStyle}
              value={
                        sameAsGuardian
                        ? guardianRelationship
                        : emergencyRelationship
                    }
              onChange={(event) =>
                        setEmergencyRelationship(event.target.value)
                       }
              readOnly={sameAsGuardian}
            />
          </div>

          <div>
            <label
              htmlFor="emergency_contact_number"
              className={labelStyle}
            >
              Contact Number {isMinor ? "*" : ""}
            </label>
            <input
              id="emergency_contact_number"
              name="emergency_contact_number"
              type="tel"
              required={isMinor}
              className={inputStyle}
            />
          </div>
        </div>
      </section>

      {/* Past Medical History */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xl font-semibold">
            Past Medical History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select all medical conditions reported by the patient.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "has_hypertension", label: "Hypertension" },
            { name: "has_diabetes", label: "Diabetes" },
            { name: "has_sti_hiv", label: "STI / HIV" },
            { name: "has_heart_disease", label: "Heart Disease" },
            { name: "has_kidney_failure", label: "Kidney Failure" },
            { name: "has_tuberculosis", label: "Tuberculosis" },
          ].map((condition) => (
            <label
              key={condition.name}
              className="flex items-center gap-3 rounded-md border p-3"
            >
              <input
                type="checkbox"
                name={condition.name}
                value="true"
                checked={selectedConditions.includes(condition.name)}
                onChange={(event) => {
                  if (event.target.checked) {
                    setSelectedConditions((previous) => [
                      ...previous,
                      condition.name,
                    ]);

                    setNoReportedConditions(false);
                  } else {
                    setSelectedConditions((previous) =>
                      previous.filter((name) => name !== condition.name)
                    );
                  }
                }}
                className="h-4 w-4"
              />

              <span>{condition.label}</span>
            </label>
          ))}
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium">Cancer and Other Conditions</h3>

          {additionalConditions.map((condition) => (
            <div
              key={condition.id}
              className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_2fr_auto]"
            >
              <select
                value={condition.category}
                onChange={(event) =>
                  setAdditionalConditions((previous) =>
                    previous.map((item) =>
                      item.id === condition.id
                        ? {
                            ...item,
                            category: event.target.value as "Cancer" | "Other",
                          }
                        : item
                    )
                  )
                }
                className={inputStyle}
              >
                <option value="Cancer">Cancer</option>
                <option value="Other">Other Condition</option>
              </select>

              <input
                type="text"
                placeholder={
                  condition.category === "Cancer"
                    ? "Specify cancer type"
                    : "Specify medical condition"
                }
                value={condition.conditionName}
                onChange={(event) =>
                  setAdditionalConditions((previous) =>
                    previous.map((item) =>
                      item.id === condition.id
                        ? { ...item, conditionName: event.target.value }
                        : item
                    )
                  )
                }
                className={inputStyle}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setAdditionalConditions((previous) =>
                    previous.filter((item) => item.id !== condition.id)
                  )
                }
                className="rounded-md border px-3 py-2 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
                      setNoReportedConditions(false);

                      setAdditionalConditions((previous) => [
                        ...previous,
                        {
                          id: Date.now(),
                          category: "Other",
                          conditionName: "",
                        },
                      ]);
                    }}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            + Add Condition
          </button>
        </div>

        <label className="flex items-center gap-3 rounded-md border p-3">
          <input
            type="checkbox"
            checked={noReportedConditions}
            onChange={(event) => {
                        const checked = event.target.checked;

                        setNoReportedConditions(checked);

                        if (checked) {
                          setSelectedConditions([]);
                          setAdditionalConditions([]);
                        }
                      }}
            className="h-4 w-4"
          />

          <span>No reported medical conditions</span>
        </label>

      </section>

      {/* Allergies */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xl font-semibold">Allergies</h2>

          <p className="mt-1 text-sm text-gray-500">
            Record any known or reported allergies.
          </p>
        </div>

        <label className="flex items-center gap-3 rounded-md border p-3">
          <input
            type="checkbox"
            checked={hasAllergies}
            onChange={(event) => {
              const checked = event.target.checked;

              setHasAllergies(checked);

              if (checked && allergies.length === 0) {
                setAllergies([
                  { id: Date.now(), allergyName: "" },
                ]);
              }

              if (!checked) {
                setAllergies([]);
              }
            }}
            className="h-4 w-4"
          />

          <span>Allergies present</span>
        </label>

        {hasAllergies && (
          <div className="space-y-3">
            {allergies.map((allergy) => (
              <div
                key={allergy.id}
                className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row"
              >
                <input
                  type="text"
                  placeholder="Specify allergy (e.g., Penicillin)"
                  value={allergy.allergyName}
                  onChange={(event) =>
                    setAllergies((previous) =>
                      previous.map((item) =>
                        item.id === allergy.id
                          ? {
                              ...item,
                              allergyName: event.target.value,
                            }
                          : item
                      )
                    )
                  }
                  className={`${inputStyle} flex-1`}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setAllergies((previous) =>
                      previous.filter((item) => item.id !== allergy.id)
                    )
                  }
                  className="rounded-md border px-3 py-2 text-sm"
                  disabled={allergies.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setAllergies((previous) => [
                  ...previous,
                  {
                    id: Date.now(),
                    allergyName: "",
                  },
                ])
              }
              className="rounded-md border px-4 py-2 text-sm font-medium"
            >
              + Add Another Allergy
            </button>
          </div>
        )}
      </section>

      {/* Maintenance Medications */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xl font-semibold">
            Maintenance Medications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Record medications the patient takes regularly.
          </p>
        </div>

        {maintenanceMedications.map((medication) => (
          <div
            key={medication.id}
            className="grid gap-3 rounded-md border p-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
          >
            <div>
              <label className={labelStyle}>Medication Name *</label>
              <input
                type="text"
                placeholder="e.g., Amlodipine"
                value={medication.medicationName}
                onChange={(event) =>
                  setMaintenanceMedications((previous) =>
                    previous.map((item) =>
                      item.id === medication.id
                        ? { ...item, medicationName: event.target.value }
                        : item
                    )
                  )
                }
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelStyle}>Frequency *</label>
              <input
                type="text"
                placeholder="e.g., Once daily"
                value={medication.frequency}
                onChange={(event) =>
                  setMaintenanceMedications((previous) =>
                    previous.map((item) =>
                      item.id === medication.id
                        ? { ...item, frequency: event.target.value }
                        : item
                    )
                  )
                }
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelStyle}>Dosage</label>
              <input
                type="text"
                placeholder="e.g., 5 mg"
                value={medication.dosage}
                onChange={(event) =>
                  setMaintenanceMedications((previous) =>
                    previous.map((item) =>
                      item.id === medication.id
                        ? { ...item, dosage: event.target.value }
                        : item
                    )
                  )
                }
                className={inputStyle}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setMaintenanceMedications((previous) =>
                  previous.filter((item) => item.id !== medication.id)
                )
              }
              className="self-end rounded-md border px-3 py-2 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
                    setNoReportedMedications(false);

                    setMaintenanceMedications((previous) => [
                      ...previous,
                      {
                        id: Date.now(),
                        medicationName: "",
                        frequency: "",
                        dosage: "",
                      },
                    ]);
                  }}
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          + Add Maintenance Medication
        </button>

        <label className="flex items-center gap-3 rounded-md border p-3">
          <input
            type="checkbox"
            checked={noReportedMedications}
            onChange={(event) => {
              const checked = event.target.checked;

              setNoReportedMedications(checked);

              if (checked) {
                setMaintenanceMedications([]);
              }
            }}
            className="h-4 w-4"
          />

          <span>No reported maintenance medications</span>
        </label>
      </section>

      {/* Previous Illnesses and Surgeries */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xl font-semibold">
            Previous Illnesses and Surgeries
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Record previous illnesses or surgical procedures
            reported by the patient.
          </p>
        </div>

        {previousIllnessesSurgeries.map((entry) => (
          <div
            key={entry.id}
            className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_2fr_auto]"
          >
            <div>
              <label className={labelStyle}>Type *</label>

              <select
                value={entry.type}
                onChange={(event) =>
                  setPreviousIllnessesSurgeries((previous) =>
                    previous.map((item) =>
                      item.id === entry.id
                        ? {
                            ...item,
                            type: event.target.value as
                              | "Illness"
                              | "Surgery",
                          }
                        : item
                    )
                  )
                }
                className={inputStyle}
              >
                <option value="Illness">Previous Illness</option>
                <option value="Surgery">Previous Surgery</option>
              </select>
            </div>

            <div>
              <label className={labelStyle}>Description *</label>

              <input
                type="text"
                placeholder={
                  entry.type === "Illness"
                    ? "e.g., Pneumonia"
                    : "e.g., Appendectomy"
                }
                value={entry.description}
                onChange={(event) =>
                  setPreviousIllnessesSurgeries((previous) =>
                    previous.map((item) =>
                      item.id === entry.id
                        ? {
                            ...item,
                            description: event.target.value,
                          }
                        : item
                    )
                  )
                }
                className={inputStyle}
                required
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setPreviousIllnessesSurgeries((previous) =>
                  previous.filter((item) => item.id !== entry.id)
                )
              }
              className="self-end rounded-md border px-3 py-2 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
                    setNoReportedPreviousHistory(false);

                    setPreviousIllnessesSurgeries((previous) => [
                      ...previous,
                      {
                        id: Date.now(),
                        type: "Illness",
                        description: "",
                      },
                    ]);
                  }}
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          + Add Previous Illness or Surgery
        </button>

        <label className="flex items-center gap-3 rounded-md border p-3">
          <input
            type="checkbox"
            checked={noReportedPreviousHistory}
            onChange={(event) => {
              const checked = event.target.checked;

              setNoReportedPreviousHistory(checked);

              if (checked) {
                setPreviousIllnessesSurgeries([]);
              }
            }}
            className="h-4 w-4"
          />

          <span>No reported previous illnesses or surgeries</span>
        </label>
      </section>

      {/* Family Medical History */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xl font-semibold">
            Family Medical History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select any medical conditions reported among
            the patient's family members.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              name: "family_history_asthma_allergies",
              label: "Asthma / Allergies",
            },
            {
              name: "family_history_birth_defects",
              label: "Birth Defects",
            },
            {
              name: "family_history_cancer",
              label: "Cancer",
            },
            {
              name: "family_history_dementia",
              label: "Dementia",
            },
            {
              name: "family_history_diabetes",
              label: "Diabetes",
            },
            {
              name: "family_history_hypertension",
              label: "Hypertension",
            },
            {
              name: "family_history_kidney_disease",
              label: "Kidney Disease",
            },
            {
              name: "family_history_mental_illness",
              label: "Mental Illness",
            },
          ].map((condition) => (
            <label
              key={condition.name}
              className="flex items-center gap-3 rounded-md border p-3"
            >
            <input
              type="checkbox"
              name={condition.name}
              value="true"
              checked={selectedFamilyConditions.includes(condition.name)}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelectedFamilyConditions((previous) => [
                    ...previous,
                    condition.name,
                  ]);

                  setNoReportedFamilyHistory(false);
                } else {
                  setSelectedFamilyConditions((previous) =>
                    previous.filter((name) => name !== condition.name)
                  );
                }
              }}
              className="h-4 w-4"
            />
              <span>{condition.label}</span>
            </label>
          ))}

          <label className="flex items-center gap-3 rounded-md border p-3">
            <input
              type="checkbox"
              checked={noReportedFamilyHistory}
              onChange={(event) => {
                const checked = event.target.checked;

                setNoReportedFamilyHistory(checked);

                if (checked) {
                  setSelectedFamilyConditions([]);
                }
              }}
              className="h-4 w-4"
            />

            <span>No reported family medical history</span>
          </label>
        </div>
      </section>

      {/* Personal / Social History */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xl font-semibold">
            Personal / Social History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Record the patient's reported lifestyle and health habits.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              name: "social_healthy_diet",
              label: "Healthy Diet",
            },
            {
              name: "social_adequate_physical_activity",
              label: "Adequate Physical Activity",
            },
            {
              name: "social_sufficient_sleep",
              label: "Sufficient Sleep",
            },
            {
              name: "social_normal_growth_development",
              label: "Normal Growth and Development",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_auto]"
            >
              <label className="font-medium">{item.label}</label>

              <select
                name={item.name}
                defaultValue=""
                className={inputStyle}
                required
              >
                <option value="" disabled>
                  Select answer
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium">Additional Social History</h3>

          {/* Multiple Sexual Partners */}
          <div className="rounded-md border p-3">
            <label className={labelStyle}>
              Multiple Sexual Partners *
            </label>

            <select
              name="social_multiple_sex_partners"
              defaultValue=""
              className={inputStyle}
              required
            >
              <option value="" disabled>Select answer</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Tobacco Smoking */}
          <div className="space-y-3 rounded-md border p-3">
            <label className={labelStyle}>Smokes Tobacco *</label>

            <select
              name="social_smokes_tobacco"
              value={smokesTobacco}
              onChange={(event) => setSmokesTobacco(event.target.value)}
              className={inputStyle}
              required
            >
              <option value="" disabled>Select answer</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            {smokesTobacco === "true" && (
              <div>
                <label className={labelStyle}>
                  Smoking History (Packs per Year)
                </label>

                <input
                  type="text"
                  name="social_smoking_packs_per_year"
                  placeholder="e.g., 2 packs/year or occasional smoker"
                  className={inputStyle}
                />
              </div>
            )}
          </div>

          {/* Alcohol Consumption */}
          <div className="space-y-3 rounded-md border p-3">
            <label className={labelStyle}>Drinks Alcohol *</label>

            <select
              name="social_drinks_alcohol"
              value={drinksAlcohol}
              onChange={(event) => setDrinksAlcohol(event.target.value)}
              className={inputStyle}
              required
            >
              <option value="" disabled>Select answer</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            {drinksAlcohol === "true" && (
              <div>
                <label className={labelStyle}>
                  Alcohol Consumption (Bottles per Day)
                </label>

                <input
                  type="text"
                  name="social_alcohol_bottles_per_day"
                  placeholder="e.g., 1 bottle/day or occasionally"
                  className={inputStyle}
                />
              </div>
            )}
          </div>

          {/* Illicit Drug Use */}
          <div className="space-y-3 rounded-md border p-3">
            <label className={labelStyle}>Takes Illicit Drugs *</label>

            <select
              name="social_takes_illicit_drugs"
              value={takesIllicitDrugs}
              onChange={(event) => setTakesIllicitDrugs(event.target.value)}
              className={inputStyle}
              required
            >
              <option value="" disabled>Select answer</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>

            {takesIllicitDrugs === "true" && (
              <div>
                <label className={labelStyle}>
                  Drug Use Details
                </label>

                <textarea
                  name="social_illicit_drugs_details"
                  placeholder="Record the patient's reported details"
                  rows={3}
                  className={inputStyle}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Immunization History */}
      <section className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xl font-semibold">
            Immunization History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Record previous vaccinations reported by the patient,
            including those administered outside this health center.
          </p>
        </div>

        {immunizationHistory.map((entry) => (
          <div
            key={entry.id}
            className="space-y-3 rounded-md border p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelStyle}>Vaccine Name *</label>
                <input
                  type="text"
                  value={entry.vaccineName}
                  onChange={(event) =>
                    setImmunizationHistory((previous) =>
                      previous.map((item) =>
                        item.id === entry.id
                          ? { ...item, vaccineName: event.target.value }
                          : item
                      )
                    )
                  }
                  placeholder="e.g., Hepatitis B"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Dose *</label>
                <input
                  type="text"
                  value={entry.doseLabel}
                  onChange={(event) =>
                    setImmunizationHistory((previous) =>
                      previous.map((item) =>
                        item.id === entry.id
                          ? { ...item, doseLabel: event.target.value }
                          : item
                      )
                    )
                  }
                  placeholder="e.g., First Dose"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Date Administered</label>
                <input
                  type="date"
                  value={entry.dateAdministered}
                  onChange={(event) =>
                    setImmunizationHistory((previous) =>
                      previous.map((item) =>
                        item.id === entry.id
                          ? {
                              ...item,
                              dateAdministered: event.target.value,
                            }
                          : item
                      )
                    )
                  }
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Vaccine Brand</label>
                <input
                  type="text"
                  value={entry.vaccineBrand}
                  onChange={(event) =>
                    setImmunizationHistory((previous) =>
                      previous.map((item) =>
                        item.id === entry.id
                          ? { ...item, vaccineBrand: event.target.value }
                          : item
                      )
                    )
                  }
                  placeholder="If known"
                  className={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className={labelStyle}>Remarks</label>
              <textarea
                value={entry.remarks}
                onChange={(event) =>
                  setImmunizationHistory((previous) =>
                    previous.map((item) =>
                      item.id === entry.id
                        ? { ...item, remarks: event.target.value }
                        : item
                    )
                  )
                }
                placeholder="Additional information, if any"
                rows={2}
                className={inputStyle}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setImmunizationHistory((previous) =>
                  previous.filter((item) => item.id !== entry.id)
                )
              }
              className="rounded-md border px-3 py-2 text-sm"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
                    setNoReportedImmunizations(false);

                    setImmunizationHistory((previous) => [
                      ...previous,
                      {
                        id: Date.now(),
                        vaccineName: "",
                        doseLabel: "",
                        dateAdministered: "",
                        vaccineBrand: "",
                        remarks: "",
                      },
                    ]);
                  }}
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          + Add Immunization Record
        </button>

        <div className="space-y-3">
          <label className="flex items-center gap-3 rounded-md border p-3">
            <input
              type="checkbox"
              checked={noReportedImmunizations}
              onChange={(event) => {
                const checked = event.target.checked;

                setNoReportedImmunizations(checked);

                if (checked) {
                  setImmunizationHistory([]);
                }
              }}
              className="h-4 w-4"
            />

            <span>No reported immunization history</span>
          </label>

          <div>
            <label className={labelStyle}>
              Additional Immunization Remarks
            </label>

            <textarea
              value={immunizationRemarks}
              onChange={(event) =>
                setImmunizationRemarks(event.target.value)
              }
              placeholder="e.g., Patient cannot recall childhood vaccinations or exact doses"
              rows={3}
              className={inputStyle}
            />
          </div>
        </div>

      </section>

      {/* Repeatable medical history data */}
      <input
        type="hidden"
        name="additional_conditions"
        value={JSON.stringify(additionalConditions)}
      />

      <input
        type="hidden"
        name="allergies"
        value={JSON.stringify(allergies)}
      />

      <input
        type="hidden"
        name="has_allergies"
        value={String(hasAllergies)}
      />

      <input
        type="hidden"
        name="maintenance_medications"
        value={JSON.stringify(maintenanceMedications)}
      />

      <input
        type="hidden"
        name="previous_illnesses_surgeries"
        value={JSON.stringify(previousIllnessesSurgeries)}
      />

      <input
        type="hidden"
        name="immunization_history"
        value={JSON.stringify(immunizationHistory)}
      />

      {/* Medical history confirmations */}
      <input
        type="hidden"
        name="no_reported_conditions"
        value={String(noReportedConditions)}
      />

      <input
        type="hidden"
        name="no_reported_family_history"
        value={String(noReportedFamilyHistory)}
      />

      <input
        type="hidden"
        name="no_reported_medications"
        value={String(noReportedMedications)}
      />

      <input
        type="hidden"
        name="no_reported_previous_history"
        value={String(noReportedPreviousHistory)}
      />

      <input
        type="hidden"
        name="no_reported_immunizations"
        value={String(noReportedImmunizations)}
      />

      <input
        type="hidden"
        name="immunization_general_remarks"
        value={immunizationRemarks}
      />

      <div className="space-y-3">
        {registrationState.error && (
          <p role="alert" className="text-sm text-red-400">
            {registrationState.error}
          </p>
        )}

        {registrationState.success && (
          <p role="status" className="text-sm text-green-400">
            Patient registered successfully!
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || registrationState.success}
          className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Saving Patient..." : "Save Patient"}
        </button>
      </div>
    </form>
  );
}