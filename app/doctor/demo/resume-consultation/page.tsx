import ResultsDemo from "./results-demo";
import Link from "next/link";

export default function ResumeConsultationDemoPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <Link
            href="/doctor"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← Back to Consultation Queue
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Resume Consultation
              </h1>
              <p className="mt-1 text-slate-600">
                Alex Rivera — Demonstration Patient
              </p>
            </div>

            <span className="rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
              Pending Laboratory Results
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Software Engineering UI demonstration only.
          All patient information and clinical details shown here
          are fictional. No consultation records will be modified.
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Previous Consultation Summary
          </h2>

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="font-semibold text-slate-700">
                Chief Complaint
              </p>
              <p className="mt-1 text-slate-900">
                Persistent fatigue and intermittent dizziness.
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-700">
                Initial Assessment
              </p>
              <p className="mt-1 text-slate-900">
                Further laboratory evaluation requested before
                finalizing the consultation.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Diagnostic Orders
          </h2>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4">
            <div>
              <p className="font-semibold text-slate-900">
                Complete Blood Count (CBC)
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Requested during the previous consultation.
              </p>
            </div>

            <span className="rounded-md bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
              Awaiting Results
            </span>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Consultation Continuation
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            The doctor can review the pending diagnostic request.
            Consultation completion will remain unavailable
            until the required results are reviewed.
          </p>

          <div className="mt-5">
            <ResultsDemo />
          </div>
        </section>
      </div>
    </main>
  );
}
