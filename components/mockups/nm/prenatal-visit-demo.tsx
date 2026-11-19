"use client";

import { useState } from "react";

type Step = "FORM" | "REVIEW" | "COMPLETE";
type Outcome = "ROUTINE_COMPLETED" | "ENDORSE_TO_DOCTOR";

type PrenatalForm = {
  visitDate: string;
  weight: string;
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
  systolicBP: string;
  diastolicBP: string;
  gestationalAge: string;
  fundicHeight: string;
  fetalHeartTones: string;
  chiefComplaint: string;
  interviewSummary: string;
  observations: string;
  outcome: Outcome;
  endorsementNotes: string;
};

const initialForm: PrenatalForm = {
  visitDate: "",
  weight: "",
  heartRate: "",
  respiratoryRate: "",
  temperature: "",
  systolicBP: "",
  diastolicBP: "",
  gestationalAge: "",
  fundicHeight: "",
  fetalHeartTones: "",
  chiefComplaint: "",
  interviewSummary: "",
  observations: "",
  outcome: "ROUTINE_COMPLETED",
  endorsementNotes: "",
};

const measurements = [
  { label: "Weight", key: "weight", unit: "kg" },
  { label: "Heart Rate", key: "heartRate", unit: "bpm" },
  { label: "Respiratory Rate", key: "respiratoryRate", unit: "breaths/min" },
  { label: "Temperature", key: "temperature", unit: "°C" },
  { label: "Systolic BP", key: "systolicBP", unit: "mmHg" },
  { label: "Diastolic BP", key: "diastolicBP", unit: "mmHg" },
  { label: "Fundic Height", key: "fundicHeight", unit: "cm" },
  { label: "Fetal Heart Tones", key: "fetalHeartTones", unit: "bpm" },
] as const;

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

const labelClass =
  "mb-1 block text-sm font-medium text-slate-700";

