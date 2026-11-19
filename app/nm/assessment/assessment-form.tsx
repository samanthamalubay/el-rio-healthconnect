"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {completeGeneralAssessment} from "../actions";

type AssessmentFormProps = {
    visitId: string;
};

type AssessmentOutcome =
    | "ENDORSED_TO_DOCTOR"
    | "COMPLETED_WITHOUT_ENDORSEMENT";

export default function AssessmentForm({
    visitId,
}: AssessmentFormProps) {
    const router = useRouter();

    const [chiefComplaint, setChiefComplaint] = useState("");
    const [interviewObservations, setInterviewObservations] = useState("");
    const [outcome, setOutcome] =
        useState<AssessmentOutcome>("ENDORSED_TO_DOCTOR");

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const outcomeLabel =
        outcome === "ENDORSED_TO_DOCTOR"
            ? "Endorse to Doctor"
            : "Complete Without Endorsement";

    function handleReview(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage("");

        if (!chiefComplaint.trim() || !interviewObservations.trim()) {
            setErrorMessage("Please complete all required fields.");
            return;
        }

        setShowConfirmation(true);
    }

    async function handleConfirm() {
        if (isSubmitting) return;

        setIsSubmitting(true);
        setErrorMessage("");

        const formData = new FormData();
        formData.set("visitId", visitId);
        formData.set("chiefComplaint", chiefComplaint.trim());
        formData.set(
            "interviewObservations",
            interviewObservations.trim()
        );
        formData.set("outcome", outcome);

        try {
            await completeGeneralAssessment(formData);

            // The RPC has completed successfully.
            router.replace(
                `/nm/assessment?completed=${outcome}`
            );
            router.refresh();
        } catch (error) {
            console.error("Assessment submission failed:", error);

            setErrorMessage(
                "Unable to complete the assessment. Please try again."
            );
            setShowConfirmation(false);
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold text-slate-900">
                    General Assessment
                </h2>

                <form
                    onSubmit={handleReview}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <label htmlFor="chiefComplaint">
                            Chief Complaint *
                        </label>

                        <textarea
                            id="chiefComplaint"
                            name="chiefComplaint"
                            value={chiefComplaint}
                            onChange={(event) =>
                                setChiefComplaint(event.target.value)
                            }
                            required
                            rows={3}
                            disabled={isSubmitting}
                            className="rounded-md border border-slate-300 p-3"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="interviewObservations">
                            Interview Observations *
                        </label>

                        <textarea
                            id="interviewObservations"
                            name="interviewObservations"
                            value={interviewObservations}
                            onChange={(event) =>
                                setInterviewObservations(event.target.value)
                            }
                            required
                            rows={6}
                            disabled={isSubmitting}
                            className="rounded-md border border-slate-300 p-3"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="outcome">
                            Assessment Outcome *
                        </label>

                        <select
                            id="outcome"
                            name="outcome"
                            value={outcome}
                            onChange={(event) =>
                                setOutcome(
                                    event.target.value as AssessmentOutcome
                                )
                            }
                            disabled={isSubmitting}
                            className="rounded-md border border-slate-300 p-3"
                        >
                            <option value="ENDORSED_TO_DOCTOR">
                                Endorse to Doctor
                            </option>

                            <option value="COMPLETED_WITHOUT_ENDORSEMENT">
                                Complete Without Endorsement
                            </option>
                        </select>
                    </div>

                    {errorMessage && (
                        <p role="alert" className="text-sm text-red-600">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Review & Confirm
                    </button>
                </form>
            </div>

            {/* Confirmation dialog */}
            {showConfirmation && (
                <div
                    role="presentation"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="assessment-confirm-title"
                        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
                    >
                        <h2
                            id="assessment-confirm-title"
                            className="text-xl font-semibold text-slate-900"
                        >
                            Review General Assessment
                        </h2>

                        <p className="mt-2 text-sm text-slate-600">
                            Please review the information before saving.
                        </p>

                        <div className="mt-5 space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    Chief Complaint
                                </p>
                                <p className="mt-1 whitespace-pre-wrap wrap-break-word text-slate-900">
                                    {chiefComplaint}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    Interview Observations
                                </p>
                                <p className="mt-1 whitespace-pre-wrap wrap-break-word text-slate-900">
                                    {interviewObservations}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    Assessment Outcome
                                </p>
                                <p className="mt-1 font-medium text-blue-700">
                                    {outcomeLabel}
                                </p>
                            </div>
                        </div>

                        {errorMessage && (
                            <p role="alert" className="mt-4 text-sm text-red-600">
                                {errorMessage}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                disabled={isSubmitting}
                                className="rounded-md border border-slate-300 px-4 py-2 text-slate-700 disabled:opacity-50"
                            >
                                Back to Edit
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="rounded-md bg-blue-700 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Saving..."
                                    : "Confirm & Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
