import {redirect, notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {createVisitAction} from "./actions";
import Link from "next/link";

export const instant = false;

type NewVisitPageProps = {
  searchParams: Promise<{ itrId?: string }>;
};

export default async function NewVisitPage({
  searchParams,
}: NewVisitPageProps) {

    const supabase = await createClient();

    // Verify the authenticated user.
    const {
        data: {user},
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    // To verify if user is *AUTHORIZED to access Patient search feature
    const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

    const allowedRoles = ["BHW"];

    if (
        profileError ||
        !profile ||
        !allowedRoles.includes(profile.role) ||
        !profile.is_active
    ) {
        redirect("/unauthorized");
    }

    //
    
    const {itrId} = await searchParams;

    if (!itrId) {
    redirect("/patients");
    }

    const { data: patient, error: patientError } = await supabase
        .from("individual_treatment_records")
        .select("itr_id, first_name, last_name, date_of_birth")
        .eq("itr_id", itrId)
        .maybeSingle();

    if (patientError) {
        throw new Error("Unable to retrieve patient information.");
    }

    if (!patient) {
        notFound();
    }

    const inputStyle = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900";
    const labelStyle = "block text-sm font-medium text-slate-700";

    const today = new Date();
    const birthDate = new Date(`${patient.date_of_birth}T00:00:00`);

    let age = today.getFullYear() - birthDate.getFullYear();

    const birthdayThisYear = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
    );

    if (today < birthdayThisYear) {
    age--;
    }

    const heightRequired = age < 6;

    //RETURN START
    return(
         <main>
            <div className="mx-auto max-w-5xl p-8">
                <Link
                    href={`/patients/${itrId}`}
                    className="text-sm font-medium text-blue-700 hover:underline"
                    >
                    ← Back to ITR
                </Link>
                <h1 className="text-2xl font-bold p-5 text-slate-900">
                    New Visit Page
                </h1>

                {/* START OF FORM */} 

               <p className="text-2xl p-5 font-semibold text-slate-900">
                    {patient.first_name} {patient.last_name}
                </p>

                {/* Vital Signs */}

                <form action={createVisitAction}>
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Record Vital Signs
                        </h2>
                        
                        {/* Getting ITR ID */}
                        <input
                        type="hidden"
                        name="itrId"
                        value={patient.itr_id}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Height */}
                        <div className="mt-5">
                                <label htmlFor="height" className={labelStyle}>
                                Height (m)
                                </label>
                                <input
                                id="height"
                                name="height"
                                type="number"
                                step="0.01"
                                min="0.01"
                                required={heightRequired}
                                className={inputStyle}
                                />
                        </div>

                        {/* Weight */}
                        <div className="mt-5">
                                <label htmlFor="weight" className={labelStyle}>
                                Weight (kg)
                                </label>
                                <input
                                id="weight"
                                name="weight"
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                className={inputStyle}
                                />
                        </div>

                        {/* heartRate */}
                        <div className="mt-5">
                                <label htmlFor="heartRate" className={labelStyle}>
                                Heart Rate (BPM)
                                </label>
                                <input
                                id="heartRate"
                                name="heartRate"
                                type="number"
                                step="1"
                                min="1"
                                required
                                className={inputStyle}
                                />
                        </div>

                        {/* Respiratory Rate (BPM) */}
                        <div className="mt-5">
                                <label htmlFor="respiratoryRate" className={labelStyle}>
                                Respiratory Rate (BPM)
                                </label>
                                <input
                                id="respiratoryRate"
                                name="respiratoryRate"
                                type="number"
                                step="1"
                                min="1"
                                required
                                className={inputStyle}
                                />
                        </div>

                        {/* Temperature (°C) */}
                        <div className="mt-5">
                                <label htmlFor="temperature" className={labelStyle}>
                                Temperature (°C)
                                </label>
                                <input
                                id="temperature"
                                name="temperature"
                                type="number"
                                step="0.1"
                                min="0.1"
                                required
                                className={inputStyle}
                                />
                        </div>

                        {/* Systolic BP (mmHg) */}
                        <div className="mt-5">
                                <label htmlFor="systolicBP" className={labelStyle}>
                                Systolic BP (mmHg)
                                </label>
                                <input
                                id="systolicBP"
                                name="systolicBP"
                                type="number"
                                step="1"
                                min="1"
                                required
                                className={inputStyle}
                                />
                        </div>

                        {/* Diastolic BP (mmHg) */}
                        <div className="mt-5">
                                <label htmlFor="diastolicBP" className={labelStyle}>
                                Diastolic BP (mmHg)
                                </label>
                                <input
                                id="diastolicBP"
                                name="diastolicBP"
                                type="number"
                                step="1"
                                min="1"
                                required
                                className={inputStyle}
                                />
                        </div>
                        </div>

                        <button type="submit" className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Submit Vital Signs
                        </button>

                    </div>
                </form> 

            </div>
        </main>
    )
}