
type PatientInformationProps = {
    patient: {
        first_name: string;
        last_name: string;
        middle_initial: string | null;
        date_of_birth: string;
        sex: string;
        house_street_address: string;
        barangay: string;
        city: string;
        contact_number: string | null;

        religion: string | null;
        civil_status: string | null;
        educational_attainment: string | null;
        occupation: string | null;

        spouse_maiden_name: string | null;
        spouse_occupation: string | null;
        spouse_contact_number: string | null;

        guardian_name: string | null;
        guardian_relationship: string | null;

        emergency_contact_name: string | null;
        emergency_contact_relationship: string | null;
        emergency_contact_number: string | null;
    };
};

export default function PatientInformation({patient,}: PatientInformationProps) {
    const displayValue = (value: string | null) =>
        value?.trim() || "Not recorded";

    const hasSpouseInformation = Boolean(
        patient.spouse_maiden_name ||
        patient.spouse_occupation ||
        patient.spouse_contact_number
    );

    const hasGuardianInformation = Boolean(
        patient.guardian_name ||
        patient.guardian_relationship
    );

    const hasEmergencyContact = Boolean(
        patient.emergency_contact_name ||
        patient.emergency_contact_relationship ||
        patient.emergency_contact_number
    );

    return (
        <div className="mt-6 space-y-6">
            {/* Patient details */}
            <section>
                <h2 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
                    Patient Details
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <InfoField
                        label="Patient Name"
                        value={[
                            patient.first_name,
                            patient.middle_initial,
                            patient.last_name,
                        ].filter(Boolean).join(" ")}
                    />

                    <InfoField
                        label="Date of Birth"
                        value={patient.date_of_birth}
                    />

                    <InfoField label="Sex" value={patient.sex} />

                    <InfoField
                        label="Contact Number"
                        value={displayValue(patient.contact_number)}
                    />

                    <InfoField
                        label="Religion"
                        value={displayValue(patient.religion)}
                    />

                    <InfoField
                        label="Civil Status"
                        value={displayValue(patient.civil_status)}
                    />

                    <InfoField
                        label="Educational Attainment"
                        value={displayValue(patient.educational_attainment)}
                    />

                    <InfoField
                        label="Occupation"
                        value={displayValue(patient.occupation)}
                    />

                    <div className="sm:col-span-2">
                        <InfoField
                            label="Address"
                            value={`${patient.house_street_address}, ${patient.barangay}, ${patient.city}`}
                        />
                    </div>
                </div>
            </section>

            {/* Spouse information */}
            {hasSpouseInformation && (
                <section>
                    <h2 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
                        Spouse Information
                    </h2>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <InfoField
                            label="Spouse Maiden Name"
                            value={displayValue(patient.spouse_maiden_name)}
                        />

                        <InfoField
                            label="Spouse Occupation"
                            value={displayValue(patient.spouse_occupation)}
                        />

                        <InfoField
                            label="Spouse Contact Number"
                            value={displayValue(patient.spouse_contact_number)}
                        />
                    </div>
                </section>
            )}

            {/* Guardian information */}
            {hasGuardianInformation && (
                <section>
                    <h2 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
                        Guardian Information
                    </h2>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <InfoField
                            label="Guardian Name"
                            value={displayValue(patient.guardian_name)}
                        />

                        <InfoField
                            label="Relationship"
                            value={displayValue(patient.guardian_relationship)}
                        />
                    </div>
                </section>
            )}

            {/* Emergency contact */}
            {hasEmergencyContact && (
                <section>
                    <h2 className="border-b border-slate-200 pb-2 text-lg font-semibold text-slate-900">
                        Emergency Contact
                    </h2>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <InfoField
                            label="Contact Name"
                            value={displayValue(patient.emergency_contact_name)}
                        />

                        <InfoField
                            label="Relationship"
                            value={displayValue(patient.emergency_contact_relationship)}
                        />

                        <InfoField
                            label="Contact Number"
                            value={displayValue(patient.emergency_contact_number)}
                        />
                    </div>
                </section>
            )}
        </div>
    );
}

function InfoField({label, value,}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="wrap-break-word font-medium text-slate-900">
                {value}
            </p>
        </div>
    );
}
