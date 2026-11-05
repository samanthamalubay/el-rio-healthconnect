import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {logout} from "@/app/bhw/actions";
import Link from "next/link";

export const instant = false;

export default async function NMDashboard() {
    const supabase = await createClient();

    // To verify if user is authenticated and able to access the Nurse/Midwife Dashboard
    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    // To verify if user is *AUTHORIZED to access Nurse/Midwife Dashboard

    const {data: profile, error: profileError} = await supabase
        .from("staff_profiles")
        .select("full_name, role, is_active")
        .eq("user_id", user.id)
        .single();

    if (profileError || 
        !profile || 
        profile.role !== "NM" || 
        !profile.is_active
    ) {
        redirect("/login");
    }

    //Return Section
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-slate-900">
                NM Dashboard
            </h1>
            <form action={logout}>
                            <button
                            type="submit"
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                            Sign Out
                            </button>
                        </form>
            <p className="mt-3 text-slate-700">
                Welcome, Nurse/MidWife!
            </p>

            <Link
                href="/patients"
                className="inline-block rounded-md border border-blue-700 bg-white px-5 py-3 font-medium text-blue-700 hover:bg-blue-50"
              >
                Search Patient
              </Link>
            
        </div>
      </div>
    </main>
        )


}
