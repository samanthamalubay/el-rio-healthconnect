import StaffShell from "@/components/navigation/staff-shell";

export default function NMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffShell role="NM">{children}</StaffShell>;
}
