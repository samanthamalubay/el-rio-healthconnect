"use client";

import { useState } from "react";
import ImmunizationDemo from "./immunization-demo";
import MaternalCareDemo from "./maternal-care-demo";

type Service = "IMMUNIZATION" | "MATERNAL" | null;

export default function NMServicesDemo() {
  const [activeService, setActiveService] = useState<Service>(null);

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Additional NM Services
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Access immunization and maternal care services for the current patient.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveService("IMMUNIZATION")}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Immunization
        </button>

        <button
          type="button"
          onClick={() => setActiveService("MATERNAL")}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
          Maternal Care
        </button>
      </div>

      {activeService !== null && (
        <div
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveService(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nm-service-demo-title"
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
                {activeService === "IMMUNIZATION"
                ? "Immunization Service"
                : "Maternal Care Service"}

                <button
                    type="button"
                    onClick={() => setActiveService(null)}
                    aria-label="Close immunization demonstration"
                    className="rounded-md px-3 py-1 text-xl text-slate-600 hover:bg-slate-100"
                >
                    ×
                </button>
            </div>

            <div className="overflow-y-auto p-5">
                {activeService === "IMMUNIZATION" ? (
                <ImmunizationDemo />
                ) : (
                <MaternalCareDemo />
                )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
