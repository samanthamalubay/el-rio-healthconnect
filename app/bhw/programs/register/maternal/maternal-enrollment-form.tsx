"use client";

import { useState } from "react";

type EnrollmentReason = "pregnant" | "delivered" | "";

type ConfirmationMethod =
  | "pregnancy-test"
  | "clinical-record"
  | "other"
  | "";

export default function MaternalEnrollmentForm() {
  const [enrollmentReason, setEnrollmentReason] =
    useState<EnrollmentReason>("");

  const [confirmationMethod, setConfirmationMethod] =
    useState<ConfirmationMethod>("");

  const [confirmationRemarks, setConfirmationRemarks] =
    useState("");

    // OB-GYN history
    const [obgynHistory, setObgynHistory] = useState({
    gravida: "",
    para: "",
    fullTerm: "",
    preterm: "",
    abortions: "",
    livingChildren: "",
    menarcheAge: "",
    menstrualCycle: "",
    remarks: "",
    });

    function updateObgynField(
    field: keyof typeof obgynHistory,
    value: string
    ) {
    setObgynHistory((previous) => ({
        ...previous,
        [field]: value,
    }));
    }

    // Pregnancy-specific information
    const [pregnancyInfo, setPregnancyInfo] = useState({
    lastMenstrualPeriod: "",
    expectedDeliveryDate: "",
    plannedDeliveryPlace: "",
    });

    // Delivery-specific information
    const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryDate: "",
    deliveryPlace: "",
    deliveryType: "",
    pregnancyOutcome: "",
    });

    function updatePregnancyField(
    field: keyof typeof pregnancyInfo,
    value: string
    ) {
    setPregnancyInfo((previous) => ({
        ...previous,
        [field]: value,
    }));
    }

    function updateDeliveryField(
    field: keyof typeof deliveryInfo,
    value: string
    ) {
    setDeliveryInfo((previous) => ({
        ...previous,
        [field]: value,
    }));
    }

    type RecordCheckResult =
  | "none"
  | "same-pregnancy"
  | "different-pregnancy";

    const [recordCheckResult, setRecordCheckResult] =
    useState<RecordCheckResult>("none");

    const [differentPregnancyConfirmed, setDifferentPregnancyConfirmed] =
    useState(false);


    type EnrollmentStage = "form" | "review" | "complete";

    const [enrollmentStage, setEnrollmentStage] =
    useState<EnrollmentStage>("form");

    const [validationErrors, setValidationErrors] =
    useState<string[]>([]);

    function validateEnrollment(): string[] {
    const errors: string[] = [];

    if (!enrollmentReason) {
        errors.push("Select an enrollment reason.");
    }

    if (enrollmentReason === "pregnant") {
        if (!confirmationMethod) {
        errors.push("Select a pregnancy confirmation method.");
        }

        if (
        !pregnancyInfo.lastMenstrualPeriod &&
        !pregnancyInfo.expectedDeliveryDate
        ) {
        errors.push(
            "Provide an LMP or expected delivery date for pregnancy identification."
        );
        }

        if (
        pregnancyInfo.lastMenstrualPeriod &&
        pregnancyInfo.expectedDeliveryDate &&
        pregnancyInfo.expectedDeliveryDate <=
            pregnancyInfo.lastMenstrualPeriod
        ) {
        errors.push("EDD must be later than LMP.");
        }

        if (
        pregnancyInfo.lastMenstrualPeriod &&
        pregnancyInfo.lastMenstrualPeriod >
            new Date().toISOString().slice(0, 10)
        ) {
        errors.push("LMP cannot be in the future.");
        }
    }

    if (enrollmentReason === "delivered") {
        if (!deliveryInfo.deliveryDate) {
        errors.push("Enter the delivery date.");
        }

        if (
        deliveryInfo.deliveryDate &&
        deliveryInfo.deliveryDate >
            new Date().toISOString().slice(0, 10)
        ) {
        errors.push("Delivery date cannot be in the future.");
        }

        if (!deliveryInfo.deliveryType) {
        errors.push("Select the delivery type.");
        }

        if (!deliveryInfo.pregnancyOutcome.trim()) {
        errors.push("Enter the documented pregnancy outcome.");
        }
    }

    // Validate any obstetric counts that were provided.
    const countFields = [
        ["Gravida", obgynHistory.gravida],
        ["Para", obgynHistory.para],
        ["Full-term deliveries", obgynHistory.fullTerm],
        ["Preterm deliveries", obgynHistory.preterm],
        ["Abortions", obgynHistory.abortions],
        ["Living children", obgynHistory.livingChildren],
    ] as const;

    for (const [label, value] of countFields) {
        if (
        value !== "" &&
        (!Number.isSafeInteger(Number(value)) || Number(value) < 0)
        ) {
        errors.push(`${label} must be a nonnegative whole number.`);
        }
    }

    if (
        obgynHistory.fullTerm !== "" &&
        obgynHistory.preterm !== "" &&
        obgynHistory.para !== "" &&
        Number(obgynHistory.fullTerm) +
        Number(obgynHistory.preterm) !==
        Number(obgynHistory.para)
    ) {
        errors.push(
        "Para should equal full-term plus preterm deliveries. Verify the recorded history."
        );
    }

    if (
        obgynHistory.menarcheAge !== "" &&
        (!Number.isSafeInteger(Number(obgynHistory.menarcheAge)) ||
        Number(obgynHistory.menarcheAge) <= 0)
    ) {
        errors.push("Enter a valid menarche age.");
    }

    if (recordCheckResult === "same-pregnancy") {
        errors.push(
        "Enrollment blocked: an existing maternal record represents this pregnancy."
        );
    }

    if (
        recordCheckResult === "different-pregnancy" &&
        !differentPregnancyConfirmed
    ) {
        errors.push(
        "Confirm that the existing record belongs to a different pregnancy."
        );
    }

    return errors;
    }

    function handleReviewEnrollment() {
    const errors = validateEnrollment();
    setValidationErrors(errors);

    if (errors.length === 0) {
        setEnrollmentStage("review");
    }
    }


