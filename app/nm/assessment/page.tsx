import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import PatientHeader from "@/components/patients/patient-header";
import AssessmentForm from "./assessment-form";
import PatientITR from "@/components/patients/patient-itr";
import Link from "next/link";

export const instant = false;

type AssessmentPageProps = {
    searchParams: Promise<{
        completed?: string;
    }>;
};

export default async function AssessmentPage({
    searchParams,
}: AssessmentPageProps) {

    const { completed } = await searchParams;

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

    const {data: activeAssessment, error: assessmentError} = await supabase
        .from("patient_visits")
        .select("visit_id, itr_id, status")
        .eq("status", "NM_ASSESSMENT_IN_PROGRESS")
        .eq("assessment_started_by", user.id)
        .maybeSingle();

    if (assessmentError) {
    console.error("Unable to retrieve NM Current Assessment:", assessmentError);
    throw new Error("Unable to retrieve current assessment.");
    }

    
    if (!activeAssessment) {
        return (
            <main className="mx-auto w-full max-w-6xl px-6 py-8 md:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                        My Assessment
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Manage your currently assigned patient assessment.
                    </p>
                </div>

                {completed === "ENDORSED_TO_DOCTOR" && (
                    <div
                        role="status"
                        className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
                    >
                        <p className="font-semibold">
                            General assessment endorsed successfully!
                        </p>

                        <p className="mt-1 text-sm">
                            The patient's assessment has been saved.
                            The visit is now waiting for doctor consultation.
                        </p>
                    </div>
                )}

                {completed === "COMPLETED_WITHOUT_ENDORSEMENT" && (
                    <div
                        role="status"
                        className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
                    >
                        <p className="font-semibold">
                            General assessment completed successfully!
                        </p>

                        <p className="mt-1 text-sm">
                            The patient's assessment has been saved
                            without endorsement to the doctor.
                        </p>
                    </div>
                )}

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900">
                        No Active Assessment
                    </h2>

                    <p className="mt-2 text-slate-600">
                        You currently have no active patient assessment.
                        Select a patient from the assessment queue to begin.
                    </p>

                    <Link
                        href="/nm"
                        className="mt-5 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                    >
                        View Assessment Queue
                    </Link>
                </section>
            </main>
        );
    }


    //To retrieve patient name
    const itrId = activeAssessment.itr_id;

    const {data: patient, error: patientError} = await supabase
        .from("individual_treatment_records")
        .select("first_name, last_name")
        .eq("itr_id", itrId)
        .maybeSingle();

    if (patientError) {
    console.error("Unable to retrieve patient names.", patientError)
    throw new Error("Unable to retrieve patient names.")
    }

    if (!patient) {
    throw new Error("Patient information not found.");
    }

    //To retrieve vital signs
    const {data: vitals, error:vitalsError} = await supabase
        .from("vital_signs")
        .select(`height_m, 
                 weight_kg, 
                 heart_rate,
                 respiratory_rate, 
                 temperature_c,
                 systolic_bp,
                 diastolic_bp`)
        .eq("visit_id", activeAssessment.visit_id)
        .maybeSingle();

    if (vitalsError) {
        console.error("Vitals retrieval failed:", vitalsError);
        throw new Error("Unable to retrieve vital signs.");
    }

    if (!vitals) {
    throw new Error("Vital signs not found.");
    }
    

    //RETURN START
    return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:px-8">
        
        <PatientHeader
            visit={activeAssessment}
            patient={patient}
            vitals={vitals}
            title="My Assessment"
            subtitle="Current Assessment"
        />
        

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="min-w-0">
                <AssessmentForm visitId={activeAssessment.visit_id} />
            </div>

            <div className="min-w-0">
                <PatientITR itrId={activeAssessment.itr_id}/>
            </div>
        </div>

        

    </main>
);
}