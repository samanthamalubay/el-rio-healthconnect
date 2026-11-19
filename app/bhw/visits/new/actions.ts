"use server";
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

function readRequiredNumber(
  formData: FormData,
  fieldName: string
): number {
  const value = formData.get(fieldName);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }

  return numberValue;
}

function readOptionalNumber(
  formData: FormData,
  fieldName: string
): number | null {
  const value = formData.get(fieldName);

  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} must be a valid number`);
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }

  return numberValue;
}


export async function createVisitAction(formData: FormData) {
  const supabase = await createClient();

  const {
        data: {user},
        error: authError,
        } = await supabase.auth.getUser();

    if (authError || !user) {
    throw new Error("You must be logged in to create a visit.");
    }

  const height = readOptionalNumber(formData, "height");
  const weight = readRequiredNumber(formData, "weight");
  const heartRate = readRequiredNumber(formData, "heartRate");
  const respiratoryRate = readRequiredNumber(formData, "respiratoryRate");
  const temperature = readRequiredNumber(formData, "temperature");
  const systolicBP = readRequiredNumber(formData, "systolicBP");
  const diastolicBP = readRequiredNumber(formData, "diastolicBP");
  const itrId = formData.get("itrId");
    if (typeof itrId !== "string" || !itrId.trim()) {
    throw new Error("Patient ITR ID is missing");
    }

    if (systolicBP <= diastolicBP) {
    throw new Error("Systolic blood pressure must be greater than diastolic blood pressure");
    }

    if (
    !Number.isInteger(heartRate) ||
    !Number.isInteger(respiratoryRate) ||
    !Number.isInteger(systolicBP) ||
    !Number.isInteger(diastolicBP)
    ) {
    throw new Error("Heart rate, respiratory rate, and blood pressure must be whole numbers");
    }

  const {data: visitId, error: visitError} = await supabase.rpc(
    "create_patient_visit",
    {
        p_itr_id: itrId,
        p_height_m: height,
        p_weight_kg: weight,
        p_heart_rate: heartRate,
        p_respiratory_rate: respiratoryRate,
        p_temperature_c: temperature,
        p_systolic_bp: systolicBP,
        p_diastolic_bp: diastolicBP,
    }
    );

    if (visitError) {
    console.error("Visit creation failed:", visitError);
    throw new Error("Unable to create patient visit.");
    }

    console.log("Successfully created visit:", visitId);

    redirect(`/patients/${itrId}/active-visit?created=1`);
}

