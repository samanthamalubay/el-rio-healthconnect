"use client";

export type ROSFinding = {
    body_system: string;
    finding: string;
    other_details?: string;
};

type ROSChecklistProps = {
    value: ROSFinding[];
    onChange: (findings: ROSFinding[]) => void;
};

type ROSOption = {
    value: string;
    label: string;
};

type ROSSystem = {
    value: string;
    label: string;
    options: ROSOption[];
};

export const ROS_SYSTEMS: ROSSystem[] = [
    {
        value: "HEENT",
        label: "SHEENT",
        options: [
            {value: "DRY_FLAKY_SKIN", label: "Dry, flaky skin"},
            {value: "PALLOR_CYANOSIS", label: "Pallor / Cyanosis"},
            {value: "DANDRUFF", label: "Dandruff"},
            {value: "ICTERIC_SCLERAE", label: "Icteric sclerae"},
            {value: "PALE_CONJUNCTIVAE", label: "Pale conjunctivae"},
            {value: "CATARACT", label: "Cataract"},
            {value: "POOR_VISION", label: "Poor vision"},
            {value: "DEAFNESS", label: "Deafness"},
            {value: "EAR_DISCHARGES", label: "Ear discharges"},
            {value: "NASAL_CONGESTION", label: "Nasal congestion"},
            {value: "LYMPHADENOPATHY", label: "Lymphadenopathy"},
            {value: "DENTAL_CARIES", label: "Dental caries"},
            {value: "NECK_MASS", label: "Neck mass"},
        ],
    },
    {
        value: "CHEST_BREASTS_LUNGS",
        label: "Chest, Breasts, Lungs",
        options: [
            {value: "ASYMMETRICAL_EXPANSION", label: "Asymmetrical expansion"},
            {value: "CHEST_RETRACTION", label: "Chest retraction"},
            {value: "BREAST_DISCHARGES_LUMP", label: "Breast discharges / lump"},
            {value: "CRACKLES_RALES_WHEEZES", label: "Crackles / Rales / Wheezes"},
        ],
    },
    {
        value: "HEART",
        label: "Heart",
        options: [
            {value: "PERICARDIAL_BULGE", label: "Pericardial bulge"},
            {value: "CHEST_PAIN", label: "Chest pain"},
            {value: "PALPITATIONS", label: "Palpitations"},
            {value: "ORTHOPNEA", label: "Orthopnea"},
        ],
    },
    {
        value: "ABDOMEN",
        label: "Abdomen",
        options: [
            {value: "BLOODY_STOOL", label: "Bloody stool"},
            {value: "NAUSEA", label: "Nausea"},
            {value: "CONSTIPATION", label: "Constipation"},
            {value: "ANOREXIA", label: "Anorexia"},
        ],
    },
    {
        value: "GENITOURINARY",
        label: "Genitourinary",
        options: [
            {value: "FREQUENCY_URGENCY", label: "Frequency / Urgency"},
            {value: "DYSURIA_POLYURIA", label: "Dysuria / Polyuria"},
            {value: "ABNORMAL_DISCHARGE", label: "Abnormal discharge"},
            {value: "BLOODY_DISCHARGE", label: "Bloody discharge"},
        ],
    },
    {
        value: "EXTREMITIES",
        label: "Extremities",
        options: [
            {value: "NAIL_CLUBBING", label: "Nail clubbing"},
            {value: "BACK_JOINT_PAIN", label: "Back / Joint pain"},
            {value: "JOINT_SWELLING", label: "Joint swelling"},
            {value: "LYMPHEDEMA", label: "Lymphedema"},
        ],
    },
    {
        value: "NEUROLOGICAL",
        label: "Neurological",
        options: [
            {value: "ABNORMAL_GAIT", label: "Abnormal gait"},
            {value: "TREMOR_SEIZURE", label: "Tremor / Seizure"},
            {value: "NUMBNESS_WEAKNESS", label: "Numbness / Weakness"},
            {value: "ANXIETY_DEPRESSION", label: "Anxiety / Depression"},
        ],
    },
];

