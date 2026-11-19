import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PatientSelector, {
  type PatientResult,
} from "./patient-selector";

type ProgramRegistrationPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ProgramRegistrationPage({
  searchParams,
}: ProgramRegistrationPageProps) {
  const supabase = await createClient();

  // Verify authenticated user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Only active BHW staff may access this page.
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

  const { q } = await searchParams;
  const searchTerm = typeof q === "string" ? q.trim() : "";

  let patients: PatientResult[] = [];
  let searchError = false;

  // Reuse the existing patient directory search pattern.
  let query = supabase
    .from("individual_treatment_records")
    .select(
      "itr_id, first_name, last_name, date_of_birth, barangay, city"
    );

  if (searchTerm) {
    const escapedTerm = searchTerm
      .replace(/\\/g, "\\\\")
      .replace(/%/g, "\\%")
      .replace(/_/g, "\\_")
      .replace(/,/g, "");

    query = query.or(
      `first_name.ilike.%${escapedTerm}%,last_name.ilike.%${escapedTerm}%`
    );
  }

  const { data, error } = await query
    .order("last_name", { ascending: true })
    .limit(20);

  if (error) {
    console.error("Program patient search failed:", error);
    searchError = true;
  } else {
    patients = data ?? [];
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Program Registration
          </h1>
          <p className="mt-2 text-slate-600">
            Select an existing patient ITR before choosing
            a health program.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Software Engineering UI demonstration only.
          Program records are not created or saved.
        </div>

        <PatientSelector
          key={searchTerm}
          patients={patients}
          searchTerm={searchTerm}
          searchError={searchError}
        />
      </div>
    </main>
  );
}
