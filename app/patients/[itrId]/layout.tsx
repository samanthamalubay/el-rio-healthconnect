import Link from "next/link";
import type {ReactNode} from "react";
import PatientNavigation from "./patient-navigation";

type PatientLayoutProps = {
  children: ReactNode;
  params: Promise<{itrId: string}>;
};

export default async function PatientLayout({
  children,
  params,
}: PatientLayoutProps) {
  const {itrId} = await params;

  return (
    <div className="min-w-0">
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <Link
            href="/patients"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← Back to Patients
          </Link>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Patient Workspace
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Patient records and visits
            </p>
          </div>

          <PatientNavigation itrId={itrId} />
        </div>
      </div>

      <main className="min-w-0">{children}</main>
    </div>
  );
}
