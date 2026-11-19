"use client";

import { useState } from "react";

type NCDEnrollmentFormProps = {
  itrId: string;
};

export default function NCDEnrollmentForm({
  itrId,
}: NCDEnrollmentFormProps) {
  const [doctorAdvised, setDoctorAdvised] = useState(false);
  const [condition, setCondition] = useState("");
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");


  // PhilPEN screening information
  const [screeningDate, setScreeningDate] = useState("");
  const [smokingStatus, setSmokingStatus] = useState("");
  const [drinksAlcohol, setDrinksAlcohol] = useState(false);
  const [bingeDrinking, setBingeDrinking] = useState(false);
  const [dietaryRiskFactors, setDietaryRiskFactors] = useState(false);
  const [physicalInactivity, setPhysicalInactivity] = useState(false);

  // Screening measurements
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waistCircumference, setWaistCircumference] = useState("");

  // Calculate BMI from height in meters and weight in kilograms.
  const heightNumber = Number(height);
  const weightNumber = Number(weight);


  // WHO DAS initial assessment
  const [whodasDate, setWhodasDate] = useState("");
  const [whodasDifficulty, setWhodasDifficulty] = useState("");
  const [whodasScore, setWhodasScore] = useState("");
  const [whodasDomain1, setWhodasDomain1] = useState("");
  const [whodasDomain2, setWhodasDomain2] = useState("");
  const [whodasDomain3, setWhodasDomain3] = useState("");


  const bmi =
    heightNumber > 0 && weightNumber > 0
      ? weightNumber / (heightNumber * heightNumber)
      : null;


    // UI-only enrollment review
    const [reviewMode, setReviewMode] = useState(false);
    const [enrollmentComplete, setEnrollmentComplete] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    function handleReviewEnrollment() {
    const errors: string[] = [];

    if (!doctorAdvised) {
      errors.push("Confirm that the Doctor advised NCD enrollment.");
    }

    if (!condition) {
      errors.push("Select an NCD condition.");
    }

    if (!diagnosisDate || !enrollmentDate) {
      errors.push("Enter the diagnosis and enrollment dates.");
    }

    if (!screeningDate || !smokingStatus) {
      errors.push("Complete the PhilPEN screening date and smoking status.");
    }

    if (
      height.trim() === "" ||
      weight.trim() === "" ||
      waistCircumference.trim() === "" ||
      !Number.isFinite(Number(height)) ||
      !Number.isFinite(Number(weight)) ||
      !Number.isFinite(Number(waistCircumference)) ||
      Number(height) <= 0 ||
      Number(weight) <= 0 ||
      Number(waistCircumference) <= 0
    ) {
      errors.push("Enter valid positive PhilPEN measurements.");
    }

    if (!whodasDate || !whodasDifficulty) {
      errors.push("Complete the WHO DAS assessment date and Part 1 result.");
    }

    if (
      whodasScore.trim() === "" ||
      !Number.isFinite(Number(whodasScore)) ||
      Number(whodasScore) < 0
    ) {
      errors.push("Enter a valid WHO DAS disability score.");
    }

    setValidationErrors(errors);

    if (errors.length === 0) {
      setReviewMode(true);
    }
  }



  return (
    <div className="space-y-6">
      {/* Section 1: Doctor-advised enrollment */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          1. Doctor-Advised Enrollment
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Confirm that the patient has been assessed and
          advised by the Doctor to enroll in the NCD program.
        </p>

        <label className="mt-5 flex items-start gap-3">
          <input
            type="checkbox"
            checked={doctorAdvised}
            onChange={(event) =>
              setDoctorAdvised(event.target.checked)
            }
            className="mt-1 h-4 w-4 accent-blue-700"
          />

          <span className="text-sm text-slate-800">
            I confirm that the Doctor has assessed this patient
            and advised enrollment in the NCD program.
          </span>
        </label>
      </section>

      {/* Section 2: NCD information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          2. NCD Information
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Record the Doctor-established NCD condition
          and relevant enrollment dates.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ncd-condition"
              className="block text-sm font-medium text-slate-700"
            >
              NCD Condition
            </label>

            <select
              id="ncd-condition"
              value={condition}
              onChange={(event) =>
                setCondition(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
            >
              <option value="">Select condition</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Hypertension">Hypertension</option>
              <option value="COPD">COPD</option>
              <option value="Asthma">Asthma</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="diagnosis-date"
              className="block text-sm font-medium text-slate-700"
            >
              Diagnosis Date
            </label>

            <input
              id="diagnosis-date"
              type="date"
              value={diagnosisDate}
              onChange={(event) =>
                setDiagnosisDate(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="enrollment-date"
              className="block text-sm font-medium text-slate-700"
            >
              Enrollment Date
            </label>

            <input
              id="enrollment-date"
              type="date"
              value={enrollmentDate}
              onChange={(event) =>
                setEnrollmentDate(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          This information is for demonstration purposes only.
          No diagnosis or NCD enrollment is saved.
        </p>
      </section>


      {/* Section 3: PhilPEN Screening */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          3. PhilPEN Screening
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Record the patient's initial PhilPEN screening results
          as part of NCD program enrollment.
        </p>

        {/* Screening date */}
        <div className="mt-5 max-w-sm">
          <label
            htmlFor="philpen-date"
            className="block text-sm font-medium text-slate-700"
          >
            Screening Date
          </label>

          <input
            id="philpen-date"
            type="date"
            value={screeningDate}
            onChange={(event) =>
              setScreeningDate(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
          />
        </div>

        {/* Smoking status */}
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700">
            Smoking Status
          </p>

          <div className="mt-3 flex flex-wrap gap-5">
            {[
              "Current Smoker",
              "Passive Smoker",
              "Stopped Smoking",
              "None Reported",
            ].map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <input
                  type="radio"
                  name="smokingStatus"
                  value={status}
                  checked={smokingStatus === status}
                  onChange={(event) =>
                    setSmokingStatus(event.target.value)
                  }
                  className="h-4 w-4 accent-blue-700"
                />
                {status}
              </label>
            ))}
          </div>
        </div>

        {/* Other risk factors */}
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700">
            Additional Risk Factors
          </p>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={drinksAlcohol}
                onChange={(event) =>
                  setDrinksAlcohol(event.target.checked)
                }
                className="h-4 w-4 accent-blue-700"
              />
              Drinks Alcohol
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={bingeDrinking}
                onChange={(event) =>
                  setBingeDrinking(event.target.checked)
                }
                className="h-4 w-4 accent-blue-700"
              />
              Had 5 drinks or more on one occasion in a month
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={dietaryRiskFactors}
                onChange={(event) =>
                  setDietaryRiskFactors(event.target.checked)
                }
                className="h-4 w-4 accent-blue-700"
              />
              Dietary Risk Factors
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={physicalInactivity}
                onChange={(event) =>
                  setPhysicalInactivity(event.target.checked)
                }
                className="h-4 w-4 accent-blue-700"
              />
              Physical Inactivity
            </label>
          </div>
        </div>

        {/* Screening measurements */}
        <div className="mt-7 border-t border-slate-200 pt-6">
          <h3 className="text-base font-semibold text-slate-900">
            Screening Measurements
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="philpen-height"
                className="block text-sm font-medium text-slate-700"
              >
                Height (meters)
              </label>

              <input
                id="philpen-height"
                type="number"
                min="0"
                step="0.01"
                value={height}
                onChange={(event) =>
                  setHeight(event.target.value)
                }
                placeholder="e.g. 1.65"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="philpen-weight"
                className="block text-sm font-medium text-slate-700"
              >
                Weight (kg)
              </label>

              <input
                id="philpen-weight"
                type="number"
                min="0"
                step="0.1"
                value={weight}
                onChange={(event) =>
                  setWeight(event.target.value)
                }
                placeholder="e.g. 65"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="philpen-waist"
                className="block text-sm font-medium text-slate-700"
              >
                Waist Circumference (cm)
              </label>

              <input
                id="philpen-waist"
                type="number"
                min="0"
                step="0.1"
                value={waistCircumference}
                onChange={(event) =>
                  setWaistCircumference(event.target.value)
                }
                placeholder="e.g. 85"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="philpen-bmi"
                className="block text-sm font-medium text-slate-700"
              >
                BMI (Calculated)
              </label>

              <input
                id="philpen-bmi"
                type="text"
                readOnly
                value={bmi !== null ? bmi.toFixed(2) : ""}
                placeholder="Calculated automatically"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-700"
              />
            </div>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          Initial PhilPEN screening demonstration only.
          No screening results are saved.
        </p>
      </section>


      {/* Section 4: WHO DAS Initial Assessment */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          4. WHO DAS Initial Assessment
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Record the patient's initial disability assessment
          as part of NCD program enrollment.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="whodas-date"
              className="block text-sm font-medium text-slate-700"
            >
              Assessment Date
            </label>
            <input
              id="whodas-date"
              type="date"
              value={whodasDate}
              onChange={(event) =>
                setWhodasDate(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="whodas-difficulty"
              className="block text-sm font-medium text-slate-700"
            >
              Part 1 — Difficulty / Referral
            </label>
            <select
              id="whodas-difficulty"
              value={whodasDifficulty}
              onChange={(event) =>
                setWhodasDifficulty(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
            >
              <option value="">Select result</option>
              <option value="No Difficulty">No Difficulty</option>
              <option value="Refer">Refer</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="whodas-score"
              className="block text-sm font-medium text-slate-700"
            >
              Part 2 — Total Disability Score
            </label>
            <input
              id="whodas-score"
              type="number"
              min="0"
              value={whodasScore}
              onChange={(event) =>
                setWhodasScore(event.target.value)
              }
              placeholder="Enter recorded score"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
            />
          </div>
        </div>

        <div className="mt-7 border-t border-slate-200 pt-6">
          <h3 className="text-base font-semibold text-slate-900">
            Top Affected Domains
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Enter the domains identified during the initial
            WHO DAS assessment, in order of significance.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                id: "whodas-domain-1",
                label: "Top 1 Domain",
                value: whodasDomain1,
                setter: setWhodasDomain1,
              },
              {
                id: "whodas-domain-2",
                label: "Top 2 Domain",
                value: whodasDomain2,
                setter: setWhodasDomain2,
              },
              {
                id: "whodas-domain-3",
                label: "Top 3 Domain",
                value: whodasDomain3,
                setter: setWhodasDomain3,
              },
            ].map((domain) => (
              <div key={domain.id}>
                <label
                  htmlFor={domain.id}
                  className="block text-sm font-medium text-slate-700"
                >
                  {domain.label}
                </label>

                <input
                  id={domain.id}
                  type="text"
                  value={domain.value}
                  onChange={(event) =>
                    domain.setter(event.target.value)
                  }
                  placeholder="Enter domain"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          WHO DAS initial assessment demonstration only.
          No assessment results are saved.
        </p>
      </section>
      

      {/* Section 5: Review and complete enrollment */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          5. Review & Complete Enrollment
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Review the NCD enrollment information before completing
          this Software Engineering demonstration.
        </p>

        {validationErrors.length > 0 && !reviewMode && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4"
          >
            <h3 className="font-semibold text-red-800">
              Please correct the following:
            </h3>

            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {enrollmentComplete ? (
          <div
            role="status"
            className="mt-5 rounded-lg border border-green-200 bg-green-50 p-5"
          >
            <h3 className="text-lg font-semibold text-green-800">
              NCD Enrollment Demonstration Complete
            </h3>

            <p className="mt-2 text-sm text-green-700">
              The enrollment workflow has been demonstrated for
              the selected patient ITR. No NCD record or diagnosis
              was created in the database.
            </p>

            <button
              type="button"
              onClick={() => {
                setEnrollmentComplete(false);
                setReviewMode(false);
                setValidationErrors([]);
              }}
              className="mt-4 rounded-lg border border-green-700 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-100"
            >
              Return to Enrollment Form
            </button>
          </div>
        ) : reviewMode ? (
          <div className="mt-5 space-y-5">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
              <h3 className="font-semibold text-blue-900">
                Enrollment Review
              </h3>

              <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Associated ITR</dt>
                  <dd className="break-all font-medium text-slate-900">
                    {itrId}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Doctor Advised</dt>
                  <dd className="font-medium text-slate-900">
                    {doctorAdvised ? "Confirmed" : "Not Confirmed"}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">NCD Condition</dt>
                  <dd className="font-medium text-slate-900">
                    {condition}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Diagnosis Date</dt>
                  <dd className="font-medium text-slate-900">
                    {diagnosisDate}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Enrollment Date</dt>
                  <dd className="font-medium text-slate-900">
                    {enrollmentDate}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">PhilPEN Screening Date</dt>
                  <dd className="font-medium text-slate-900">
                    {screeningDate}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Smoking Status</dt>
                  <dd className="font-medium text-slate-900">
                    {smokingStatus}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Other Risk Factors</dt>
                  <dd className="font-medium text-slate-900">
                    {[
                      drinksAlcohol && "Alcohol use",
                      bingeDrinking && "Binge drinking",
                      dietaryRiskFactors && "Dietary risk",
                      physicalInactivity && "Physical inactivity",
                    ].filter(Boolean).join(", ") || "None selected"}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Calculated BMI</dt>
                  <dd className="font-medium text-slate-900">
                    {bmi !== null ? bmi.toFixed(2) : "Not available"}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Waist Circumference</dt>
                  <dd className="font-medium text-slate-900">
                    {waistCircumference} cm
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">WHO DAS Date</dt>
                  <dd className="font-medium text-slate-900">
                    {whodasDate}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">WHO DAS Part 1</dt>
                  <dd className="font-medium text-slate-900">
                    {whodasDifficulty}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">WHO DAS Score</dt>
                  <dd className="font-medium text-slate-900">
                    {whodasScore}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Affected Domains</dt>
                  <dd className="font-medium text-slate-900">
                    {[
                      whodasDomain1,
                      whodasDomain2,
                      whodasDomain3,
                    ].filter((domain) => domain.trim()).join(", ") ||
                      "None recorded"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setReviewMode(false)}
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Back to Editing
              </button>

              <button
                type="button"
                onClick={() => {
                  setReviewMode(false);
                  setEnrollmentComplete(true);
                }}
                className="rounded-lg bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800"
              >
                Complete Enrollment (Demo)
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleReviewEnrollment}
            className="mt-5 rounded-lg bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800"
          >
            Review Enrollment
          </button>
        )}

        <p className="mt-5 text-xs text-slate-500">
          Software Engineering UI demonstration only.
          No enrollment data is saved to Supabase.
        </p>
      </section>

    </div>
  );
}
