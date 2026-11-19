import {notFound, redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardList } from "lucide-react";


export const instant = false;

type ActiveVisitPageProps = {
  params: Promise<{itrId: string}>;
  searchParams: Promise<{created?: string}>
};

export default async function ActiveVisitPage({
  params,
  searchParams,
}: ActiveVisitPageProps) {

    const supabase = await createClient();

    // Verify authentication.
    const {
        data: { user },
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

    const allowedRoles = ["BHW", "NM", "Doctor"];

    if (
        profileError ||
        !profile ||
        !allowedRoles.includes(profile.role) ||
        !profile.is_active
    ) {
        redirect("/login");
    }

    const {itrId} = await params;
    const {created} = await searchParams;

    if (!itrId) {
    redirect("/patients");
    }

    //Retrieve Active Visits from the database
     const {data: activeVisit, error: visitError} = await supabase
        .from("patient_visits")
        .select("visit_id, status, created_at")
        .eq("itr_id", itrId)
        .not("status", "in", '("COMPLETED","CANCELLED")')
        .maybeSingle();

    if (visitError) {
    console.error("Active visit retrieval failed:", visitError);
    throw new Error("Unable to retrieve active visit.");
    }

  if (!activeVisit) {
    return (
        <main className="min-h-full bg-slate-100 px-6 py-8">
            <div className="mx-auto max-w-6xl">
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                    <ClipboardList
                        className="mx-auto mb-4 h-10 w-10 text-slate-400"
                    />

                    <h2 className="text-xl font-semibold text-slate-900">
                        No Active Visit
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        This patient does not currently have an active visit.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Start a new visit from the patient's Individual Treatment Record.
                    </p>

                    <Link
                        href={`/patients/${itrId}`}
                        className="mt-6 inline-block rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-800"
                    >
                        Return to Patient ITR
                    </Link>

                </div>
            </div>
        </main>
    );
}

    // Retrieve Patient Name
    const {data: patient, error:patientError} = await supabase
        .from("individual_treatment_records")
        .select("first_name, last_name")
        .eq("itr_id", itrId)
        .maybeSingle();

    if (patientError) {
        console.error("Patient retrieval failed:", patientError);
        throw new Error("Unable to retrieve patient information.");
    }

    // Retrieve Vital Signs
    const {data: vitals, error:vitalsError} = await supabase
        .from("vital_signs")
        .select(`height_m, 
                 weight_kg, 
                 heart_rate,
                 respiratory_rate, 
                 temperature_c,
                 systolic_bp,
                 diastolic_bp`)
        .eq("visit_id", activeVisit.visit_id)
        .maybeSingle();

    if (vitalsError) {
        console.error("Vitals retrieval failed:", vitalsError);
        throw new Error("Unable to retrieve vital signs.");
    }


    // Retrieve the Nurse/Midwife assessment for this visit.
    const {data: nmAssessment, error: nmError} = await supabase
        .from("general_assessments")
        .select(`
            chief_complaint,
            interview_observations,
            outcome
        `)
        .eq("visit_id", activeVisit.visit_id)
        .maybeSingle();

    if (nmError) {
        console.error("NM assessment retrieval failed:", nmError);
        throw new Error("Unable to retrieve NM assessment.");
    }


    //RETURN START
    
    return (
    <main className="min-h-full bg-slate-100 px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">

        {created === "1" && activeVisit && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            <p className="font-semibold">
                Patient visit created successfully!
            </p>
            <p className="mt-1 text-sm">
                Vital signs have been saved. The patient is now waiting for NM assessment.
            </p>
            </div>
        )}

        {/* Active Visit Card */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                Active Visit
                </h1>

                <p className="mt-2 text-lg font-semibold text-slate-800">
                {patient?.first_name} {patient?.last_name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                Visit ID: {activeVisit.visit_id}
                </p>
            </div>

            <span className="self-start rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800">
                {activeVisit.status.replaceAll("_", " ")}
            </span>
            </div>

            {/* Vital Signs */}
            <div className="mt-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Vital Signs
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {[
                ["Height", vitals?.height_m, "m"],
                ["Weight", vitals?.weight_kg, "kg"],
                ["Heart Rate", vitals?.heart_rate, "bpm"],
                ["Respiratory Rate", vitals?.respiratory_rate, "breaths/min"],
                ["Temperature", vitals?.temperature_c, "°C"],
                [
                    "Blood Pressure",
                    vitals?.systolic_bp != null &&
                    vitals?.diastolic_bp != null
                    ? `${vitals.systolic_bp}/${vitals.diastolic_bp}`
                    : null,
                    "mmHg",
                ],
                ].map(([label, value, unit]) => (
                <div
                    key={String(label)}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                    <p className="text-sm font-medium text-slate-500">
                    {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                    {value != null ? `${value} ${unit}` : "Not recorded"}
                    </p>
                </div>
                ))}

            </div>
            </div>

            
            {/* Nurse/Midwife Assessment */}
            <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Nurse/Midwife Assessment
                    </h2>

                    <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        Read-only
                    </span>
                </div>

                {nmAssessment ? (
                    <div className="mt-4 space-y-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
                        <div>
                            <p className="text-sm font-semibold text-slate-700">
                                Chief Complaint
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">
                                {nmAssessment.chief_complaint || "Not recorded"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-700">
                                Interview Observations
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">
                                {nmAssessment.interview_observations || "Not recorded"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-700">
                                Assessment Outcome
                            </p>
                            <p className="mt-1 text-sm font-medium text-blue-800">
                                {nmAssessment.outcome.replaceAll("_", " ")}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
                        <p className="text-sm text-slate-600">
                            No Nurse/Midwife assessment has been recorded for this visit.
                        </p>
                    </div>
                )}
            </div>


        </section>
        </div>
    </main>
    );


}