const enrollmentReasonLabel =
  enrollmentReason === "pregnant"
    ? "Currently Pregnant"
    : "Already Delivered";

const confirmationLabels: Record<
  Exclude<ConfirmationMethod, "">,
  string
> = {
  "pregnancy-test": "Positive Pregnancy Test",
  "clinical-record": "Existing Clinical Documentation",
  other: "Other Documented Confirmation",
};

const displayValue = (value: string) =>
  value.trim() || "Not provided";

if (enrollmentStage === "complete") {
  return (
    <section className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-green-800">
        Maternal Enrollment Demonstration Completed
      </h2>

      <p className="mt-3 text-slate-700">
        The proposed maternal enrollment transaction has been
        completed successfully in this UI demonstration.
      </p>

      <p className="mt-2 text-sm text-amber-800">
        No maternal record was created or saved to Supabase.
      </p>

      <button
        type="button"
        onClick={() => setEnrollmentStage("review")}
        className="mt-5 rounded-md border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
      >
        Return to Enrollment Review
      </button>
    </section>
  );
}

if (enrollmentStage === "review") {
  return (
    <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Review Maternal Enrollment
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Review the information before completing the
          simulated enrollment.
        </p>
      </div>

      <div className="rounded-lg bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-900">
          Enrollment Information
        </h3>
        <p className="mt-2 text-sm">
          Reason: {enrollmentReasonLabel}
        </p>

        {enrollmentReason === "pregnant" && (
          <>
            <p className="mt-2 text-sm">
              Confirmation:{" "}
              {confirmationMethod
                ? confirmationLabels[confirmationMethod]
                : "Not provided"}
            </p>
            <p className="mt-2 text-sm">
              Remarks: {displayValue(confirmationRemarks)}
            </p>
          </>
        )}
      </div>

      <div className="rounded-lg bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-900">
          OB-GYN History
        </h3>

        <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <p>Gravida: {displayValue(obgynHistory.gravida)}</p>
          <p>Para: {displayValue(obgynHistory.para)}</p>
          <p>Full-term: {displayValue(obgynHistory.fullTerm)}</p>
          <p>Preterm: {displayValue(obgynHistory.preterm)}</p>
          <p>Abortions: {displayValue(obgynHistory.abortions)}</p>
          <p>Living children: {displayValue(obgynHistory.livingChildren)}</p>
          <p>Menarche age: {displayValue(obgynHistory.menarcheAge)}</p>
          <p>Menstrual cycle: {displayValue(obgynHistory.menstrualCycle)}</p>
        </div>

        <p className="mt-3 text-sm">
          Remarks: {displayValue(obgynHistory.remarks)}
        </p>
      </div>

      <div className="rounded-lg bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-900">
          Pregnancy / Delivery Information
        </h3>

        {enrollmentReason === "pregnant" ? (
          <div className="mt-3 space-y-2 text-sm">
            <p>LMP: {displayValue(pregnancyInfo.lastMenstrualPeriod)}</p>
            <p>EDD: {displayValue(pregnancyInfo.expectedDeliveryDate)}</p>
            <p>
              Planned delivery location:{" "}
              {displayValue(pregnancyInfo.plannedDeliveryPlace)}
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-2 text-sm">
            <p>Delivery date: {displayValue(deliveryInfo.deliveryDate)}</p>
            <p>Delivery place: {displayValue(deliveryInfo.deliveryPlace)}</p>
            <p>Delivery type: {displayValue(deliveryInfo.deliveryType)}</p>
            <p>
              Pregnancy outcome:{" "}
              {displayValue(deliveryInfo.pregnancyOutcome)}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        Existing-record check:{" "}
        {recordCheckResult === "none"
          ? "No existing record (simulated)"
          : "Different pregnancy verified (simulated)"}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setEnrollmentStage("form")}
          className="rounded-md border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Enrollment Form
        </button>

        <button
          type="button"
          onClick={() => {
            const errors = validateEnrollment();

            if (errors.length > 0) {
              setValidationErrors(errors);
              setEnrollmentStage("form");
              return;
            }

            setEnrollmentStage("complete");
          }}
          className="rounded-md bg-blue-700 px-5 py-2.5 font-medium text-white hover:bg-blue-800"
        >
          Complete Enrollment (Demo)
        </button>
      </div>
    </section>
  );
}



  return (
    <div className="space-y-6">
      {/* Section 1: Enrollment reason */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          1. Maternal Enrollment Reason
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Identify the reason for establishing a new
          pregnancy-specific maternal record.
        </p>

        <div className="mt-5 space-y-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
            <input
              type="radio"
              name="enrollmentReason"
              value="pregnant"
              checked={enrollmentReason === "pregnant"}
              onChange={() => setEnrollmentReason("pregnant")}
              className="mt-1"
            />

            <span>
              <span className="block font-medium text-slate-900">
                Currently Pregnant
              </span>
              <span className="mt-1 block text-sm text-slate-600">
                Establish a maternal record for an ongoing
                confirmed pregnancy.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
            <input
              type="radio"
              name="enrollmentReason"
              value="delivered"
              checked={enrollmentReason === "delivered"}
              onChange={() => setEnrollmentReason("delivered")}
              className="mt-1"
            />

            <span>
              <span className="block font-medium text-slate-900">
                Already Delivered
              </span>
              <span className="mt-1 block text-sm text-slate-600">
                Establish a maternal record for a previous
                delivery that has not yet been recorded.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Section 2: Pregnancy confirmation */}
      {enrollmentReason === "pregnant" && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Pregnancy Confirmation
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Record how the current pregnancy was confirmed.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="confirmationMethod"
                className="block text-sm font-medium text-slate-700"
              >
                Confirmation Method
              </label>

              <select
                id="confirmationMethod"
                value={confirmationMethod}
                onChange={(event) =>
                  setConfirmationMethod(
                    event.target.value as ConfirmationMethod
                  )
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
              >
                <option value="">
                  Select confirmation method
                </option>
                <option value="pregnancy-test">
                  Positive Pregnancy Test
                </option>
                <option value="clinical-record">
                  Existing Clinical Documentation
                </option>
                <option value="other">
                  Other Documented Confirmation
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="confirmationRemarks"
                className="block text-sm font-medium text-slate-700"
              >
                Confirmation Remarks (Optional)
              </label>

              <textarea
                id="confirmationRemarks"
                value={confirmationRemarks}
                onChange={(event) =>
                  setConfirmationRemarks(event.target.value)
                }
                rows={3}
                placeholder="Enter supporting details..."
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
              />
            </div>
          </div>
        </section>
      )}


        {/* Section 3: OB-GYN history */}
        {enrollmentReason && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
            3. OB-GYN History
            </h2>

            <p className="mt-2 text-sm text-slate-600">
            Record the patient's obstetric and gynecologic history
            based on available information.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
                { key: "gravida", label: "Gravida (G)" },
                { key: "para", label: "Para (P)" },
                { key: "fullTerm", label: "Full-Term Deliveries" },
                { key: "preterm", label: "Preterm Deliveries" },
                { key: "abortions", label: "Abortions" },
                { key: "livingChildren", label: "Living Children" },
            ].map((field) => (
                <div key={field.key}>
                <label
                    htmlFor={field.key}
                    className="block text-sm font-medium text-slate-700"
                >
                    {field.label}
                </label>

                <input
                    id={field.key}
                    type="number"
                    min="0"
                    step="1"
                    value={
                    obgynHistory[
                        field.key as keyof typeof obgynHistory
                    ]
                    }
                    onChange={(event) =>
                    updateObgynField(
                        field.key as keyof typeof obgynHistory,
                        event.target.value
                    )
                    }
                    placeholder="Enter number"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
                </div>
            ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label
                htmlFor="menarcheAge"
                className="block text-sm font-medium text-slate-700"
                >
                Menarche Age (Optional)
                </label>

                <input
                id="menarcheAge"
                type="number"
                min="0"
                step="1"
                value={obgynHistory.menarcheAge}
                onChange={(event) =>
                    updateObgynField("menarcheAge", event.target.value)
                }
                placeholder="Age in years"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
            </div>

            <div>
                <label
                htmlFor="menstrualCycle"
                className="block text-sm font-medium text-slate-700"
                >
                Menstrual Cycle
                </label>

                <select
                id="menstrualCycle"
                value={obgynHistory.menstrualCycle}
                onChange={(event) =>
                    updateObgynField("menstrualCycle", event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
                >
                <option value="">Select menstrual cycle</option>
                <option value="regular">Regular</option>
                <option value="irregular">Irregular</option>
                </select>
            </div>
            </div>

            <div className="mt-5">
            <label
                htmlFor="obgynRemarks"
                className="block text-sm font-medium text-slate-700"
            >
                OB-GYN History Remarks (Optional)
            </label>

            <textarea
                id="obgynRemarks"
                rows={3}
                value={obgynHistory.remarks}
                onChange={(event) =>
                updateObgynField("remarks", event.target.value)
                }
                placeholder="Additional obstetric or gynecologic history..."
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
            />
            </div>
        </section>
        )}


        {/* Section 4: Pregnancy / Delivery Information */}
        {enrollmentReason && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
            4. Pregnancy / Delivery Information
            </h2>

            <p className="mt-2 text-sm text-slate-600">
            {enrollmentReason === "pregnant"
                ? "Record available details of the current pregnancy."
                : "Record available details of the completed pregnancy."}
            </p>

            {/* Currently pregnant pathway */}
            {enrollmentReason === "pregnant" && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                <label
                    htmlFor="lastMenstrualPeriod"
                    className="block text-sm font-medium text-slate-700"
                >
                    Last Menstrual Period (LMP)
                </label>

                <input
                    id="lastMenstrualPeriod"
                    type="date"
                    value={pregnancyInfo.lastMenstrualPeriod}
                    onChange={(event) =>
                    updatePregnancyField(
                        "lastMenstrualPeriod",
                        event.target.value
                    )
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
                </div>

                <div>
                <label
                    htmlFor="expectedDeliveryDate"
                    className="block text-sm font-medium text-slate-700"
                >
                    Expected Date of Delivery (EDD)
                </label>

                <input
                    id="expectedDeliveryDate"
                    type="date"
                    value={pregnancyInfo.expectedDeliveryDate}
                    onChange={(event) =>
                    updatePregnancyField(
                        "expectedDeliveryDate",
                        event.target.value
                    )
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
                </div>

                <div className="sm:col-span-2">
                <label
                    htmlFor="plannedDeliveryPlace"
                    className="block text-sm font-medium text-slate-700"
                >
                    Planned Delivery Location
                </label>

                <input
                    id="plannedDeliveryPlace"
                    type="text"
                    value={pregnancyInfo.plannedDeliveryPlace}
                    onChange={(event) =>
                    updatePregnancyField(
                        "plannedDeliveryPlace",
                        event.target.value
                    )
                    }
                    placeholder="Enter planned delivery facility or location"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
                </div>
            </div>
            )}

            {/* Already delivered pathway */}
            {enrollmentReason === "delivered" && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                <label
                    htmlFor="deliveryDate"
                    className="block text-sm font-medium text-slate-700"
                >
                    Date of Delivery
                </label>

                <input
                    id="deliveryDate"
                    type="date"
                    value={deliveryInfo.deliveryDate}
                    onChange={(event) =>
                    updateDeliveryField(
                        "deliveryDate",
                        event.target.value
                    )
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
                </div>

                <div>
                <label
                    htmlFor="deliveryPlace"
                    className="block text-sm font-medium text-slate-700"
                >
                    Place of Delivery
                </label>

                <input
                    id="deliveryPlace"
                    type="text"
                    value={deliveryInfo.deliveryPlace}
                    onChange={(event) =>
                    updateDeliveryField(
                        "deliveryPlace",
                        event.target.value
                    )
                    }
                    placeholder="Enter delivery facility or location"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
                </div>

                <div>
                <label
                    htmlFor="deliveryType"
                    className="block text-sm font-medium text-slate-700"
                >
                    Type of Delivery
                </label>

                <select
                    id="deliveryType"
                    value={deliveryInfo.deliveryType}
                    onChange={(event) =>
                    updateDeliveryField(
                        "deliveryType",
                        event.target.value
                    )
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
                >
                    <option value="">Select delivery type</option>
                    <option value="normal">Normal / Vaginal Delivery</option>
                    <option value="cesarean">Cesarean Section</option>
                    <option value="other">Other / Not Specified</option>
                </select>
                </div>

                <div>
                <label
                    htmlFor="pregnancyOutcome"
                    className="block text-sm font-medium text-slate-700"
                >
                    Pregnancy Outcome
                </label>

                <input
                    id="pregnancyOutcome"
                    type="text"
                    value={deliveryInfo.pregnancyOutcome}
                    onChange={(event) =>
                    updateDeliveryField(
                        "pregnancyOutcome",
                        event.target.value
                    )
                    }
                    placeholder="Enter documented pregnancy outcome"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
                />
                </div>
            </div>
            )}
        </section>
        )}


        {/* Section 5: Existing maternal record check */}
        {enrollmentReason && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
            5. Existing Maternal Record Check
            </h2>

            <p className="mt-2 text-sm text-slate-600">
            Verify whether the selected patient already has a
            maternal record for this pregnancy.
            </p>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            UI demonstration: Select a simulated record-check result
            to demonstrate how HealthConnect would handle existing
            maternal records. No database lookup is performed.
            </div>

            <div className="mt-5">
            <label
                htmlFor="recordCheckResult"
                className="block text-sm font-medium text-slate-700"
            >
                Simulated Record Check Result
            </label>

            <select
                id="recordCheckResult"
                value={recordCheckResult}
                onChange={(event) => {
                setRecordCheckResult(
                    event.target.value as RecordCheckResult
                );
                setDifferentPregnancyConfirmed(false);
                }}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900"
            >
                <option value="none">
                No existing maternal record found
                </option>
                <option value="same-pregnancy">
                Existing record belongs to the same pregnancy
                </option>
                <option value="different-pregnancy">
                Existing record belongs to a different pregnancy
                </option>
            </select>
            </div>

            {recordCheckResult === "none" && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                No existing maternal record was identified in this
                demonstration. Enrollment may proceed after validation.
            </div>
            )}

            {recordCheckResult === "same-pregnancy" && (
            <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900"
            >
                <p className="font-semibold">
                Possible Duplicate Maternal Record
                </p>

                <div className="mt-3 rounded-md border border-red-200 bg-white p-3">
                <p className="font-semibold">
                    Existing Maternal Record — Demo Data
                </p>
                <p className="mt-1">
                    Pregnancy: Same pregnancy as the proposed enrollment
                </p>
                <p>Record status: Active</p>
                </div>

                <p className="mt-2">
                An existing maternal record already represents this
                pregnancy. A new record should not be created.
                </p>

                <p className="mt-2">
                Review the existing record or coordinate with the
                Nurse/Midwife if clarification is needed.
                </p>
            </div>
            )}

            {recordCheckResult === "different-pregnancy" && (
            <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">
                    Existing Maternal Record Identified
                </p>

                <div className="mt-3 rounded-md border border-amber-200 bg-white p-3">
                <p className="font-semibold">
                    Existing Maternal Record — Demo Data
                </p>
                <p className="mt-1">EDD: June 15, 2024</p>
                <p>Record status: Completed</p>
                </div>

                <p className="mt-2">
                    The patient has a maternal record associated with
                    another pregnancy. Verify the pregnancy details
                    before proceeding with a new enrollment.
                </p>

                <p className="mt-2">
                    If the previous pregnancy remains unresolved,
                    coordinate with the Nurse/Midwife before enrollment.
                </p>
                </div>

                <label className="flex items-start gap-3 text-sm text-slate-700">
                <input
                    type="checkbox"
                    checked={differentPregnancyConfirmed}
                    onChange={(event) =>
                    setDifferentPregnancyConfirmed(
                        event.target.checked
                    )
                    }
                    className="mt-1"
                />

                <span>
                    I have reviewed the existing maternal record and
                    confirmed that this enrollment concerns a
                    different pregnancy.
                </span>
                </label>
            </div>
            )}
        </section>
        )}

                
        {/* Section 6: Review enrollment */}
        {enrollmentReason && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
            6. Review & Complete Enrollment
            </h2>

            <p className="mt-2 text-sm text-slate-600">
            Validate the entered information and review the proposed
            maternal record before completing enrollment.
            </p>

            {validationErrors.length > 0 && (
            <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900"
            >
                <p className="font-semibold">
                Please resolve the following issues:
                </p>

                <ul className="mt-2 list-disc space-y-1 pl-5">
                {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
                </ul>
            </div>
            )}

            <button
            type="button"
            onClick={handleReviewEnrollment}
            className="mt-5 rounded-md bg-blue-700 px-5 py-2.5 font-medium text-white hover:bg-blue-800"
            >
            Review Enrollment
            </button>
        </section>
        )}

    </div>
  );
}
