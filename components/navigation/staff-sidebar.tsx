"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

import {
  LayoutDashboard,
  Users,
  UserRoundPlus,
  ClipboardList,
  ClipboardCheck,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

type StaffRole = "Doctor" | "NM" | "BHW";

type StaffSidebarProps = {
  role: StaffRole;
};

const navigation = {
  Doctor: [
    {
      label: "Consultation Queue",
      href: "/doctor",
      icon: ClipboardList,
    },
    {
      label: "My Consultation",
      href: "/doctor/consultation",
      icon: Stethoscope,
    },
    {
      label: "Patients",
      href: "/patients",
      icon: Users,
    },
  ],
  NM: [
    {
      label: "Assessment Queue",
      href: "/nm",
      icon: ClipboardList,
    },
    {
      label: "My Assessment",
      href: "/nm/assessment",
      icon: ClipboardCheck,
    },
    {
      label: "Patients",
      href: "/patients",
      icon: Users,
    },
  ],
  BHW: [
    {
      label: "Dashboard",
      href: "/bhw",
      icon: LayoutDashboard,
    },
    {
      label: "Patients",
      href: "/patients",
      icon: Users,
    },
    {
      label: "New Patient Registration",
      href: "/bhw/patients/new",
      icon: UserRoundPlus,
    },

  ],
};

export default function StaffSidebar({
  role,
}: StaffSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="w-full shrink-0 border-b border-slate-200 bg-white p-5
                md:sticky md:top-0 md:h-screen md:w-64
                md:self-start md:overflow-y-auto md:border-b-0 md:border-r"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center
                        justify-center rounded-xl bg-teal-700 text-white">
          <HeartPulse className="h-6 w-6" aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            HealthConnect
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {role} Workspace
          </p>
        </div>
      </div>

      <nav aria-label={`${role} navigation`} className="space-y-2">
        {navigation[role].map((item) => {
          const active =
                pathname === item.href ||
                (item.href === "/patients" &&
                  pathname.startsWith("/patients/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-4 py-3
              text-sm font-medium transition-colors ${
                active
                  ? "bg-teal-100 text-teal-800"
                  : "text-slate-700 hover:bg-teal-50 hover:text-teal-700"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
