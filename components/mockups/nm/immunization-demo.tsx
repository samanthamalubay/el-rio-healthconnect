
"use client";

import { useState } from "react";

type Outcome = "ADMINISTERED" | "DEFERRED";
type Step = "FORM" | "REVIEW" | "COMPLETE";

export default function ImmunizationDemo() {
  const [outcome, setOutcome] = useState<Outcome>("ADMINISTERED");
  const [step, setStep] = useState<Step>("FORM");
  const [error, setError] = useState("");

  const [vaccine, setVaccine] = useState("");
  const [dose, setDose] = useState("");
  const [administrationDate, setAdministrationDate] = useState("");
  const [nextDate, setNextDate] = useState("");

  const [deferralReason, setDeferralReason] = useState("");
  const [returnInstructions, setReturnInstructions] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [referToDoctor, setReferToDoctor] = useState(false);

  function changeOutcome(value: Outcome) {
    setOutcome(value);
    setStep("FORM");
    setError("");
  }

  function review() {
    if (outcome === "ADMINISTERED") {
      if (!vaccine.trim() || !dose.trim() || !administrationDate) {
        setError("Please complete the required immunization fields.");
        return;
      }
    } else {
      if (!deferralReason.trim() || !returnInstructions.trim()) {
        setError("Please provide the deferral reason and return instructions.");
        return;
      }
    }

    setError("");
    setStep("REVIEW");
  }

  function reset() {
    setOutcome("ADMINISTERED");
    setStep("FORM");
    setError("");
    setVaccine("");
    setDose("");
    setAdministrationDate("");
    setNextDate("");
    setDeferralReason("");
    setReturnInstructions("");
    setReturnDate("");
    setReferToDoctor(false);
  }

  const inputClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Software Engineering UI demonstration only. No clinical
        eligibility, vaccine schedule, or patient record is being
        verified or saved.
      </div>

      {step === "COMPLETE" ? (
        <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-5">
          <h3 className="text-lg font-semibold text-green-900">
            Demonstration Completed
          </h3>

          <p className="text-sm text-green-800">
            {outcome === "ADMINISTERED"
              ? "The proposed system would record the immunization event in the patient's ITR."
              : "The proposed system would record the immunization deferral and return instructions."}
          </p>

          <p className="text-sm font-medium text-green-900">
            No information was saved.
          </p>

          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Start Another Demonstration
          </button>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Immunization Assessment Outcome
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Select the outcome determined by the Nurse/Midwife.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={step === "REVIEW"}
              onClick={() => changeOutcome("ADMINISTERED")}
              className={`rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed ${
                outcome === "ADMINISTERED"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Eligible — Record Immunization
            </button>

            <button
              type="button"
              disabled={step === "REVIEW"}
              onClick={() => changeOutcome("DEFERRED")}
              className={`rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed ${
                outcome === "DEFERRED"
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Ineligible — Record Deferral
            </button>
          </div>

          {step === "FORM" ? (
            <div className="space-y-4">
              {outcome === "ADMINISTERED" ? (
                <>
                  <div>
                    <label className={labelClass}>Vaccine *</label>
                    <input
                      className={inputClass}
                      value={vaccine}
                      onChange={(e) => setVaccine(e.target.value)}
                      placeholder="Enter administered vaccine"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Dose *</label>
                    <input
                      className={inputClass}
                      value={dose}
                      onChange={(e) => setDose(e.target.value)}
                      placeholder="Enter dose information"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Date Administered *
                    </label>
                    <input
                      type="date"
                      className={inputClass}
                      value={administrationDate}
                      onChange={(e) =>
                        setAdministrationDate(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Next Recommended Date (if applicable)
                    </label>
                    <input
                      type="date"
                      className={inputClass}
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Entered manually for demonstration. No schedule
                      calculation is performed.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>
                      Reason for Deferral *
                    </label>
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={deferralReason}
                      onChange={(e) =>
                        setDeferralReason(e.target.value)
                      }
                      placeholder="Describe why immunization was deferred"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Return Instructions *
                    </label>
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={returnInstructions}
                      onChange={(e) =>
                        setReturnInstructions(e.target.value)
                      }
                      placeholder="Enter reassessment or return instructions"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Advised Return Date (if applicable)
                    </label>
                    <input
                      type="date"
                      className={inputClass}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={referToDoctor}
                      onChange={(e) =>
                        setReferToDoctor(e.target.checked)
                      }
                    />
                    Recommend physician evaluation
                  </label>
                </>
              )}

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
                Review Information
              </button>
            </div>
          ) : (
            <div className="space-y-4 rounded-lg border border-slate-200 p-4">
              <h3 className="text-lg font-semibold">
                Review {outcome === "ADMINISTERED"
                  ? "Immunization"
                  : "Deferral"} Information
              </h3>

              {outcome === "ADMINISTERED" ? (
                <dl className="space-y-2 text-sm">
                  <div><dt className="font-medium">Vaccine</dt><dd>{vaccine}</dd></div>
                  <div><dt className="font-medium">Dose</dt><dd>{dose}</dd></div>
                  <div><dt className="font-medium">Date Administered</dt><dd>{administrationDate}</dd></div>
                  <div><dt className="font-medium">Next Recommended Date</dt><dd>{nextDate || "Not specified"}</dd></div>
                </dl>
              ) : (
                <dl className="space-y-2 text-sm">
                  <div><dt className="font-medium">Deferral Reason</dt><dd className="whitespace-pre-wrap">{deferralReason}</dd></div>
                  <div><dt className="font-medium">Return Instructions</dt><dd className="whitespace-pre-wrap">{returnInstructions}</dd></div>
                  <div><dt className="font-medium">Return Date</dt><dd>{returnDate || "Not specified"}</dd></div>
                  <div><dt className="font-medium">Physician Evaluation</dt><dd>{referToDoctor ? "Recommended" : "Not indicated"}</dd></div>
                </dl>
              )}

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
          )}
        </>
      )}
    </div>
  );
}