export default function PrenatalVisitDemo() {
  const [form, setForm] = useState<PrenatalForm>({ ...initialForm });
  const [step, setStep] = useState<Step>("FORM");
  const [error, setError] = useState("");

  function update<K extends keyof PrenatalForm>(
    field: K,
    value: PrenatalForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setError("");
  }

  function review() {
    if (
      !form.visitDate ||
      !form.gestationalAge.trim() ||
      !form.chiefComplaint.trim() ||
      !form.interviewSummary.trim() ||
      !form.observations.trim()
    ) {
      setError("Please complete the required prenatal assessment fields.");
      return;
    }

    if (
      form.outcome === "ENDORSE_TO_DOCTOR" &&
      !form.endorsementNotes.trim()
    ) {
      setError("Please provide the reason for physician endorsement.");
      return;
    }

    setError("");
    setStep("REVIEW");
  }

  function reset() {
    setForm({ ...initialForm });
    setStep("FORM");
    setError("");
  }

  if (step === "COMPLETE") {
    return (
      <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-5">
        <h3 className="text-lg font-semibold text-green-900">
          Prenatal Care Demonstration Completed
        </h3>

        <p className="text-sm text-green-800">
          {form.outcome === "ENDORSE_TO_DOCTOR"
            ? "The proposed system would record the prenatal assessment and endorse the encounter for physician evaluation."
            : "The proposed system would record the completed routine prenatal care encounter under the maternal record."}
        </p>

        <p className="text-sm font-medium text-green-900">
          No information was saved or endorsed.
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
    const reviewFields = [
      ["Visit Date", form.visitDate],
      ["Gestational Age", `${form.gestationalAge} weeks`],
      ["Weight", form.weight ? `${form.weight} kg` : "Not recorded"],
      ["Heart Rate", form.heartRate ? `${form.heartRate} bpm` : "Not recorded"],
      [
        "Respiratory Rate",
        form.respiratoryRate
          ? `${form.respiratoryRate} breaths/min`
          : "Not recorded",
      ],
      [
        "Temperature",
        form.temperature ? `${form.temperature} °C` : "Not recorded",
      ],
      [
        "Blood Pressure",
        form.systolicBP && form.diastolicBP
          ? `${form.systolicBP}/${form.diastolicBP} mmHg`
          : "Not recorded",
      ],
      [
        "Fundic Height",
        form.fundicHeight ? `${form.fundicHeight} cm` : "Not recorded",
      ],
      [
        "Fetal Heart Tones",
        form.fetalHeartTones
          ? `${form.fetalHeartTones} bpm`
          : "Not recorded",
      ],
      ["Chief Complaint / Reason for Visit", form.chiefComplaint],
      ["Interview Summary", form.interviewSummary],
      ["NM Observations", form.observations],
      [
        "Assessment Outcome",
        form.outcome === "ENDORSE_TO_DOCTOR"
          ? "Endorse to Doctor"
          : "Routine Care Completed",
      ],
      ...(form.outcome === "ENDORSE_TO_DOCTOR"
        ? [["Endorsement Notes", form.endorsementNotes]]
        : []),
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Review Prenatal Care Visit
        </h3>

        <div className="space-y-3 rounded-lg border border-slate-200 p-4">
          {reviewFields.map(([label, value]) => (
            <div key={label} className="text-sm">
              <p className="font-medium text-slate-700">
                {label}
              </p>
              <p className="whitespace-pre-wrap text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </div>

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
          Record Prenatal Care Visit
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Nurse/Midwife prenatal assessment demonstration.
        </p>
      </div>

      <div>
        <label className={labelClass}>
          Visit Date *
        </label>
        <input
          type="date"
          className={inputClass}
          value={form.visitDate}
          onChange={(e) =>
            update("visitDate", e.target.value)
          }
        />
      </div>

      <section className="space-y-4 rounded-lg border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-900">
          Prenatal Measurements
        </h4>

        <div>
          <label className={labelClass}>
            Gestational Age (weeks) *
          </label>
          <input
            type="number"
            min="0"
            step="1"
            className={inputClass}
            value={form.gestationalAge}
            onChange={(e) =>
              update("gestationalAge", e.target.value)
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {measurements.map((measurement) => (
            <div key={measurement.key}>
              <label className={labelClass}>
                {measurement.label} ({measurement.unit})
              </label>

              <input
                type="number"
                min="0"
                step="any"
                className={inputClass}
                value={form[measurement.key]}
                onChange={(e) =>
                  update(measurement.key, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-900">
          NM General Assessment
        </h4>

        <div>
          <label className={labelClass}>
            Chief Complaint / Reason for Visit *
          </label>
          <textarea
            rows={2}
            className={inputClass}
            value={form.chiefComplaint}
            onChange={(e) =>
              update("chiefComplaint", e.target.value)
            }
            placeholder="Routine prenatal follow-up or reported concern"
          />
        </div>

        <div>
          <label className={labelClass}>
            Interview Summary *
          </label>
          <textarea
            rows={3}
            className={inputClass}
            value={form.interviewSummary}
            onChange={(e) =>
              update("interviewSummary", e.target.value)
            }
            placeholder="Patient-reported symptoms, concerns, and relevant history"
          />
        </div>

        <div>
          <label className={labelClass}>
            NM Observations *
          </label>
          <textarea
            rows={3}
            className={inputClass}
            value={form.observations}
            onChange={(e) =>
              update("observations", e.target.value)
            }
            placeholder="Observations and findings during the assessment"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-900">
          Assessment Outcome
        </h4>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name="prenatal-outcome"
            checked={form.outcome === "ROUTINE_COMPLETED"}
            onChange={() =>
              update("outcome", "ROUTINE_COMPLETED")
            }
          />
          Routine Care Completed
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name="prenatal-outcome"
            checked={form.outcome === "ENDORSE_TO_DOCTOR"}
            onChange={() =>
              update("outcome", "ENDORSE_TO_DOCTOR")
            }
          />
          Endorse to Doctor
        </label>

        {form.outcome === "ENDORSE_TO_DOCTOR" && (
          <div>
            <label className={labelClass}>
              Endorsement Notes *
            </label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.endorsementNotes}
              onChange={(e) =>
                update("endorsementNotes", e.target.value)
              }
              placeholder="Reason for physician evaluation"
            />
          </div>
        )}
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={review}
        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
      >
        Review Prenatal Visit
      </button>
    </div>
  );
}
