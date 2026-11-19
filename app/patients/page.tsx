import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

type PatientSearchPageProps = {
    searchParams: Promise<{q?: string}>;
};

type PatientResult = {
    itr_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    barangay: string;
    city: string;
};

export default async function PatientPage({
    searchParams,
}: PatientSearchPageProps) {
    const supabase = await createClient();

    // Verify authenticated user.
    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    // Verify authorized staff role.
    const {data: profile, error: profileError} = await supabase
        .from("staff_profiles")
        .select("role, is_active")
        .eq("user_id", user.id)
        .single();

    const allowedRoles = ["NM", "BHW", "Doctor"];

    if (
        profileError ||
        !profile ||
        !allowedRoles.includes(profile.role) ||
        !profile.is_active
    ) {
        redirect("/unauthorized");
    }

    const {q} = await searchParams;
    const searchTerm = typeof q === "string" ? q.trim() : "";

    let patients: PatientResult[] = [];
    let searchError = false;

    // Search patients or retrieve the initial directory.
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

        // Search by patient name.
        query = query.or(
            `first_name.ilike.%${escapedTerm}%,last_name.ilike.%${escapedTerm}%`
        );
    }

    const {data, error} = await query
        .order("last_name", {ascending: true})
        .limit(20);

    if (error) {
        console.error("Patient directory failed:", error);
        searchError = true;
    } else {
        patients = data ?? [];
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* Page heading */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        Patients
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Search and access registered patient records.
                    </p>
                </div>

                {/* Patient directory */}
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Patient Directory
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Search by patient first or last name.
                        </p>
                    </div>

                    {/* Search bar */}
                    <form
                        method="GET"
                        className="flex flex-col gap-3 sm:flex-row"
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
                                href="/patients"
                                className="rounded-lg border border-slate-300 px-6 py-3 text-center font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Clear
                            </Link>
                        )}
                    </form>

                    {/* Error message */}
                    {searchError && (
                        <p
                            role="alert"
                            className="mt-5 text-sm text-red-600"
                        >
                            Unable to retrieve patient records.
                            Please try again.
                        </p>
                    )}

                    {/* Results */}
                    {!searchError && (
                        <div className="mt-8">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {searchTerm
                                        ? "Search Results"
                                        : "Registered Patients"}
                                </h3>

                                <span className="text-sm text-slate-500">
                                    Showing {patients.length} patient(s)
                                </span>
                            </div>

                            {patients.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                                    <p className="text-slate-600">
                                        {searchTerm
                                            ? `No patients found matching "${searchTerm}".`
                                            : "No patient records available."}
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border border-slate-200">
                                    <table className="w-full min-w-162.5 text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-600">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">
                                                    Patient Name
                                                </th>
                                                <th className="px-4 py-3 font-semibold">
                                                    Date of Birth
                                                </th>
                                                <th className="px-4 py-3 font-semibold">
                                                    Address
                                                </th>
                                                <th className="px-4 py-3 text-right font-semibold">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-200">
                                            {patients.map((patient) => (
                                                <tr
                                                    key={patient.itr_id}
                                                    className="hover:bg-slate-50"
                                                >
                                                    <td className="px-4 py-4">
                                                        <p className="font-semibold text-slate-900">
                                                            {patient.first_name}{" "}
                                                            {patient.last_name}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            ITR: {patient.itr_id}
                                                        </p>
                                                    </td>

                                                    <td className="px-4 py-4 text-slate-700">
                                                        {patient.date_of_birth}
                                                    </td>

                                                    <td className="px-4 py-4 text-slate-700">
                                                        {patient.barangay},{" "}
                                                        {patient.city}
                                                    </td>

                                                    <td className="px-4 py-4 text-right">
                                                        <Link
                                                            href={`/patients/${patient.itr_id}`}
                                                            className="inline-block rounded-md border border-blue-700 px-4 py-2 font-medium text-blue-700 hover:bg-blue-50"
                                                        >
                                                            View ITR
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <p className="mt-4 text-xs text-slate-500">
                                Displaying up to 20 records.
                                Additional results can be located using search.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
