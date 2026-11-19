import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NCDEnrollmentForm from "./ncd-enrollment-form";

type NCDPageProps = {
  searchParams: Promise<{ itrId?: string }>;
};

export default async function NCDRegistrationPage({
  searchParams,
}: NCDPageProps) {
  const supabase = await createClient();

  // Verify authenticated user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Only authorized BHW staff can access this page.
  const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "BHW" ||
    !profile.is_active
  ) {
    redirect("/unauthorized");
  }

  const { itrId } = await searchParams;

  // An existing ITR must be selected first.
  if (!itrId) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 lg:p-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-white p-6">
          <h1 className="text-xl font-bold text-slate-900">
            Patient ITR Required
          </h1>

          <p className="mt-3 text-red-700">
            Select an existing patient ITR before beginning
            NCD program enrollment.
          </p>

          <Link
            href="/bhw/programs/register"
            className="mt-5 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Return to Program Registration
          </Link>
        </div>
      </main>
    );
  }

  // Verify that the ITR exists and is accessible.
  const { data: patient, error: patientError } = await supabase
    .from("individual_treatment_records")
    .select(
      "itr_id, first_name, last_name, date_of_birth, barangay, city"
    )
    .eq("itr_id", itrId)
    .maybeSingle();

  if (patientError || !patient) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 lg:p-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-red-200 bg-white p-6">
          <h1 className="text-xl font-bold text-slate-900">
            Patient Not Found
          </h1>

          <p className="mt-3 text-red-700">
            The selected patient ITR could not be retrieved.
            Please select a valid patient.
          </p>

          <Link
            href="/bhw/programs/register"
            className="mt-5 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Return to Program Registration
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <Link
            href="/bhw/programs/register"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← Back to Program Registration
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            NCD Program Enrollment
          </h1>

          <p className="mt-2 text-slate-600">
            Record initial NCD screening and enrollment information.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Software Engineering UI demonstration only.
          No NCD records will be saved to the database.
        </div>

        {/* Selected patient ITR */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Selected Patient ITR
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">
                Patient Name
              </p>
              <p className="font-semibold text-slate-900">
                {patient.first_name} {patient.last_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Date of Birth
              </p>
              <p className="font-medium text-slate-900">
                {patient.date_of_birth}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Address
              </p>
              <p className="font-medium text-slate-900">
                {patient.barangay}, {patient.city}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                ITR Number
              </p>
              <p className="break-all font-medium text-slate-900">
                {patient.itr_id}
              </p>
            </div>
          </div>
        </section>

        {/* Enrollment form placeholder */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <NCDEnrollmentForm itrId={patient.itr_id} />

        </section>
      </div>
    </main>
  );
}
