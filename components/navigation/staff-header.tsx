import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ProfileMenu from "./profile-menu";

type StaffHeaderProps = {
    role: "Doctor" | "NM" | "BHW";
};

export default async function StaffHeader({
    role,
}: StaffHeaderProps) {
    const supabase = await createClient();

    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    const {data: profile, error: profileError} = await supabase
        .from("staff_profiles")
        .select("full_name, role, is_active")
        .eq("user_id", user.id)
        .single();

    if (
        profileError ||
        !profile ||
        !profile.is_active ||
        profile.role !== role
    ) {
        redirect("/unauthorized");
    }

    return (
        <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
            <p className="text-sm font-medium text-slate-600">
                {role} Workspace
            </p>

            <ProfileMenu
                name={profile.full_name || "Staff Member"}
                role={profile.role}
            />
        </header>
    );
}
