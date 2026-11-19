import StaffSidebar from "./staff-sidebar";
import StaffHeader from "./staff-header";

type StaffRole = "Doctor" | "NM" | "BHW";

type StaffShellProps = {
    role: StaffRole;
    children: React.ReactNode;
};

export default function StaffShell({
    role,
    children,
}: StaffShellProps) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
            <StaffSidebar role={role} />

            <div className="min-w-0 flex-1">
                <StaffHeader role={role} />

                {children}
            </div>
        </div>
    );
}
