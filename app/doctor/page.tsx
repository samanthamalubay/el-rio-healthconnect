import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {startConsultation} from "./actions";
import Link from "next/link";

type DoctorDashboardProps = {
    searchParams: Promise<{
        success?: string;
    }>;
};

export default async function DoctorDashboard({
    searchParams,
}: DoctorDashboardProps) {
    const { success } = await searchParams;

     const supabase = await createClient();

    // To verify if user is authenticated and able to access the Doctor Dashboard
    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    // To verify if user is *AUTHORIZED to access Doctor Dashboard

    const {data: profile, error: profileError} = await supabase
        .from("staff_profiles")
        .select("full_name, role, is_active")
        .eq("user_id", user.id)
        .single();

    if (profileError || 
        !profile || 
        profile.role !== "Doctor" || 
        !profile.is_active
    ) {
        redirect("/login");
    }

    const {data: waitingConsultation, error: queueError} = await supabase
        .from("patient_visits")
        .select("visit_id, itr_id, status, created_at")
        .eq("status", "WAITING_DOCTOR_CONSULTATION")
        .order("created_at", {ascending: true});

    if (queueError) {
    console.error("Unable to retrieve Doctor's queue:", queueError);
    throw new Error("Unable to retrieve waiting patients.");
    }

    if (!waitingConsultation) {
    throw new Error("Consultation information not found.");
    }
    
    const itrIds = waitingConsultation.map((id) => id?.itr_id);

    const {data: patient, error: patientError} = await supabase
        .from("individual_treatment_records")
        .select("itr_id, first_name, last_name")
        .in("itr_id", itrIds)

    if (patientError) {
    console.error("Unable to retrieve patient names.", patientError)
    throw new Error("Unable to retrieve patient names.")
    }

    //RETURN START
 return (
    <main className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Doctor's Dashboard
                </h1>
                <p className=" text-slate-700">
                Welcome, Doctor!
                </p>
            </div>
            
        </div>
        <div>
            {success === "consultation" && (
                <div
                    role="status"
                    className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
                >
                    <p className="font-semibold">
                        Medical consultation completed successfully!
                    </p>
                    <p className="mt-1 text-sm">
                        The consultation has been saved and the patient visit
                        has been updated.
                    </p>
                </div>
            )}
                {/*NM QUEUE START*/}            
                <section className="mt-8 rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Waiting for Doctor's Consultation
                    </h2>

                    <div className="mt-4 space-y-3">
                        {waitingConsultation.length === 0 ? (
                            <p className="text-slate-600">
                                No patients waiting for consultation.
                            </p>
                        ) : (
                            waitingConsultation.map((visit) => {
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
                                            Waiting for Doctor's Consultation
                                        </span>
                                    </div>
                                                                        
                                    <form action={startConsultation}>
                                        <input
                                            type="hidden"
                                            name="visitId"
                                            value={visit.visit_id}
                                        />

                                        <button
                                            type="submit"
                                            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                                        >
                                            Start Consultation
                                        </button>
                                    </form>

                                </div>
                                );
                            })
                        )}

                        
                    </div>
                </section>

                
                {/* Software Engineering demonstration only */}
                <section className="mt-6 rounded-lg border border-amber-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-slate-900">
                    Pending Laboratory Results
                    </h2>

                    <span className="rounded-md bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                    UI Demonstration
                    </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                    Illustrative consultations awaiting diagnostic results.
                    These records are not retrieved from the database.
                </p>

                <div className="mt-4 rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <p className="font-semibold text-slate-900">
                        Alex Rivera (Demo Patient)
                        </p>

                        <p className="text-sm text-slate-600">
                        Diagnostic request: Complete Blood Count (CBC)
                        </p>

                        <span className="inline-block rounded-md bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                        Pending Lab Results
                        </span>
                    </div>

                    <Link
                        href="/doctor/demo/resume-consultation"
                        className="inline-flex items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                    >
                        Resume Consultation
                    </Link>
                    </div>
                </div>
                </section>


        </div>
      </div>
    </main>
        )
}