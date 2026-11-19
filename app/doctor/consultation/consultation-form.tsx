"use client";

import {useState} from "react";
import ROSChecklist, {
    ROSFinding,
    ROS_SYSTEMS,
    validateROS,
} from "./ros-checklist";
import {useTransition} from "react";
import {completeDoctorConsultation} from "./actions";

type ConsultationFormProps = {
    visitId: string;
};

type ConsultationFields = {
    subjective: string;
    objective: string;
    assessment: string;
    treatmentPlan: string;
};

export default function ConsultationForm({
    visitId,
}: ConsultationFormProps) {
    const [fields, setFields] = useState<ConsultationFields>({
        subjective: "",
        objective: "",
        assessment: "",
        treatmentPlan: "",
    });

    const [activeTab, setActiveTab] = useState<"ROS" | "SOAP">("ROS");
    const [rosFindings, setRosFindings] = useState<ROSFinding[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isPending, startTransition] = useTransition();

    function updateField(
        field: keyof ConsultationFields,
        value: string
    ) {
        setFields((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function handleReview(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (
            !fields.subjective.trim() ||
            !fields.objective.trim() ||
            !fields.assessment.trim() ||
            !fields.treatmentPlan.trim()
        ) {
            setError("All consultation documentation fields are required.");
            return;
        }

        const rosError = validateROS(rosFindings);

        if (rosError) {
        setActiveTab("ROS");
        setError(rosError);
        return;
        }

        setShowConfirmation(true);
    }

    function handleComplete() {
        setError(null);

        const rosError = validateROS(rosFindings);

        if (rosError) {
            setShowConfirmation(false);
            setError(rosError);
            return;
        }

        if (
            !fields.subjective.trim() ||
            !fields.objective.trim() ||
            !fields.assessment.trim() ||
            !fields.treatmentPlan.trim()
        ) {
            setShowConfirmation(false);
            setError("All consultation documentation fields are required.");
            return;
        }

        startTransition(async () => {
            try {
                await completeDoctorConsultation({
                    visitId,
                    subjective: fields.subjective,
                    objective: fields.objective,
                    assessment: fields.assessment,
                    treatmentPlan: fields.treatmentPlan,
                    rosFindings,
                });
            } catch (error) {
                console.error("Consultation submission failed:", error);
                setError(
                    "Unable to complete the consultation. Please try again."
                );
                setShowConfirmation(false);
            }
        });
    }

    function getFindingLabel(bodySystem: string, finding: string) {
        if (finding === "ESSENTIALLY_NORMAL") {
            return "Essentially Normal";
        }

        if (finding === "OTHER") {
            return "Others";
        }

        const system = ROS_SYSTEMS.find(
            (item) => item.value === bodySystem
        );

        return (
            system?.options.find((option) => option.value === finding)
                ?.label ?? finding
        );
    }

    return (
        <>
            <form onSubmit={handleReview} className="space-y-6">
                <div className="flex gap-2 border-b border-slate-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab("ROS")}
                        className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                        activeTab === "ROS"
                            ? "border-teal-700 text-teal-700"
                            : "border-transparent text-slate-500 hover:text-teal-700"
                        }`}
                    >
                        Review of Systems (ROS)
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("SOAP")}
                        className={`border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                        activeTab === "SOAP"
                            ? "border-teal-700 text-teal-700"
                            : "border-transparent text-slate-500 hover:text-teal-700"
                        }`}
                    >
                        Consultation (SOAP)
                    </button>
                </div>
                {activeTab === "ROS" && (
                    <ROSChecklist
                        value={rosFindings}
                        onChange={setRosFindings}
                    />
                )}

                {activeTab === "SOAP" && (
                <section className="rounded-lg border border-slate-200 bg-white p-6">

                    <h2 className="text-xl font-semibold text-slate-900">
                        Consultation Documentation
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        Record the Doctor&apos;s clinical findings and plan.
                    </p>

                    <div className="mt-6 space-y-5">
                        <div>
                            <label
                                htmlFor="subjective"
                                className="mb-2 block text-sm font-medium"
                            >
                                Subjective Findings *
                            </label>
                            <textarea
                                id="subjective"
                                value={fields.subjective}
                                onChange={(event) =>
                                    updateField(
                                        "subjective",
                                        event.target.value
                                    )
                                }
                                rows={4}
                                className="w-full rounded-md border border-slate-300 p-3"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="objective"
                                className="mb-2 block text-sm font-medium"
                            >
                                Objective Findings *
                            </label>
                            <textarea
                                id="objective"
                                value={fields.objective}
                                onChange={(event) =>
                                    updateField(
                                        "objective",
                                        event.target.value
                                    )
                                }
                                rows={4}
                                className="w-full rounded-md border border-slate-300 p-3"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="assessment"
                                className="mb-2 block text-sm font-medium"
                            >
                                Assessment *
                            </label>
                            <textarea
                                id="assessment"
                                value={fields.assessment}
                                onChange={(event) =>
                                    updateField(
                                        "assessment",
                                        event.target.value
                                    )
                                }
                                rows={4}
                                className="w-full rounded-md border border-slate-300 p-3"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="treatmentPlan"
                                className="mb-2 block text-sm font-medium"
                            >
                                Treatment Plan *
                            </label>
                            <textarea
                                id="treatmentPlan"
                                value={fields.treatmentPlan}
                                onChange={(event) =>
                                    updateField(
                                        "treatmentPlan",
                                        event.target.value
                                    )
                                }
                                rows={4}
                                className="w-full rounded-md border border-slate-300 p-3"
                            />
                        </div>
                    </div>
                </section>
                )}

                {error && (
                    <p role="alert" className="text-sm text-red-700">
                        {error}
                    </p>
                )}

                {activeTab === "SOAP" && (
                    <button
                        type="submit"
                        className="w-full rounded-md bg-teal-700 px-4 py-3
                                font-medium text-white hover:bg-teal-800"
                    >
                        Review &amp; Confirm
                    </button>
                )}
            </form>

            {showConfirmation && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="consultation-review-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                        <h2
                            id="consultation-review-title"
                            className="text-xl font-bold"
                        >
                            Review Doctor Consultation
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Visit ID: {visitId}
                        </p>

                        <div className="mt-5 space-y-4">
                            {ROS_SYSTEMS.map((system) => (
                                <div key={system.value}>
                                    <h3 className="font-semibold">
                                        {system.label}
                                    </h3>

                                    <ul className="ml-5 list-disc text-sm">
                                        {rosFindings
                                            .filter(
                                                (item) =>
                                                    item.body_system ===
                                                    system.value
                                            )
                                            .map((item) => (
                                                <li key={item.finding}>
                                                    {getFindingLabel(
                                                        system.value,
                                                        item.finding
                                                    )}
                                                    {item.finding === "OTHER" &&
                                                        item.other_details &&
                                                        `: ${item.other_details}`}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ))}

                            <hr />

                            <div>
                                <h3 className="font-semibold">Subjective</h3>
                                <p className="whitespace-pre-wrap text-sm">
                                    {fields.subjective}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Objective</h3>
                                <p className="whitespace-pre-wrap text-sm">
                                    {fields.objective}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Assessment</h3>
                                <p className="whitespace-pre-wrap text-sm">
                                    {fields.assessment}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Treatment Plan
                                </h3>
                                <p className="whitespace-pre-wrap text-sm">
                                    {fields.treatmentPlan}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                disabled={isPending}
                                className="rounded-md border border-slate-300 px-4 py-2"
                            >
                                Back to Edit
                            </button>

                            <button
                                type="button"
                                onClick={handleComplete}
                                disabled={isPending}
                                className="rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isPending ? "Completing..." : "Complete Consultation"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
