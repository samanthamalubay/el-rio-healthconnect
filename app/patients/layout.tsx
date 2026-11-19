import {redirect} from "next/navigation";
import type {ReactNode} from "react";
import {createClient} from "@/lib/supabase/server";
import StaffShell from "@/components/navigation/staff-shell";

type StaffRole = "Doctor" | "NM" | "BHW";

export default async function PatientsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: {user},
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    !profile.is_active ||
    !["Doctor", "NM", "BHW"].includes(profile.role)
  ) {
    redirect("/unauthorized");
  }

  const role = profile.role as StaffRole;

  return <StaffShell role={role}>{children}</StaffShell>;
}
