"use client";

import {useState, type ReactNode} from "react";

type PatientHistoryAccordionProps = {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
};

export default function PatientHistoryAccordion({
    title,
    children,
    defaultOpen = false,
}: PatientHistoryAccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <section className="rounded-lg border border-slate-200">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between p-4 text-left font-semibold text-slate-900 hover:bg-slate-50"
            >
                <span>{title}</span>
                <span aria-hidden="true">
                    {isOpen ? "−" : "+"}
                </span>
            </button>

            {isOpen && (
                <div className="border-t border-slate-200 px-4 pb-4">
                    {children}
                </div>
            )}
        </section>
    );
}
