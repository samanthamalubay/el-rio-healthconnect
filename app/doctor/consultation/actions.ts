"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";

type ROSFinding = {
    body_system: string;
    finding: string;
    other_details?: string;
};

type CompleteConsultationInput = {
    visitId: string;
    subjective: string;
    objective: string;
    assessment: string;
    treatmentPlan: string;
    rosFindings: ROSFinding[];
};

export async function completeDoctorConsultation(
    input: CompleteConsultationInput
) {
    const supabase = await createClient();

    const {
        data: {user},
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("You must be signed in to complete a consultation.");
    }

    const { data: profile, error: profileError } = await supabase
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
        throw new Error("Only an active Doctor can complete consultations.");
    }

    const { data: consultationId, error: consultationError } =
        await supabase.rpc("complete_doctor_consultation", {
            p_visit_id: input.visitId,
            p_subjective_findings: input.subjective.trim(),
            p_objective_findings: input.objective.trim(),
            p_assessment: input.assessment.trim(),
            p_treatment_plan: input.treatmentPlan.trim(),
            p_ros_findings: input.rosFindings,
        });

    if (consultationError) {
        console.error(
            "Failed to complete Doctor consultation:",
            consultationError
        );

        throw new Error(
            "Unable to complete the consultation. Please try again."
        );
    }

    if (!consultationId) {
        throw new Error("Consultation completion was not confirmed.");
    }

    revalidatePath("/doctor");
    revalidatePath("/doctor/consultation");

    redirect("/doctor?success=consultation");
}
