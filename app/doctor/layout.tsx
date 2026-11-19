import StaffShell from "@/components/navigation/staff-shell";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StaffShell role="Doctor">
            {children}
        </StaffShell>
    );
}
