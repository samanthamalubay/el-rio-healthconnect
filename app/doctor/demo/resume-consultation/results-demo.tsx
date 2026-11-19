"use client";

import { useState } from "react";

type DemoStage = "PENDING" | "AVAILABLE" | "COMPLETED";

export default function ResultsDemo() {
  const [stage, setStage] = useState<DemoStage>("PENDING");
  const [reviewed, setReviewed] = useState(false);

  return (
    <div className="space-y-5">
      {stage === "PENDING" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Laboratory results have not yet been received.
            The consultation remains pending.
          </p>

          <button
            type="button"
            onClick={() => setStage("AVAILABLE")}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Simulate Results Available
          </button>
        </div>
      )}

      {stage === "AVAILABLE" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="font-semibold text-green-900">
              Laboratory Results Available
            </p>
            <p className="mt-1 text-sm text-green-800">
              Complete Blood Count (CBC) — Demonstration result received.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">
              Laboratory Result Review
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              This demonstration represents the doctor reviewing
              laboratory results. No actual laboratory values
              are displayed or interpreted.
            </p>

            <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(event) => setReviewed(event.target.checked)}
              />
              I have reviewed the demonstration laboratory result.
            </label>
          </div>

          <button
            type="button"
            disabled={!reviewed}
            onClick={() => setStage("COMPLETED")}
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Complete Consultation (Demo)
          </button>
        </div>
      )}

      {stage === "COMPLETED" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-5">
          <h3 className="text-lg font-semibold text-green-900">
            Consultation Demonstration Completed
          </h3>

          <p className="mt-2 text-sm text-green-800">
            The laboratory result was marked as reviewed,
            and the fictional consultation has been completed.
            No patient records or visit statuses were changed.
          </p>

          <button
            type="button"
            onClick={() => {
              setReviewed(false);
              setStage("PENDING");
            }}
            className="mt-4 rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-50"
          >
            Reset Demonstration
          </button>
        </div>
      )}
    </div>
  );
}
