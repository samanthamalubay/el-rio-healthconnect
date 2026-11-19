import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import PatientITR from "@/components/patients/patient-itr";
import PatientHeader from "@/components/patients/patient-header";
import ConsultationForm from "./consultation-form";
import Link from "next/link";

export const instant = false;

export default async function DoctorConsultationPage() {
    const supabase = await createClient();

    const {
        data: {user},
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    const {data: profile, error: profileError} = await supabase
        .from("staff_profiles")
        .select("role, is_active")
        .eq("user_id", user.id)
        .single();

    if (
        profileError ||
        !profile ||
        profile.role !== "Doctor" ||
        !profile.is_active
    ) {
        redirect("/login");
    }

    // Retrieve the consultation assigned to the Doctor
    const {data: activeVisit, error: visitError} = await supabase
        .from("patient_visits")
        .select("visit_id, itr_id, status")
        .eq("consultation_started_by", user.id)
        .eq("status", "DOCTOR_CONSULTATION_IN_PROGRESS")
        .maybeSingle();

    if (visitError) {
        console.error("Unable to retrieve active consultation:", visitError);
        throw new Error("Unable to retrieve active consultation.");
    }

    if (!activeVisit) {
        return (
            <main className="min-h-screen p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-lg border border-slate-200 bg-white p-8">
                        <h1 className="text-2xl font-bold text-slate-900">
                            No Active Consultation
                        </h1>

                        <p className="mt-3 text-slate-600">
                            You do not have an active consultation at the moment.
                            Please return to the consultation queue to begin
                            a new consultation.
                        </p>

                        <Link
                            href="/doctor"
                            className="mt-6 inline-flex rounded-md bg-teal-700
                                    px-4 py-2 text-sm font-medium text-white
                                    hover:bg-teal-800"
                        >
                            Return to Consultation Queue
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

     //To retrieve patient name
    const itrId = activeVisit.itr_id;

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
        .eq("visit_id", activeVisit.visit_id)
        .maybeSingle();

    if (vitalsError) {
        console.error("Vitals retrieval failed:", vitalsError);
        throw new Error("Unable to retrieve vital signs.");
    }

    if (!vitals) {
    throw new Error("Vital signs not found.");
    }

    //To retrieve completed NM Assessment

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

    if (!nmAssessment) {
        throw new Error("Completed NM assessment not found.");
    }


    
    return (
        <main className="min-h-screen p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Shared patient and visit header */}
                <PatientHeader
                    visit={activeVisit}
                    patient={patient}
                    vitals={vitals}
                    title="Doctor Consultation"
                    subtitle="Current Consultation"
                />

                {/* Completed Nurse/Midwife assessment */}
                <section className="rounded-lg border border-slate-200 bg-white p-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Nurse/Midwife Assessment
                    </h2>

                    <div className="mt-4 space-y-4 text-sm text-slate-700">
                        <div>
                            <p className="font-semibold">Chief Complaint</p>
                            <p>{nmAssessment.chief_complaint}</p>
                        </div>

                        <div>
                            <p className="font-semibold">
                                Interview Observations
                            </p>
                            <p>{nmAssessment.interview_observations}</p>
                        </div>

                        <div className="my-2">
                            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                                 Endorsed to Doctor
                             </span>
                        </div>
                    </div>
                </section>

                {/* Doctor consultation and patient ITR */}
                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">

                    {/* Left: Doctor consultation and additional services */}
                    <div className="min-w-0 space-y-6">

                    <ConsultationForm visitId={activeVisit.visit_id} />
                    </div>

                    {/* Right: Read-only patient ITR */}
                    <div className="min-w-0">
                        <PatientITR itrId={activeVisit.itr_id} />
                    </div>

                </div>

            </div>
        </main>
    );

}
