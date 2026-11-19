"use client";

import { useState } from "react";

type Step = "FORM" | "REVIEW" | "COMPLETE";
type Outcome = "ROUTINE_COMPLETED" | "ENDORSE_TO_DOCTOR";

type PostnatalForm = {
  visitDate: string;
  deliveryDate: string;
  deliveryPlace: string;
  deliveryType: string;
  deliveryComplications: string;
  pregnancyOutcome: string;
  newbornSex: string;
  birthWeight: string;
  breastfeeding: string;
  chiefComplaint: string;
  interviewSummary: string;
  observations: string;
  outcome: Outcome;
  endorsementNotes: string;
};

const initialForm: PostnatalForm = {
  visitDate: "",
  deliveryDate: "2026-11-17",
  deliveryPlace: "",
  deliveryType: "",
  deliveryComplications: "",
  pregnancyOutcome: "",
  newbornSex: "",
  birthWeight: "",
  breastfeeding: "",
  chiefComplaint: "",
  interviewSummary: "",
  observations: "",
  outcome: "ROUTINE_COMPLETED",
  endorsementNotes: "",
};

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

const labelClass =
  "mb-1 block text-sm font-medium text-slate-700";

export default function PostnatalVisitDemo() {
  const [form, setForm] = useState<PostnatalForm>({
    ...initialForm,
  });
  const [step, setStep] = useState<Step>("FORM");
  const [error, setError] = useState("");

  function update<K extends keyof PostnatalForm>(
    field: K,
    value: PostnatalForm[K]
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
      !form.deliveryDate ||
      !form.deliveryPlace.trim() ||
      !form.deliveryType.trim() ||
      !form.pregnancyOutcome.trim() ||
      !form.chiefComplaint.trim() ||
      !form.interviewSummary.trim() ||
      !form.observations.trim()
    ) {
      setError("Please complete the required postnatal visit fields.");
      return;
    }

    if (form.visitDate < form.deliveryDate) {
      setError("Postnatal visit date cannot be before the delivery date.");
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
          Postnatal Care Demonstration Completed
        </h3>

        <p className="text-sm text-green-800">
          {form.outcome === "ENDORSE_TO_DOCTOR"
            ? "The proposed system would record the postnatal assessment and endorse the encounter for physician evaluation."
            : "The proposed system would record the completed routine postnatal care encounter under the maternal record."}
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
      ["Postnatal Visit Date", form.visitDate],
      ["Delivery Date", form.deliveryDate],
      ["Delivery Place", form.deliveryPlace],
      ["Delivery Type", form.deliveryType],
      [
        "Delivery Complications",
        form.deliveryComplications || "None reported",
      ],
      ["Pregnancy Outcome", form.pregnancyOutcome],
      ["Newborn Sex", form.newbornSex || "Not recorded"],
      [
        "Birth Weight",
        form.birthWeight
          ? `${form.birthWeight} kg`
          : "Not recorded",
      ],
      [
        "Breastfeeding Status",
        form.breastfeeding || "Not recorded",
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
          Review Postnatal Care Visit
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
          Record Postnatal Care Visit
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Nurse/Midwife postnatal assessment demonstration.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-900">
          Visit Information
        </h4>

        <div>
          <label className={labelClass}>
            Postnatal Visit Date *
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
      </section>

      <section className="space-y-4 rounded-lg border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-900">
          Delivery Information
        </h4>

        <div>
          <label className={labelClass}>
            Delivery Date *
          </label>
          <input
            type="date"
            className={inputClass}
            value={form.deliveryDate}
            onChange={(e) =>
              update("deliveryDate", e.target.value)
            }
          />
        </div>

        <div>
          <label className={labelClass}>
            Place of Delivery *
          </label>
          <input
            className={inputClass}
            value={form.deliveryPlace}
            onChange={(e) =>
              update("deliveryPlace", e.target.value)
            }
            placeholder="Enter delivery facility or location"
          />
        </div>

        <div>
          <label className={labelClass}>
            Type of Delivery *
          </label>
          <input
            className={inputClass}
            value={form.deliveryType}
            onChange={(e) =>
              update("deliveryType", e.target.value)
            }
            placeholder="Enter type of delivery"
          />
        </div>

        <div>
          <label className={labelClass}>
            Delivery Complications (if any)
          </label>
          <textarea
            rows={2}
            className={inputClass}
            value={form.deliveryComplications}
            onChange={(e) =>
              update("deliveryComplications", e.target.value)
            }
            placeholder="Enter reported complications, if applicable"
          />
        </div>

        <div>
          <label className={labelClass}>
            Pregnancy Outcome *
          </label>
          <input
            className={inputClass}
            value={form.pregnancyOutcome}
            onChange={(e) =>
              update("pregnancyOutcome", e.target.value)
            }
            placeholder="Enter recorded pregnancy outcome"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-900">
          Newborn Information
        </h4>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Newborn Sex
            </label>
            <select
              className={inputClass}
              value={form.newbornSex}
              onChange={(e) =>
                update("newbornSex", e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Birth Weight (kg)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              className={inputClass}
              value={form.birthWeight}
              onChange={(e) =>
                update("birthWeight", e.target.value)
              }
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Breastfeeding Status
          </label>
          <select
            className={inputClass}
            value={form.breastfeeding}
            onChange={(e) =>
              update("breastfeeding", e.target.value)
            }
          >
            <option value="">Select</option>
            <option value="Breastfeeding">
              Breastfeeding
            </option>
            <option value="Not breastfeeding">
              Not breastfeeding
            </option>
            <option value="Mixed feeding">
              Mixed feeding
            </option>
          </select>
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
            placeholder="Routine postnatal follow-up or reported concern"
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
            placeholder="Patient-reported symptoms and postnatal concerns"
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
            placeholder="Observations during postnatal assessment"
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
            name="postnatal-outcome"
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
            name="postnatal-outcome"
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
        Review Postnatal Visit
      </button>
    </div>
  );
}
