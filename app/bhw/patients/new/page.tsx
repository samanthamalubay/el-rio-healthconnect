import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PatientForm from "./patient-form";

export const instant = false;

export default async function NewPatientPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

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
    redirect("/bhw");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/bhw"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Register Patient
        </h1>

        <p className="mt-2 text-slate-600">
          Create a new Individual Treatment Record (ITR).
        </p>

        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Patient Information
          </h2>

          <div className="mt-6">
            <PatientForm />
          </div>
        </section>
      </div>
    </main>
  );
}