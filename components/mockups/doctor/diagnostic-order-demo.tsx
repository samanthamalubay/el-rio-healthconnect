"use client";

import { useState } from "react";

type Step = "FORM" | "REVIEW" | "COMPLETE";

type DiagnosticTest = {
  id: number;
  test: string;
  otherTest: string;
  clinicalReason: string;
  instructions: string;
};

function emptyDiagnosticTest(id: number): DiagnosticTest {
  return {
    id,
    test: "",
    otherTest: "",
    clinicalReason: "",
    instructions: "",
  };
}

// Illustrative tests only; not a verified laboratory catalog.
const diagnosticTests = [
  "Complete Blood Count (CBC)",
  "Urinalysis",
  "Blood Glucose",
  "Lipid Profile",
  "Chest X-ray",
  "Other",
];

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900";

const labelClass =
  "mb-1 block text-sm font-medium text-slate-700";

function getTestName(item: DiagnosticTest) {
  return item.test === "Other"
    ? item.otherTest.trim()
    : item.test;
}

export default function DiagnosticOrderDemo() {
  const [step, setStep] = useState<Step>("FORM");

  const [orders, setOrders] = useState<DiagnosticTest[]>([
    emptyDiagnosticTest(1),
  ]);

  const [nextId, setNextId] = useState(2);
  const [error, setError] = useState("");

  function updateOrder(
    id: number,
    field: keyof Omit<DiagnosticTest, "id">,
    value: string
  ) {
    setOrders((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );

    setError("");
  }

  function addOrder() {
    setOrders((previous) => [
      ...previous,
      emptyDiagnosticTest(nextId),
    ]);

    setNextId((previous) => previous + 1);
    setError("");
  }

  function removeOrder(id: number) {
    setOrders((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setError("");
  }

  function reviewOrder() {
    const incomplete = orders.some(
      (item) =>
        !getTestName(item) ||
        !item.clinicalReason.trim()
    );

    if (incomplete) {
      setError(
        "Please select a diagnostic test and enter a clinical reason for every request."
      );
      return;
    }

    setError("");
    setStep("REVIEW");
  }

  function reset() {
    setOrders([emptyDiagnosticTest(1)]);
    setNextId(2);
    setError("");
    setStep("FORM");
  }

  if (step === "COMPLETE") {
    return (
      <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-5">
        <h3 className="text-lg font-semibold text-green-900">
          Diagnostic Order Demonstration Completed
        </h3>

        <p className="text-sm text-green-800">
          In the proposed system, a Physician Order
          associated with the active consultation would
          be created, together with the corresponding
          Laboratory Workup records for the requested
          diagnostic examinations.
        </p>

        <p className="text-sm text-green-800">
          Each diagnostic request would be made available
          to the Medical Technologist for processing.
        </p>

        <p className="text-sm font-medium text-green-900">
          No diagnostic orders were created, saved,
          or sent for processing.
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
            Review Diagnostic Order
          </h3>

          <p className="mt-1 text-sm text-slate-600">
            Review all requested diagnostic examinations
            before completing the demonstration.
          </p>
        </div>

        {orders.map((item, index) => (
          <section
            key={item.id}
            className="space-y-4 rounded-lg border border-slate-200 p-4"
          >
            <h4 className="font-semibold text-slate-900">
              Diagnostic Test {index + 1}: {getTestName(item)}
            </h4>

            <div>
              <p className="text-sm font-medium text-slate-600">
                Clinical Reason / Indication
              </p>
              <p className="whitespace-pre-wrap text-slate-900">
                {item.clinicalReason}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-600">
                Additional Instructions
              </p>
              <p className="whitespace-pre-wrap text-slate-900">
                {item.instructions.trim() || "None specified"}
              </p>
            </div>
          </section>
        ))}

        <div className="rounded-lg bg-slate-50 p-4 text-sm">
          <p className="font-medium text-slate-700">
            Requesting Role
          </p>
          <p className="text-slate-900">
            Doctor (Demonstration)
          </p>

          <p className="mt-3 font-medium text-slate-700">
            Total Diagnostic Tests
          </p>
          <p className="text-slate-900">
            {orders.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStep("FORM")}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
          Create Diagnostic Order
        </h3>

        <p className="mt-1 text-sm text-slate-600">
          Select the diagnostic examinations and enter
          their request information.
        </p>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Software Engineering UI demonstration only.
        The available tests are illustrative and do
        not represent a verified laboratory catalog.
        No diagnostic orders will be saved or submitted.
      </div>

      {orders.map((item, index) => (
        <section
          key={item.id}
          className="space-y-4 rounded-lg border border-slate-200 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-900">
              Diagnostic Test {index + 1}
            </h4>

            {orders.length > 1 && (
              <button
                type="button"
                onClick={() => removeOrder(item.id)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>

          <div>
            <label
              htmlFor={`diagnostic-test-${item.id}`}
              className={labelClass}
            >
              Diagnostic Test *
            </label>

            <select
              id={`diagnostic-test-${item.id}`}
              className={inputClass}
              value={item.test}
              onChange={(e) =>
                updateOrder(item.id, "test", e.target.value)
              }
            >
              <option value="">
                Select diagnostic test
              </option>

              {diagnosticTests.map((test) => (
                <option key={test} value={test}>
                  {test}
                </option>
              ))}
            </select>
          </div>

          {item.test === "Other" && (
            <div>
              <label
                htmlFor={`other-test-${item.id}`}
                className={labelClass}
              >
                Specify Diagnostic Test *
              </label>

              <input
                id={`other-test-${item.id}`}
                type="text"
                className={inputClass}
                value={item.otherTest}
                onChange={(e) =>
                  updateOrder(
                    item.id,
                    "otherTest",
                    e.target.value
                  )
                }
                placeholder="Enter diagnostic test name"
              />
            </div>
          )}

          <div>
            <label
              htmlFor={`clinical-reason-${item.id}`}
              className={labelClass}
            >
              Clinical Reason / Indication *
            </label>

            <textarea
              id={`clinical-reason-${item.id}`}
              rows={3}
              className={inputClass}
              value={item.clinicalReason}
              onChange={(e) =>
                updateOrder(
                  item.id,
                  "clinicalReason",
                  e.target.value
                )
              }
              placeholder="Enter reason for requesting this examination"
            />
          </div>

          <div>
            <label
              htmlFor={`instructions-${item.id}`}
              className={labelClass}
            >
              Additional Instructions / Remarks
            </label>

            <textarea
              id={`instructions-${item.id}`}
              rows={3}
              className={inputClass}
              value={item.instructions}
              onChange={(e) =>
                updateOrder(
                  item.id,
                  "instructions",
                  e.target.value
                )
              }
              placeholder="Enter relevant instructions or remarks"
            />
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={addOrder}
        className="rounded-md border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
      >
        + Add Another Diagnostic Test
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
          Review Diagnostic Order
        </button>
      </div>
    </div>
  );
}
