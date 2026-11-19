import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";

type VisitDetailsPageProps = {
    params: Promise<{
        itrId: string;
        visitId: string;
    }>;
};

// Format timestamps using Philippine local time.
function formatDate(value: string | null | undefined) {
    if (!value) return "Not recorded";

    return new Date(value).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Manila",
    });
}

// Display database statuses in a readable format.
function formatStatus(value: string) {
    return value.replaceAll("_", " ");
}

// Reusable label-and-value display.
function DetailField({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    return (
        <div>
            <dt className="text-sm font-medium text-slate-500">
                {label}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap wrap-break-words text-slate-900">
                {value === null ||
                value === undefined ||
                value === ""
                    ? "Not recorded"
                    : value}
            </dd>
        </div>
    );
}

// Reusable workspace section.
function VisitSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="border-b border-slate-200 pb-3 text-xl font-semibold text-slate-900">
                {title}
            </h2>

            <div className="mt-5">{children}</div>
        </section>
    );
}

const ROS_SYSTEM_LABELS: Record<string, string> = {
    HEENT: "HEENT",
    CHEST_BREASTS_LUNGS: "Chest, Breasts and Lungs",
    HEART: "Heart",
    ABDOMEN: "Abdomen",
    GENITOURINARY: "Genitourinary",
    EXTREMITIES: "Extremities",
    NEUROLOGICAL: "Neurological",
};

const ROS_SYSTEM_ORDER = [
    "HEENT",
    "CHEST_BREASTS_LUNGS",
    "HEART",
    "ABDOMEN",
    "GENITOURINARY",
    "EXTREMITIES",
    "NEUROLOGICAL",
];

