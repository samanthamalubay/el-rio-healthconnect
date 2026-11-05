import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export const instant = false;

type PatientSearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function PatientPage({
  searchParams,
}: PatientSearchPageProps) {
    const supabase = await createClient();

    // Verify the authenticated user.
    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    // To verify if user is *AUTHORIZED to access Patient search feature
    const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

    const allowedRoles = ["NM", "BHW"];

    if (
        profileError ||
        !profile ||
        !allowedRoles.includes(profile.role) ||
        !profile.is_active
    ) {
        redirect("/login");
    }

    //

    const { q } = await searchParams;
    const searchTerm = typeof q === "string" ? q.trim() : "";

    type PatientResult = {
    itr_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    barangay: string;
    city: string;
    };

    let patients: PatientResult[] = [];
    let searchError = false;

    if (searchTerm) {
    const escapedTerm = searchTerm
        .replace(/\\/g, "\\\\")
        .replace(/%/g, "\\%")
        .replace(/_/g, "\\_")
        .replace(/,/g, "");

    const { data, error } = await supabase
        .from("individual_treatment_records")
        .select(
        "itr_id, first_name, last_name, date_of_birth, barangay, city"
        )
        .or(
        `first_name.ilike.%${escapedTerm}%,last_name.ilike.%${escapedTerm}%`
        )
        .order("last_name", { ascending: true })
        .limit(20);

    if (error) {
        console.error("Patient search failed:", error);
        searchError = true;
    } else {
        patients = data ?? [];
    }
    }

    //Return Section
    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Patients Page
                    </h1>
                    <Link
                    href={`/${profile.role.toLowerCase()}`}
                    className="text-sm font-medium text-blue-700 hover:underline"
                    >
                    ← Back to Dashboard
                    </Link>
                    <div>
                        <h1>
                            Search Patient
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Search for an existing patient by name or ITR ID.
                        </p>

                                  <form method="GET" className="mt-6 flex flex-wrap gap-3">
                                    <input
                                        type="search"
                                        name="q"
                                        defaultValue={searchTerm}
                                        placeholder="Enter patient's first or last name"
                                        aria-label="Search patients"
                                        className="min-w-0 flex-1 rounded-md border border-slate-300 px-4 py-3 text-slate-900"
                                    />

                                    <button
                                        type="submit"
                                        className="rounded-md bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800"
                                    >
                                        Search
                                    </button>
                                 </form>
                                        {searchError && (
                                        <p role="alert" className="mt-4 text-sm text-red-600">
                                            Unable to search patient records. Please try again.
                                        </p>
                                        )}

                                        {searchTerm && !searchError && (
                                        <div className="mt-6 space-y-3">
                                            <h2 className="text-lg font-semibold text-slate-900">
                                            Search Results
                                            </h2>

                                            {patients.length === 0 ? (
                                            <p className="text-slate-600">
                                                No patients found matching "{searchTerm}".
                                            </p>
                                            ) : (
                                            patients.map((patient) => (
                                                <div
                                                key={patient.itr_id}
                                                className="rounded-md border border-slate-200 p-4"
                                                >
                                                <p className="font-semibold text-slate-900">
                                                    {patient.first_name} {patient.last_name}
                                                </p>

                                                <p className="mt-1 text-sm text-slate-600">
                                                    Date of Birth: {patient.date_of_birth}
                                                </p>

                                                <p className="text-sm text-slate-600">
                                                    Address: {patient.barangay}, {patient.city}
                                                </p>

                                                <p className="mt-2 break-all text-xs text-slate-500">
                                                    ITR ID: {patient.itr_id}
                                                </p>
                                                <Link
                                                    href={`/patients/${patient.itr_id}`}
                                                    className="mt-4 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                                                    >
                                                    View ITR
                                                </Link>
                                                </div>
                                            ))
                                            )}
                                        </div>
                                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}