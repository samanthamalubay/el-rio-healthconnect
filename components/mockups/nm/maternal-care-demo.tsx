"use client";

import { useState } from "react";
import PrenatalVisitDemo from "./prenatal-visit-demo";
import PostnatalVisitDemo from "./postnatal-visit-demo";

type MaternalView = "RECORD" | "PRENATAL" | "POSTNATAL";

const sampleMaternalRecord = {
  patientName: "Isabella Reyes",
  recordType: "Sample Maternal Record",
  gravida: 2,
  para: 1,
  preterm: 0,
  abortion: 0,
  living: 1,

  lastMenstrualPeriod: "2026-02-10",
  expectedDeliveryDate: "2026-11-17",

  previousPregnancies: [
    {
      year: "2022",
      outcome: "Full-term live birth",
      delivery: "Normal spontaneous vaginal delivery",
    },
  ],

  prenatalHistory: [
    {
      date: "2026-06-15",
      gestationalAge: "18 weeks",
      findings: "Routine prenatal assessment",
    },
    {
      date: "2026-09-21",
      gestationalAge: "32 weeks",
      findings: "Routine prenatal follow-up",
    },
  ],
};

export default function MaternalCareDemo() {
  const [view, setView] = useState<MaternalView>("RECORD");

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Software Engineering demonstration only. This is a fictional
        maternal record and is not associated with the currently
        selected patient. No database records will be modified.
      </div>

      {view === "RECORD" && (
        <>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Individual Treatment Maternal Record
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {sampleMaternalRecord.recordType}
            </p>
          </div>

          <section className="rounded-lg border border-slate-200 p-4">
            <h4 className="mb-3 font-semibold text-slate-900">
              Patient Information
            </h4>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-slate-500">Patient Name</p>
                <p className="font-medium">
                  {sampleMaternalRecord.patientName}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Record Type</p>
                <p className="font-medium">
                  {sampleMaternalRecord.recordType}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <h4 className="mb-3 font-semibold text-slate-900">
              OB-Gyne History
            </h4>

            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
              {[
                ["Gravida", sampleMaternalRecord.gravida],
                ["Para", sampleMaternalRecord.para],
                ["Preterm", sampleMaternalRecord.preterm],
                ["Abortion", sampleMaternalRecord.abortion],
                ["Living", sampleMaternalRecord.living],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md bg-slate-50 p-3"
                >
                  <p className="text-slate-500">{label}</p>
                  <p className="font-semibold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <h4 className="mb-3 font-semibold text-slate-900">
              Current Pregnancy
            </h4>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-slate-500">
                  Last Menstrual Period
                </p>
                <p className="font-medium">
                  {sampleMaternalRecord.lastMenstrualPeriod}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Expected Delivery Date
                </p>
                <p className="font-medium">
                  {sampleMaternalRecord.expectedDeliveryDate}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <h4 className="mb-3 font-semibold text-slate-900">
              Previous Pregnancy History
            </h4>

            <div className="space-y-3">
              {sampleMaternalRecord.previousPregnancies.map(
                (pregnancy, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-slate-50 p-3 text-sm"
                  >
                    <p className="font-medium">
                      {pregnancy.year} — {pregnancy.outcome}
                    </p>
                    <p className="text-slate-600">
                      {pregnancy.delivery}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <h4 className="mb-3 font-semibold text-slate-900">
              Prenatal Visit History
            </h4>

            <div className="space-y-3">
              {sampleMaternalRecord.prenatalHistory.map(
                (visit, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-slate-50 p-3 text-sm"
                  >
                    <p className="font-medium">
                      {visit.date} — {visit.gestationalAge}
                    </p>
                    <p className="text-slate-600">
                      {visit.findings}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => setView("PRENATAL")}
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Record Prenatal Visit
            </button>

            <button
              type="button"
              onClick={() => setView("POSTNATAL")}
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Record Postnatal Visit
            </button>
          </div>
        </>
      )}

      {view === "PRENATAL" && (
        <div className="space-y-4">
            <PrenatalVisitDemo />

            <button
            type="button"
            onClick={() => setView("RECORD")}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium"
            >
            Back to Maternal Record
            </button>
        </div>
      )}

      {view === "POSTNATAL" && (
        <div className="space-y-4">
            <PostnatalVisitDemo />

            <button
            type="button"
            onClick={() => setView("RECORD")}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium"
            >
            Back to Maternal Record
            </button>
        </div>
      )}
    </div>
  );
}
