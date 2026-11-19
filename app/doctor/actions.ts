"use server";

import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

export async function startConsultation(formData: FormData) {
    const supabase = await createClient();

    // To verify if user is authenticated and able to start consultation
    const {
        data: {user},
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("You must be logged in.");
    }

    // Verify the user is an active Doctor
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
        throw new Error(
            "You are not authorized to start Doctor consultations."
        );
    }

    // Retrieve and validate visit ID
    const visitId = formData.get("visitId");

    if (typeof visitId !== "string" || !visitId.trim()) {
        throw new Error("Invalid visit ID.");
    }

    // Claim the consultation through secured RPC
    const {data: claimedVisitId, error: consultationError} =
        await supabase.rpc("claim_doctor_consultation", {
            p_visit_id: visitId,
        });

    if (consultationError) {
        console.error(
            "Failed to start Doctor consultation:",
            consultationError
        );

        throw new Error("Unable to start Doctor consultation.");
    }

    if (!claimedVisitId) {
        throw new Error("No consultation visit was returned.");
    }

    // Redirect to consultation page after successful claim
    redirect("/doctor/consultation");
}
