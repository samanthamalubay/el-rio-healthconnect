"use client";

import { useState } from "react";

type Step = "FORM" | "REVIEW" | "COMPLETE";

type Medication = {
  id: number;
  name: string;
  dosageAmount: string;
  dosageUnit: string;
  frequency: string;
  otherFrequency: string;
  durationAmount: string;
  durationUnit: string;
  instructions: string;
};

const emptyMedication = (id: number): Medication => ({
  id,
  name: "",
  dosageAmount: "",
  dosageUnit: "",
  frequency: "",
  otherFrequency: "",
  durationAmount: "",
  durationUnit: "",
  instructions: "",
});

const dosageUnits = [
  "mg",
  "g",
  "mcg",
  "mL",
  "units",
];

const frequencyOptions = [
  { value: "ONCE_DAILY", label: "Once daily" },
  { value: "TWICE_DAILY", label: "Twice daily" },
  { value: "THREE_TIMES_DAILY", label: "Three times daily" },
  { value: "EVERY_8_HOURS", label: "Every 8 hours" },
  { value: "EVERY_12_HOURS", label: "Every 12 hours" },
  { value: "OTHER", label: "Others: Specify" },
];

const durationUnits = [
  "days",
  "weeks",
];

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

const labelClass =
  "mb-1 block text-sm font-medium text-slate-700";

