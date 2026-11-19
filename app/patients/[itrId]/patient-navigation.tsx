"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

type PatientNavigationProps = {
  itrId: string;
};

export default function PatientNavigation({
  itrId,
}: PatientNavigationProps) {
  const pathname = usePathname();

  const itrPath = `/patients/${itrId}`;
  const activeVisitPath = `${itrPath}/active-visit`;

  return (
    <nav className="flex flex-row flex-wrap gap-3">
      <Link href={`/patients/${itrId}`} 
      className={
                pathname === itrPath
                    ? "block rounded-md bg-blue-200 px-3 py-2 font-semibold"
                    : "block rounded-md px-3 py-2 hover:bg-slate-300"
                }
      >
            ITR
      </Link>
      <Link href={`/patients/${itrId}/active-visit`} 
      className={
                pathname === activeVisitPath
                    ? "block rounded-md bg-blue-200 px-3 py-2 font-semibold"
                    : "block rounded-md px-3 py-2 hover:bg-slate-300"
                }
      >
            Active Visit
          </Link>
    </nav>
  );
}