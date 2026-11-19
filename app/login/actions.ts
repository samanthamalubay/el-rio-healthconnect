"use server";

import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";

export async function login(
  previousState: { error: string } | null,
  formData: FormData
 ) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) {
    return { error: "Invalid email or password." };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();
    return { error: "Unable to verify your account." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

  const allowedRoles = ["NM", "BHW", "Doctor"];

  if (
    profileError ||
    !profile ||
    !allowedRoles.includes(profile.role) ||
    !profile.is_active
  ) {
    await supabase.auth.signOut();

    return {
      error: "Your account is not authorized to access HealthConnect.",
    };
  }

  if (profile.role === "NM") {
    redirect("/nm");
  } else if (profile.role === "Doctor") {
    redirect("/doctor");
  } else if (profile.role === "BHW") {
    redirect("/bhw");
  } else {
    return {
      error: "Your account is not authorized to access HealthConnect.",
    };
  }
}