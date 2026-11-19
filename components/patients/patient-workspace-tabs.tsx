"use client";

import {useState, type ReactNode} from "react";

type PatientWorkspaceTabsProps = {
    itrContent: ReactNode;
    visitHistoryContent: ReactNode;
    specialRecordsContent: ReactNode;
};

type Tab = "itr" | "visits" | "special";

export default function PatientWorkspaceTabs({
    itrContent,
    visitHistoryContent,
    specialRecordsContent,
}: PatientWorkspaceTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>("itr");

    const tabs: { id: Tab; label: string }[] = [
        {id: "itr", label: "Patient Information & History"},
        {id: "visits", label: "Visit History"},
        {id: "special", label: "Special Records"},
    ];

    return (
        <div className="mt-6">
            {/* Tab navigation */}
            <div
                role="tablist"
                aria-label="Patient records"
                className="flex flex-wrap gap-2 border-b border-slate-200 pb-3"
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        id={`tab-${tab.id}`}
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? "bg-blue-700 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="mt-6">
                <div
                    id="panel-itr"
                    role="tabpanel"
                    aria-labelledby="tab-itr"
                    hidden={activeTab !== "itr"}
                >
                    {itrContent}
                </div>

                <div
                    id="panel-visits"
                    role="tabpanel"
                    aria-labelledby="tab-visits"
                    hidden={activeTab !== "visits"}
                >
                    {visitHistoryContent}
                </div>

                <div
                    id="panel-special"
                    role="tabpanel"
                    aria-labelledby="tab-special"
                    hidden={activeTab !== "special"}
                >
                    {specialRecordsContent}
                </div>
            </div>
        </div>
    );
}
