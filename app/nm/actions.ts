"use server";

import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

async function requireAuthorizedNM(
    supabase: Awaited<ReturnType<typeof createClient>>
) {
    const {
        data: {user},
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("You must be logged in.");
    }

    const { data: profile, error: profileError } = await supabase
        .from("staff_profiles")
        .select("role, is_active")
        .eq("user_id", user.id)
        .single();

    if (
        profileError ||
        !profile ||
        profile.role !== "NM" ||
        !profile.is_active
    ) {
        throw new Error(
            "You are not authorized to perform NM assessments."
        );
    }

    return user;
}

export async function startAssessment(formData: FormData) {
    const supabase = await createClient();

    await requireAuthorizedNM(supabase);

    const visitId = formData.get("visitId");
    if (typeof visitId !== "string" || !visitId.trim()) {
    throw new Error("Invalid visit ID.");
    }

    const {data: assessment, error: assessmentError} = await supabase.rpc(
        "claim_nm_assessment", 
        {p_visit_id: visitId});
        
        if (assessmentError) {
        console.error("Failed to start patient assessment.", assessmentError);
        throw new Error("Unable to start patient assessment.");
        }

        console.log("Successfully started patient assessment", assessment);

        // Navigate to the claimed assessment
        redirect("/nm/assessment");
}



export async function completeGeneralAssessment(formData: FormData) {
    const supabase = await createClient();

    //Verify if the user is authenticated
    await requireAuthorizedNM(supabase);

    //Retrieve form values
    const visitId = formData.get("visitId");
    const chiefComplaint = formData.get("chiefComplaint");
    const interviewObservations = formData.get("interviewObservations");
    const outcome = formData.get("outcome");

    //Validate the submitted values
    if (
        typeof visitId !== "string" ||
        !visitId.trim() ||
        typeof chiefComplaint !== "string" ||
        !chiefComplaint.trim() ||
        typeof interviewObservations !== "string" ||
        !interviewObservations.trim() ||
        (outcome !== "ENDORSED_TO_DOCTOR" &&
         outcome !== "COMPLETED_WITHOUT_ENDORSEMENT")
    ) {
        throw new Error("Please complete all required assessment fields.");
    }

    //Submit the assessment through RPC
    const { data: assessmentId, error: assessmentError } =
        await supabase.rpc("complete_general_assessment", {
            p_visit_id: visitId,
            p_chief_complaint: chiefComplaint.trim(),
            p_interview_observations: interviewObservations.trim(),
            p_outcome: outcome,
        });

    if (assessmentError) {
        console.error("Failed to complete general assessment.", assessmentError);
        throw new Error("Unable to complete general assessment.");
    }

    console.log("Successfully completed assessment:", assessmentId);

    return assessmentId;
}