export function validateROS(findings: ROSFinding[]): string | null {
    for (const system of ROS_SYSTEMS) {
        const selected = findings.filter(
            (finding) => finding.body_system === system.value
        );

        if (selected.length === 0) {
            return `Please assess ${system.label}.`;
        }

        const hasNormal = selected.some(
            (finding) => finding.finding === "ESSENTIALLY_NORMAL"
        );

        if (hasNormal && selected.length > 1) {
            return `${system.label}: Essentially Normal cannot be combined with other findings.`;
        }

        const other = selected.find(
            (finding) => finding.finding === "OTHER"
        );

        if (other && !other.other_details?.trim()) {
            return `Please specify the other finding for ${system.label}.`;
        }

        const allowed = new Set([
            "ESSENTIALLY_NORMAL",
            "OTHER",
            ...system.options.map((option) => option.value),
        ]);

        if (selected.some((finding) => !allowed.has(finding.finding))) {
            return `Invalid finding selected for ${system.label}.`;
        }
    }

    return null;
}

export default function ROSChecklist({
    value,
    onChange,
}: ROSChecklistProps) {
    function toggleFinding(bodySystem: string, finding: string) {
        const existing = value.some(
            (item) =>
                item.body_system === bodySystem &&
                item.finding === finding
        );

        if (existing) {
            onChange(
                value.filter(
                    (item) =>
                        !(
                            item.body_system === bodySystem &&
                            item.finding === finding
                        )
                )
            );
            return;
        }

        if (finding === "ESSENTIALLY_NORMAL") {
            onChange([
                ...value.filter(
                    (item) => item.body_system !== bodySystem
                ),
                {
                    body_system: bodySystem,
                    finding: "ESSENTIALLY_NORMAL",
                },
            ]);
            return;
        }

        onChange([
            ...value.filter(
                (item) =>
                    !(
                        item.body_system === bodySystem &&
                        item.finding === "ESSENTIALLY_NORMAL"
                    )
            ),
            {
                body_system: bodySystem,
                finding,
                ...(finding === "OTHER" ? { other_details: "" } : {}),
            },
        ]);
    }

    function updateOtherDetails(bodySystem: string, details: string) {
        onChange(
            value.map((item) =>
                item.body_system === bodySystem &&
                item.finding === "OTHER"
                    ? { ...item, other_details: details }
                    : item
            )
        );
    }

    return (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-900">
                Review of Systems (ROS)
            </h2>

            <p className="mt-2 text-sm text-slate-600">
                Select Essentially Normal or at least one finding
                for each body system.
            </p>

            <div className="mt-6 space-y-6">
                {ROS_SYSTEMS.map((system) => {
                    const selected = value.filter(
                        (item) => item.body_system === system.value
                    );

                    const other = selected.find(
                        (item) => item.finding === "OTHER"
                    );

                    return (
                        <fieldset
                            key={system.value}
                            className="rounded-md border border-slate-200 p-4"
                        >
                            <legend className="px-2 font-semibold text-slate-900">
                                {system.label}
                            </legend>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.some(
                                            (item) =>
                                                item.finding ===
                                                "ESSENTIALLY_NORMAL"
                                        )}
                                        onChange={() =>
                                            toggleFinding(
                                                system.value,
                                                "ESSENTIALLY_NORMAL"
                                            )
                                        }
                                    />
                                    Essentially Normal
                                </label>

                                {system.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected.some(
                                                (item) =>
                                                    item.finding === option.value
                                            )}
                                            onChange={() =>
                                                toggleFinding(
                                                    system.value,
                                                    option.value
                                                )
                                            }
                                        />
                                        {option.label}
                                    </label>
                                ))}

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(other)}
                                        onChange={() =>
                                            toggleFinding(system.value, "OTHER")
                                        }
                                    />
                                    Others, specify
                                </label>

                                {other && (
                                    <input
                                        type="text"
                                        value={other.other_details ?? ""}
                                        onChange={(event) =>
                                            updateOtherDetails(
                                                system.value,
                                                event.target.value
                                            )
                                        }
                                        placeholder="Specify finding"
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                    />
                                )}

                                {selected.length === 0 && (
                                    <p className="text-xs text-amber-700">
                                        This body system has not been assessed.
                                    </p>
                                )}
                            </div>
                        </fieldset>
                    );
                })}
            </div>
        </section>
    );
}
