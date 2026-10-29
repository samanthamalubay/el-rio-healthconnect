import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {logout} from "./actions";
import Link from "next/link";

export const instant = false;

export default async function BHWDashboard() {
  const supabase = await createClient();

  // Verify the authenticated user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Verify the user's staff role and active status.
  const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("full_name, role, is_active")
    .eq("user_id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    profile.role !== "BHW" ||
    !profile.is_active
  ) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-slate-900">
                BHW Dashboard
            </h1>

            <form action={logout}>
                <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                Sign Out
                </button>
            </form>
        </div>

        <p className="mt-3 text-slate-700">
          Welcome, {profile.full_name}!
        </p>

        <p className="mt-2 text-sm text-slate-600">
          You are signed in as an authorized Barangay Health Worker.
        </p>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Patient Records
            </h2>

            <p className="mt-2 text-slate-600">
              Register new patients and manage their Individual
              Treatment Records.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/bhw/patients/new"
                className="inline-block rounded-md bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800"
              >
                Register Patient
              </Link>

              <Link
                href="/bhw/patients"
                className="inline-block rounded-md border border-blue-700 bg-white px-5 py-3 font-medium text-blue-700 hover:bg-blue-50"
              >
                Search Patient
              </Link>
            </div>
        </div>
      </div>
    </main>
  );
}