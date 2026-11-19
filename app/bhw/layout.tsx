import StaffShell from "@/components/navigation/staff-shell";

export default function BHWLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StaffShell role="BHW">
            {children}
        </StaffShell>
    );
}
