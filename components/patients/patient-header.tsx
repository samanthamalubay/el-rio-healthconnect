type PatientHeaderProps = {
  visit: {
    visit_id: string;
    status: string;
  };
  patient: {
    first_name: string;
    last_name: string;
  };
  vitals: {
    height_m: number | null;
    weight_kg: number;
    heart_rate: number;
    respiratory_rate: number;
    temperature_c: number;
    systolic_bp: number;
    diastolic_bp: number;
  };
  title: string;
  subtitle: string;
};

export default function PatientHeader({
  visit,
  patient,
  vitals,
  title,
  subtitle,
}: PatientHeaderProps) {
  const vitalSigns = [
    {
      label: "Blood Pressure",
      value: `${vitals.systolic_bp}/${vitals.diastolic_bp} mmHg`,
    },
    {
      label: "Heart Rate",
      value: `${vitals.heart_rate} bpm`,
    },
    {
      label: "Respiratory Rate",
      value: `${vitals.respiratory_rate} breaths/min`,
    },
    {
      label: "Temperature",
      value: `${vitals.temperature_c} °C`,
    },
    {
      label: "Height",
      value:
        vitals.height_m !== null
          ? `${vitals.height_m} m`
          : "Not recorded",
    },
    {
      label: "Weight",
      value: `${vitals.weight_kg} kg`,
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Consultation or assessment heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>

          <p className="mt-3 text-lg font-semibold text-teal-800">
            {patient.first_name} {patient.last_name}
          </p>
        </div>

        <span className="self-start rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
          {visit.status.replaceAll("_", " ")}
        </span>
      </div>

      {/* Visit identifier */}
      <p className="mt-3 break-all text-xs text-slate-500">
        Visit ID: {visit.visit_id}
      </p>

      <div className="my-5 border-t border-slate-200" />

      {/* Vital signs */}
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Vital Signs
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {vitalSigns.map((vital) => (
          <div
            key={vital.label}
            className="rounded-lg border border-slate-100 bg-slate-50 p-3"
          >
            <p className="text-xs font-medium text-slate-500">
              {vital.label}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              {vital.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}