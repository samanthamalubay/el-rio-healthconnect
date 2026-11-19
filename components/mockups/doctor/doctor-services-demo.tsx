"use client";

import { useEffect, useState } from "react";
import MedicationOrderDemo from "./medication-order-demo";
import DiagnosticOrderDemo from "./diagnostic-order-demo";

type Service = "MEDICATION" | "DIAGNOSTIC" | null;

export default function DoctorServicesDemo() {
  const [service, setService] = useState<Service>(null);

  useEffect(() => {
    if (!service) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setService(null);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [service]);

  return (
    <>
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Additional Doctor Services
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Access prescriptions and laboratory workup requests for the current patient.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setService("MEDICATION")}
            className="rounded-md bg-teal-700 hover:bg-teal-800 px-4 py-2 text-sm font-medium text-white"
          >
            Create Medication Order
          </button>

          <button
            type="button"
            onClick={() => setService("DIAGNOSTIC")}
            className="rounded-md bg-teal-700 hover:bg-teal-800 px-4 py-2 text-sm font-medium text-white"
            >
            Create Diagnostic Order
          </button>
        </div>
      </section>

      {service && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setService(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="doctor-service-title"
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2
                id="doctor-service-title"
                className="text-lg font-semibold text-slate-900"
              >
                {service === "MEDICATION"
                  ? "Medication Order Service"
                  : "Diagnostic Order Service"}
              </h2>

              <button
                type="button"
                onClick={() => setService(null)}
                aria-label="Close demonstration"
                className="text-xl text-slate-500 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto p-6">
                {service === "MEDICATION" && (
                    <MedicationOrderDemo />
                )}

                {service === "DIAGNOSTIC" && (
                    <DiagnosticOrderDemo />
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
