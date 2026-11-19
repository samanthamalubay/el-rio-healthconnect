import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {startAssessment} from "./actions";

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

    const {data: waitingVisits, error: queueError} = await supabase
        .from("patient_visits")
        .select("visit_id, itr_id, status, created_at")
        .eq("status", "WAITING_NM_ASSESSMENT")
        .order("created_at", {ascending: true});

    if (queueError) {
    console.error("Unable to retrieve NM queue:", queueError);
    throw new Error("Unable to retrieve waiting patients.");
    }

    const itrIds = waitingVisits?.map((id) => id?.itr_id);

    const {data: patient, error: patientError} = await supabase
        .from("individual_treatment_records")
        .select("itr_id, first_name, last_name")
        .in("itr_id", itrIds)

    if (patientError) {
    console.error("Unable to retrieve patient names.", patientError)
    throw new Error("Unable to retrieve patient names.")
    }

    //Return Section
  return (
    <main className="p-6 md:p-8">
      <div className="mx-auto max-w-5xl">
                
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Nurse/Midwife Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
                Manage patient assessments and review the waiting queue.
            </p>
        </div>

        <div>
                {/*NM QUEUE START*/}            
                <section className="mt-8 rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Waiting for Nurse/Midwife Assessment
                    </h2>

                    <div className="mt-4 space-y-3">
                        {waitingVisits?.length === 0 ? (
                            <p className="text-slate-600">
                                No patients waiting for assessment.
                            </p>
                        ) : (
                            waitingVisits?.map((visit) => {
                                const patientName = patient.find(patients => visit.itr_id === patients.itr_id);
                                return (
                                <div
                                    key={visit.visit_id}
                                    className="rounded-md border border-slate-200 p-4"
                                >
                                    <p className="font-medium text-slate-900">
                                        Visit ID: {visit.visit_id}
                                    </p>
                                    <p className="font-medium text-slate-900">
                                        Patient Name: {patientName ? `${patientName.first_name} ${patientName.last_name}` : "Patient information unavailable"}
                                    </p>
                                    <div className="my-2">
                                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                                            Waiting for NM Assessment
                                        </span>
                                    </div>
                                    <form action={startAssessment}>
                                        <input
                                            type="hidden"
                                            name="visitId"
                                            value={visit.visit_id}
                                        />
                                        <button
                                            type="submit"
                                            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                                        >
                                            Start Assessment
                                        </button>
                                    </form>
                                </div>
                                );
                            })
                        )}

                        
                    </div>
                </section>
        </div>
      </div>
    </main>
        )


}
