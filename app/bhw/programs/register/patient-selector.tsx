"use client";

import { useState } from "react";
import Link from "next/link";

export type PatientResult = {
  itr_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  barangay: string;
  city: string;
};

type PatientSelectorProps = {
  patients: PatientResult[];
  searchTerm: string;
  searchError: boolean;
};

const programs = [
  {
    name: "Non-Communicable Diseases (NCD)",
    description:
      "Register an existing patient for NCD monitoring and follow-up.",
    href: "/bhw/programs/register/ncd",
  },
  {
    name: "Maternal Care",
    description:
      "Register a pregnancy-specific maternal record for an existing patient.",
    href: "/bhw/programs/register/maternal",
  },
  {
    name: "Tuberculosis (TB)",
    description:
      "Register a TB treatment episode for an existing patient.",
    href: "/bhw/programs/register/tb",
  },
];

export default function PatientSelector({
  patients,
  searchTerm,
  searchError,
}: PatientSelectorProps) {
  const [selectedPatient, setSelectedPatient] =
    useState<PatientResult | null>(null);

  return (
    <div className="space-y-6">
      {/* ITR prerequisite */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Program registration requires an existing Individual
        Treatment Record (ITR). Select a patient before choosing
        a health program.
      </div>

      {/* Step 1: Patient selection */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Step 1 — Select Patient ITR
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Search for a registered patient and confirm their ITR.
        </p>

        <form
          method="GET"
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            name="q"
            defaultValue={searchTerm}
            placeholder="Search patient name..."
            aria-label="Search patients"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-6 py-3 font-medium text-white hover:bg-blue-800"
          >
            Search
          </button>

          {searchTerm && (
            <Link
              href="/bhw/programs/register"
              className="rounded-lg border border-slate-300 px-6 py-3 text-center font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear
            </Link>
          )}
        </form>

        {searchError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            Unable to retrieve patient records. Please try again.
          </p>
        )}

        {!searchError && (
          <div className="mt-6 space-y-3">
            {patients.length === 0 ? (
              <p className="text-sm text-slate-600">
                {searchTerm
                  ? "No matching patient records found."
                  : "No patient records available."}
              </p>
            ) : (
              patients.map((patient) => (
                <div
                  key={patient.itr_id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      ITR: {patient.itr_id}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {patient.barangay}, {patient.city}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPatient(patient)}
                    className="rounded-md border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    {selectedPatient?.itr_id === patient.itr_id
                      ? "Selected"
                      : "Select ITR"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {selectedPatient && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-green-900">
                    Selected Patient
                </p>

                <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="rounded-md border border-green-700 px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100"
                >
                    Clear Selection
                </button>
            </div>
            <p className="mt-1 text-sm text-green-800">
              {selectedPatient.first_name}{" "}
              {selectedPatient.last_name}
            </p>
            <p className="mt-1 break-all text-xs text-green-700">
              ITR: {selectedPatient.itr_id}
            </p>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Displaying up to 20 patient records.
        </p>
      </section>

      {/* Step 2: Program selection */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Step 2 — Select Health Program
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Select a patient ITR above to enable program registration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {programs.map((program) => (
            <section
              key={program.href}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {program.name}
              </h3>

              <p className="mt-3 flex-1 text-sm text-slate-600">
                {program.description}
              </p>

              {selectedPatient ? (
                <Link
                  href={`${program.href}?itrId=${encodeURIComponent(
                    selectedPatient.itr_id
                  )}`}
                  className="mt-6 rounded-md bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800"
                >
                  Select Program
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 cursor-not-allowed rounded-md bg-slate-300 px-4 py-2 text-sm font-medium text-slate-500"
                >
                  Select Program
                </button>
              )}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