export default function MedicationOrderDemo() {
  const [step, setStep] = useState<Step>("FORM");
  const [medications, setMedications] = useState<Medication[]>([
    emptyMedication(1),
  ]);
  const [nextId, setNextId] = useState(2);
  const [error, setError] = useState("");

  function updateMedication(
    id: number,
    field: keyof Omit<Medication, "id">,
    value: string
  ) {
    setMedications((previous) =>
      previous.map((medication) =>
        medication.id === id
          ? { ...medication, [field]: value }
          : medication
      )
    );
    setError("");
  }

  function addMedication() {
    setMedications((previous) => [
      ...previous,
      emptyMedication(nextId),
    ]);
    setNextId((previous) => previous + 1);
  }

  function removeMedication(id: number) {
    setMedications((previous) =>
      previous.filter((medication) => medication.id !== id)
    );
    setError("");
  }


  function reviewOrder() {
    for (const [index, medication] of medications.entries()) {
      const prefix = `Medication ${index + 1}: `;
      const dosage = Number(medication.dosageAmount);
      const duration = Number(medication.durationAmount);
      let message = "";

      if (!medication.name.trim()) {
        message = "Please enter a medication name.";
      } else if (!medication.dosageAmount.trim()) {
        message = "Please enter a dosage amount.";
      } else if (!Number.isFinite(dosage) || dosage <= 0) {
        message = "Dosage must be greater than zero.";
      } else if (!medication.dosageUnit) {
        message = "Please select a dosage unit.";
      } else if (!medication.frequency) {
        message = "Please select a frequency.";
      } else if (
        medication.frequency === "OTHER" &&
        !medication.otherFrequency.trim()
      ) {
        message = "Please specify the frequency when Others is selected.";
      } else if (!medication.durationAmount.trim()) {
        message = "Please enter a duration.";
      } else if (!Number.isInteger(duration) || duration <= 0) {
        message = "Duration must be a whole number greater than zero.";
      } else if (!medication.durationUnit) {
        message = "Please select a duration unit.";
      }

      if (message) {
        setError(prefix + message);
        return;
      }
    }

    setError("");
    setStep("REVIEW");
  }

  function reset() {
    setMedications([emptyMedication(1)]);
    setNextId(2);
    setStep("FORM");
    setError("");
  }

  if (step === "COMPLETE") {
    return (
      <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-5">
        <h3 className="text-lg font-semibold text-green-900">
          Medication Order Demonstration Completed
        </h3>

        <p className="text-sm text-green-800">
          In the proposed system, a Physician Order and its
          associated Prescription would be created, with one
          Prescription Item for each prescribed medication.
        </p>

        <p className="text-sm text-green-800">
          The medication order would then be made available
          to the Pharmacist for dispensing.
        </p>

        <p className="text-sm font-medium text-green-900">
          No prescription was issued, saved, or sent to a Pharmacist.
        </p>

        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Start Another Demonstration
        </button>
      </div>
    );
  }

  if (step === "REVIEW") {
    return (
      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Review Medication Order
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Review the prescribed medications before completing
            the demonstration.
          </p>
        </div>

        {medications.map((medication, index) => (
          <section
            key={medication.id}
            className="space-y-3 rounded-lg border border-slate-200 p-4"
          >
            <h4 className="font-semibold text-slate-900">
              Medication {index + 1}: {medication.name}
            </h4>

            {([
              ["Dosage", `${medication.dosageAmount} ${medication.dosageUnit}`],
              [
                "Frequency",
                medication.frequency === "OTHER"
                  ? medication.otherFrequency
                  : frequencyOptions.find(
                      (option) => option.value === medication.frequency
                    )?.label ?? medication.frequency,
              ],
              ["Duration", `${medication.durationAmount} ${medication.durationUnit}`],
              ["Additional Instructions", medication.instructions || "None specified"],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="text-sm">
                <p className="font-medium text-slate-600">
                  {label}
                </p>
                <p className="whitespace-pre-wrap text-slate-900">
                  {value}
                </p>
              </div>
            ))}
          </section>
        ))}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStep("FORM")}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium"
          >
            Back to Edit
          </button>

          <button
            type="button"
            onClick={() => setStep("COMPLETE")}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Complete Demonstration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Create Medication Order
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Enter the prescribed medications and their instructions.
        </p>
      </div>

      {medications.map((medication, index) => (
        <section
          key={medication.id}
          className="space-y-4 rounded-lg border border-slate-200 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-900">
              Medication {index + 1}
            </h4>

            {medications.length > 1 && (
              <button
                type="button"
                onClick={() => removeMedication(medication.id)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Medication Name *
            </label>
            <input
              className={inputClass}
              value={medication.name}
              onChange={(e) =>
                updateMedication(
                  medication.id,
                  "name",
                  e.target.value
                )
              }
              placeholder="Enter medication name"
            />
          </div>

          
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  {/* Dosage */}
  <div>
    <label className={labelClass}>Dosage *</label>
    <div className="grid grid-cols-[minmax(0,1fr)_110px] gap-2">
      <input
        type="number"
        min="0.001"
        step="any"
        className={`${inputClass} min-w-0`}
        value={medication.dosageAmount}
        onChange={(e) =>
          updateMedication(
            medication.id,
            "dosageAmount",
            e.target.value
          )
        }
        placeholder="Amount"
      />

      <select
        className={`${inputClass} min-w-0`}
        value={medication.dosageUnit}
        onChange={(e) =>
          updateMedication(
            medication.id,
            "dosageUnit",
            e.target.value
          )
        }
      >
        <option value="">Unit</option>
        {dosageUnits.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Frequency */}
  <div>
    <label className={labelClass}>Frequency *</label>
    <select
      className={inputClass}
      value={medication.frequency}
      onChange={(e) =>
        updateMedication(
          medication.id,
          "frequency",
          e.target.value
        )
      }
    >
      <option value="">Select frequency</option>
      {frequencyOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    {medication.frequency === "OTHER" && (
      <input
        className={`${inputClass} mt-2`}
        value={medication.otherFrequency}
        onChange={(e) =>
          updateMedication(
            medication.id,
            "otherFrequency",
            e.target.value
          )
        }
        placeholder="Specify frequency"
      />
    )}
  </div>

  {/* Duration */}
  <div>
    <label className={labelClass}>Duration *</label>
    <div className="grid grid-cols-[minmax(0,1fr)_110px] gap-2">
      <input
        type="number"
        min="1"
        step="1"
        className={`${inputClass} min-w-0`}
        value={medication.durationAmount}
        onChange={(e) =>
          updateMedication(
            medication.id,
            "durationAmount",
            e.target.value
          )
        }
        placeholder="Amount"
      />

      <select
        className={`${inputClass} min-w-0`}
        value={medication.durationUnit}
        onChange={(e) =>
          updateMedication(
            medication.id,
            "durationUnit",
            e.target.value
          )
        }
      >
        <option value="">Unit</option>
        {durationUnits.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>


          <div>
            <label className={labelClass}>
              Additional Instructions
            </label>
            <textarea
              rows={3}
              className={inputClass}
              value={medication.instructions}
              onChange={(e) =>
                updateMedication(
                  medication.id,
                  "instructions",
                  e.target.value
                )
              }
              placeholder="Additional medication instructions"
            />
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={addMedication}
        className="rounded-md border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
      >
        + Add Another Medication
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div>
        <button
          type="button"
          onClick={reviewOrder}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Review Medication Order
        </button>
      </div>
    </div>
  );
}
