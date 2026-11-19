"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NMNavigation() {
    const pathname = usePathname();

    const assessmentQueue = `/nm`;
    const claimedassessment = `/nm/assessment`;

    return (
        <nav className="flex flex-col gap-2">
            <Link href={`/nm`} 
            className={
                        pathname === assessmentQueue
                            ? "block rounded-md bg-blue-200 px-3 py-2 font-semibold"
                            : "block rounded-md px-3 py-2 hover:bg-slate-300"
                        }
            >
                    Assessment Queue
            </Link>
            <Link href={`/nm/assessment`} 
            className={
                        pathname === claimedassessment
                            ? "block rounded-md bg-blue-200 px-3 py-2 font-semibold"
                            : "block rounded-md px-3 py-2 hover:bg-slate-300"
                        }
            >
                    Current Assessment
            </Link>
        </nav>
    );
}