export default async function VisitDetailsPage({
    params,
}: VisitDetailsPageProps) {
    const { itrId, visitId } = await params;

    const supabase = await createClient();

    //To Verify is user is AUTHORIZED to access
    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    //To verify is user has correct ROLE
    const {data: profile, error: profileError} = await supabase
        .from("staff_profiles")
        .select("role, is_active")
        .eq("user_id", user.id)
        .single();

    if (profileError || !profile || !profile.is_active) {
        redirect("/unauthorized");
    }

    // Clinical Visit Details are restricted to NM and Doctor. BHW are not allowed to view. ONLY VITAL SIGNS FOR BHW!
    const allowedRoles = ["NM", "Doctor"];

    if (!allowedRoles.includes(profile.role)) {
        redirect("/unauthorized");
    }

    // Retrieve the requested visit
    const {data: visit, error: visitError} = await supabase
        .from("patient_visits")
        .select(
            "visit_id, itr_id, status, created_at, updated_at, created_by"
        )
        .eq("visit_id", visitId)
        .eq("itr_id", itrId)
        .maybeSingle();

    if (visitError) {
        console.error("Visit retrieval failed:", visitError);
        throw new Error("Unable to retrieve visit information.");
    }

    if (!visit) {
        notFound();
    }

    // STEP 4: Retrieve the visit's clinical records.
    // Each query is read-only and uses the verified visit ID.
    const [
        vitalResult,
        assessmentResult,
        consultationResult,
    ] = await Promise.all([
        supabase
            .from("vital_signs")
            .select(
                "height_m, weight_kg, heart_rate, respiratory_rate, temperature_c, systolic_bp, diastolic_bp, recorded_at, recorded_by"
            )
            .eq("visit_id", visit.visit_id)
            .order("recorded_at", { ascending: false }),

        supabase
            .from("general_assessments")
            .select(
                "chief_complaint, interview_observations, outcome, assessed_by, completed_at"
            )
            .eq("visit_id", visit.visit_id)
            .maybeSingle(),

        supabase
            .from("consultations")
            .select(
                "consultation_id, subjective_findings, objective_findings, assessment, treatment_plan, consulted_by, completed_at"
            )
            .eq("visit_id", visit.visit_id)
            .maybeSingle(),
    ]);

    if (vitalResult.error) {
        console.error("Vital signs retrieval failed:", vitalResult.error);
        throw new Error("Unable to retrieve vital signs.");
    }

    if (assessmentResult.error) {
        console.error(
            "General assessment retrieval failed:",
            assessmentResult.error
        );
        throw new Error("Unable to retrieve general assessment.");
    }

    if (consultationResult.error) {
        console.error(
            "Consultation retrieval failed:",
            consultationResult.error
        );
        throw new Error("Unable to retrieve consultation.");
    }

    const vitalSigns = vitalResult.data ?? [];
    const generalAssessment = assessmentResult.data;
    const consultation = consultationResult.data;

    //Retrieve ROS findings if a consultation exists.
    let rosFindings: {
        ros_finding_id: string;
        body_system: string;
        finding: string;
        other_details: string | null;
    }[] = [];

    if (consultation) {
        const { data, error } = await supabase
            .from("consultation_ros_findings")
            .select(
                "ros_finding_id, body_system, finding, other_details"
            )
            .eq("consultation_id", consultation.consultation_id);

        if (error) {
            console.error("ROS retrieval failed:", error);
            throw new Error("Unable to retrieve ROS findings.");
        }

        rosFindings = data ?? [];
    }

    //Display the read-only Visit Details workspace.
    return (
        <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Navigation */}
                <Link
                    href={`/patients/${itrId}`}
                    className="inline-block text-sm font-medium text-blue-700 hover:underline"
                >
                    ← Back to Individual Treatment Record
                </Link>

                {/* Visit header */}
                <header className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                Visit Details
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Visit Date: {formatDate(visit.created_at)}
                            </p>

                            <p className="mt-1 break-all text-xs text-slate-500">
                                Visit ID: {visit.visit_id}
                            </p>
                        </div>

                        <span
                            className={`inline-flex self-start rounded-full px-3 py-1 text-sm font-semibold ${
                                visit.status === "COMPLETED"
                                    ? "bg-green-100 text-green-800"
                                    : visit.status === "CANCELLED"
                                      ? "bg-slate-200 text-slate-700"
                                      : "bg-amber-100 text-amber-800"
                            }`}
                        >
                            {formatStatus(visit.status)}
                        </span>
                    </div>
                </header>

                {/* Visit Overview */}
                <VisitSection title="Visit Overview">
                    <dl className="grid gap-5 sm:grid-cols-2">
                        <DetailField
                            label="Visit Date"
                            value={formatDate(visit.created_at)}
                        />
                        <DetailField
                            label="Visit Status"
                            value={formatStatus(visit.status)}
                        />
                        <DetailField
                            label="Last Updated"
                            value={formatDate(visit.updated_at)}
                        />
                        <DetailField
                            label="ITR Number"
                            value={visit.itr_id}
                        />
                    </dl>
                </VisitSection>

                {/* Vital Signs */}
                <VisitSection title="Vital Signs">
                    {vitalSigns.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No vital signs recorded for this visit.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {vitalSigns.map((vitals, index) => (
                                <div
                                    key={`${vitals.recorded_at}-${index}`}
                                    className="space-y-4"
                                >
                                    <p className="text-sm text-slate-500">
                                        Recorded: {formatDate(vitals.recorded_at)}
                                    </p>

                                    <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        <DetailField
                                            label="Height"
                                            value={
                                                vitals.height_m == null
                                                    ? null
                                                    : `${vitals.height_m} m`
                                            }
                                        />
                                        <DetailField
                                            label="Weight"
                                            value={`${vitals.weight_kg} kg`}
                                        />
                                        <DetailField
                                            label="Heart Rate"
                                            value={`${vitals.heart_rate} bpm`}
                                        />
                                        <DetailField
                                            label="Respiratory Rate"
                                            value={`${vitals.respiratory_rate} breaths/min`}
                                        />
                                        <DetailField
                                            label="Temperature"
                                            value={`${vitals.temperature_c} °C`}
                                        />
                                        <DetailField
                                            label="Blood Pressure"
                                            value={`${vitals.systolic_bp}/${vitals.diastolic_bp} mmHg`}
                                        />
                                    </dl>

                                    {index < vitalSigns.length - 1 && (
                                        <hr className="border-slate-200" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </VisitSection>

                {/* Nurse / Midwife Assessment */}
                <VisitSection title="Nurse / Midwife General Assessment">
                    {!generalAssessment ? (
                        <p className="text-sm text-slate-500">
                            No completed general assessment is available
                            for this visit.
                        </p>
                    ) : (
                        <div className="space-y-5">
                            <dl className="space-y-5">
                                <DetailField
                                    label="Chief Complaint"
                                    value={generalAssessment.chief_complaint}
                                />

                                <DetailField
                                    label="Interview Observations"
                                    value={
                                        generalAssessment.interview_observations
                                    }
                                />

                                <DetailField
                                    label="Assessment Outcome"
                                    value={formatStatus(
                                        generalAssessment.outcome
                                    )}
                                />

                                <DetailField
                                    label="Completed At"
                                    value={formatDate(
                                        generalAssessment.completed_at
                                    )}
                                />
                            </dl>
                        </div>
                    )}
                </VisitSection>

                {/* Doctor Consultation */}
                <VisitSection title="Doctor Consultation">
                    {!consultation ? (
                        <p className="text-sm text-slate-500">
                            No completed Doctor consultation is available
                            for this visit.
                        </p>
                    ) : (
                        <dl className="space-y-6">
                            <DetailField
                                label="Subjective Findings"
                                value={consultation.subjective_findings}
                            />

                            <DetailField
                                label="Objective Findings"
                                value={consultation.objective_findings}
                            />

                            <DetailField
                                label="Assessment"
                                value={consultation.assessment}
                            />

                            <DetailField
                                label="Treatment Plan"
                                value={consultation.treatment_plan}
                            />

                            <DetailField
                                label="Consultation Completed"
                                value={formatDate(
                                    consultation.completed_at
                                )}
                            />
                        </dl>
                    )}
                </VisitSection>

                {/* Review of Systems */}
                <VisitSection title="Review of Systems (ROS)">
                    {!consultation ? (
                        <p className="text-sm text-slate-500">
                            No Doctor consultation is available.
                        </p>
                    ) : rosFindings.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No ROS findings recorded.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {ROS_SYSTEM_ORDER.map((system) => {
                                const findings = rosFindings.filter(
                                    (item) => item.body_system === system
                                );

                                if (findings.length === 0) return null;

                                return (
                                    <div
                                        key={system}
                                        className="rounded-lg border border-slate-200 p-4"
                                    >
                                        <h3 className="font-semibold text-slate-900">
                                            {ROS_SYSTEM_LABELS[system]}
                                        </h3>

                                        <ul className="mt-3 space-y-2">
                                            {findings.map((item) => (
                                                <li
                                                    key={item.ros_finding_id}
                                                    className="text-sm text-slate-700"
                                                >
                                                    <span className="font-medium">
                                                        {formatStatus(
                                                            item.finding
                                                        )}
                                                    </span>

                                                    {item.other_details && (
                                                        <p className="mt-1 whitespace-pre-wrap text-slate-600">
                                                            Details:{" "}
                                                            {item.other_details}
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </VisitSection>

                {/* Bottom navigation */}
                <div className="pb-8">
                    <Link
                        href={`/patients/${itrId}`}
                        className="inline-flex rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
                    >
                        Back to ITR
                    </Link>
                </div>
            </div>
        </main>
    );
}
