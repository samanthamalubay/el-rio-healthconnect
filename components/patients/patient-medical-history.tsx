type Condition = {
    label: string;
    value: boolean | null;
};

type PatientMedicalHistoryProps = {
    pastMedicalConditions: Condition[];
    familyMedicalConditions: Condition[];
    socialHistory: Condition[];

    socialDetails: {
        smoking: string | null;
        alcohol: string | null;
        illicitDrugs: string | null;
    };

    allergies: {
        allergy_id: string;
        allergy_name: string;
    }[];

    additionalConditions: {
        condition: string;
        category: string;
        condition_name: string;
    }[];

    medications: {
        medication_id: string;
        medication_name: string;
        frequency: string;
        dosage: string | null;
    }[];

    previousHistory: {
        history_id: string;
        type: string;
        description: string;
    }[];

    immunizations: {
        history_id: string;
        vaccine_name: string;
        dose_label: string | null;
        date_administered: string | null;
        vaccine_brand: string | null;
        remarks: string | null;
    }[];

    immunizationStatus: {
        noReported: boolean;
        remarks: string | null;
    };
};

export default function PatientMedicalHistory({
    pastMedicalConditions,
    familyMedicalConditions,
    socialHistory,
    socialDetails,
    allergies,
    additionalConditions,
    medications,
    previousHistory,
    immunizations,
    immunizationStatus,
}: PatientMedicalHistoryProps) {
    const formatYesNo = (value: boolean | null) => {
        if (value === null) return "Not recorded";
        return value ? "Yes" : "No";
    };

    return (
        <div className="mt-6 grid grid-cols-1 gap-6">
            <section className="border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Past Medical History
                </h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {pastMedicalConditions.map((condition) => (
                        <p key={condition.label} className="text-slate-800">
                            <span className="font-medium">
                                {condition.label}:
                            </span>{" "}
                            {formatYesNo(condition.value)}
                        </p>
                    ))}
                </div>
            </section>

            <section className="border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Family Medical History
                </h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {familyMedicalConditions.map((condition) => (
                        <p key={condition.label} className="text-slate-800">
                            <span className="font-medium">
                                {condition.label}:
                            </span>{" "}
                            {formatYesNo(condition.value)}
                        </p>
                    ))}
                </div>
            </section>

            <section className="border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Personal / Social History
                </h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {socialHistory.map((item) => (
                        <p key={item.label} className="text-slate-800">
                            <span className="font-medium">
                                {item.label}:
                            </span>{" "}
                            {formatYesNo(item.value)}
                        </p>
                    ))}
                </div>

                {socialDetails.smoking && (
                    <p className="mt-3 text-slate-800">
                        <span className="font-medium">
                            Smoking Details:
                        </span>{" "}
                        {socialDetails.smoking}
                    </p>
                )}

                {socialDetails.alcohol && (
                    <p className="mt-2 text-slate-800">
                        <span className="font-medium">
                            Alcohol Consumption:
                        </span>{" "}
                        {socialDetails.alcohol}
                    </p>
                )}

                {socialDetails.illicitDrugs && (
                    <p className="mt-2 text-slate-800">
                        <span className="font-medium">
                            Illicit Drug Details:
                        </span>{" "}
                        {socialDetails.illicitDrugs}
                    </p>
                )}
            </section>

            <section className="border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Allergies
                </h2>

                {allergies.length > 0 ? (
                    <ul className="mt-4 list-inside list-disc space-y-2 text-slate-800">
                        {allergies.map((allergy) => (
                            <li key={allergy.allergy_id}>
                                {allergy.allergy_name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">
                        No known or reported allergies.
                    </p>
                )}
            </section>

            <section className="border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Additional Medical Conditions
                </h2>

                {additionalConditions.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
                        {additionalConditions.map((item, index) => (
                            <li key={`${item.condition}-${index}`}>
                                {item.category}: {item.condition_name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">
                        No additional conditions recorded.
                    </p>
                )}
            </section>

            <section className="border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Maintenance Medications
                </h2>

                {medications.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
                        {medications.map((item) => (
                            <li key={item.medication_id}>
                                {item.medication_name} — {item.frequency}
                                {item.dosage ? ` (${item.dosage})` : ""}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">
                        No maintenance medications recorded.
                    </p>
                )}
            </section>

            <section className="border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Previous Illnesses and Surgeries
                </h2>

                {previousHistory.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-800">
                        {previousHistory.map((item) => (
                            <li key={item.history_id}>
                                {item.type}: {item.description}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">
                        No previous illnesses or surgeries recorded.
                    </p>
                )}
            </section>

            <section className="border-t border-slate-200 pt-6">
                <h2 className="text-xl font-semibold text-slate-900">
                    Immunization History
                </h2>

                {immunizations.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-3 pl-6 text-slate-800">
                        {immunizations.map((item) => (
                            <li key={item.history_id}>
                                <span className="font-medium">
                                    {item.vaccine_name}
                                </span>
                                {" — "}
                                {item.dose_label || "Dose not recorded"}
                                {item.date_administered
                                    ? ` | ${item.date_administered}`
                                    : " | Date not recorded"}
                                {item.vaccine_brand
                                    ? ` | ${item.vaccine_brand}`
                                    : ""}
                                {item.remarks && (
                                    <p className="mt-1 text-sm text-slate-600">
                                        {item.remarks}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-3 text-slate-600">
                        No immunization entries recorded.
                    </p>
                )}

                <p className="mt-4 text-sm text-slate-600">
                    <span className="font-medium">
                        History Status:
                    </span>{" "}
                    {immunizationStatus.noReported
                        ? "No reported immunization history"
                        : immunizations.length > 0
                          ? "Reported immunization entries listed above"
                          : "No immunization history status recorded"}
                </p>

                {immunizationStatus.remarks && (
                    <p className="mt-2 text-sm text-slate-600">
                        <span className="font-medium">
                            Additional Remarks:
                        </span>{" "}
                        {immunizationStatus.remarks}
                    </p>
                )}
            </section>
        </div>
    );
}
