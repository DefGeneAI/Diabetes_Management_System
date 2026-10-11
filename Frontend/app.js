// ============================================================
// DiaTrack - Diabetes Monitoring
// Frontend JavaScript
// ============================================================


// ============================================================
// CONFIGURATION
// ============================================================

const API_URL = "/api";

let glucoseChart = null;


// ============================================================
// HELPER
// ============================================================

function getCurrentPatientId() {

    const patientSelect =
        document.getElementById("patientSelect");

    if (!patientSelect) {
        return null;
    }

    return patientSelect.value;
}


// ============================================================
// LOAD PATIENTS
// ============================================================

async function loadPatients() {

    try {

        const response =
            await fetch(`${API_URL}/patients`);

        if (!response.ok) {

            throw new Error(
                "Failed to load patients"
            );
        }

        const patients =
            await response.json();


        const patientSelect =
            document.getElementById(
                "patientSelect"
            );

        if (!patientSelect) {
            return;
        }


        // Clear old options
        patientSelect.innerHTML = "";


        // No patients
        if (
            !patients ||
            patients.length === 0
        ) {

            patientSelect.innerHTML = `
                <option value="">
                    No patients found
                </option>
            `;

            clearPatientDashboard();

            return;
        }


        // Add patients to dropdown
        patients.forEach(patient => {

            const option =
                document.createElement("option");

            option.value =
                patient.patient_id;

            option.textContent =
                `${patient.first_name} ${patient.last_name}`;

            patientSelect.appendChild(option);
        });


        // Automatically select first patient
        const firstPatientId =
            patients[0].patient_id;

        patientSelect.value =
            firstPatientId;


        // Load dashboard
        await loadDashboard(
            firstPatientId
        );

    } catch (error) {

        console.error(
            "Error loading patients:",
            error
        );

        const patientSelect =
            document.getElementById(
                "patientSelect"
            );

        if (patientSelect) {

            patientSelect.innerHTML = `
                <option value="">
                    Error loading patients
                </option>
            `;
        }
    }
}


// ============================================================
// LOAD COMPLETE DASHBOARD
// ============================================================

async function loadDashboard(patientId) {

    if (!patientId) {
        return;
    }

    console.log(
        "Loading dashboard for patient:",
        patientId
    );


    await loadPatientInfo(patientId);

    await loadGlucose(patientId);

    await loadSummary(patientId);

    await loadAnalytics(patientId);

    await loadMedications(patientId);

    await loadAppointments(patientId);

    updateLastUpdated();
}


// ============================================================
// CLEAR DASHBOARD
// ============================================================

function clearPatientDashboard() {

    const currentPatientName =
        document.getElementById(
            "currentPatientName"
        );

    if (currentPatientName) {

        currentPatientName.textContent =
            "Select a patient";
    }


    const patientInfo =
        document.getElementById(
            "patientInfo"
        );

    if (patientInfo) {

        patientInfo.innerHTML =
            "Select a patient.";
    }
}


// ============================================================
// PATIENT INFORMATION
// ============================================================

async function loadPatientInfo(patientId) {

    try {

        const response =
            await fetch(
                `${API_URL}/patients/${patientId}`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load patient information"
            );
        }

        const patient =
            await response.json();


        console.log(
            "Patient information:",
            patient
        );


        // ----------------------------------------------------
        // Current patient name in action bar
        // ----------------------------------------------------

        const currentPatientName =
            document.getElementById(
                "currentPatientName"
            );

        if (currentPatientName) {

            currentPatientName.textContent =
                `${patient.first_name} ${patient.last_name}`;
        }


        // ----------------------------------------------------
        // Patient profile
        // ----------------------------------------------------

        const patientInfo =
            document.getElementById(
                "patientInfo"
            );

        if (patientInfo) {

            patientInfo.innerHTML = `

                <div class="patient-info-grid">

                    <div class="patient-info-item">

                        <span>
                            Patient ID
                        </span>

                        <strong>
                            ${patient.patient_id}
                        </strong>

                    </div>


                    <div class="patient-info-item">

                        <span>
                            Name
                        </span>

                        <strong>
                            ${patient.first_name}
                            ${patient.last_name}
                        </strong>

                    </div>


                    <div class="patient-info-item">

                        <span>
                            Date of Birth
                        </span>

                        <strong>
                            ${patient.date_of_birth || "Not available"}
                        </strong>

                    </div>


                    <div class="patient-info-item">

                        <span>
                            Gender
                        </span>

                        <strong>
                            ${patient.gender || "Not specified"}
                        </strong>

                    </div>


                    <div class="patient-info-item">

                        <span>
                            Phone
                        </span>

                        <strong>
                            ${patient.phone || "Not available"}
                        </strong>

                    </div>


                    <div class="patient-info-item">

                        <span>
                            Email
                        </span>

                        <strong>
                            ${patient.email || "Not available"}
                        </strong>

                    </div>


                    <div class="patient-info-item">

                        <span>
                            Diagnosis Date
                        </span>

                        <strong>
                            ${patient.diagnosis_date || "Not available"}
                        </strong>

                    </div>

                </div>
            `;
        }

    } catch (error) {

        console.error(
            "Error loading patient information:",
            error
        );

        const patientInfo =
            document.getElementById(
                "patientInfo"
            );

        if (patientInfo) {

            patientInfo.innerHTML = `
                <p>
                    Unable to load patient information.
                </p>
            `;
        }
    }
}


// ============================================================
// LOAD GLUCOSE READINGS
// ============================================================

async function loadGlucose(patientId) {

    try {

        const response =
            await fetch(
                `${API_URL}/patients/${patientId}/glucose`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load glucose readings"
            );
        }

        const readings =
            await response.json();


        console.log(
            "Glucose readings:",
            readings
        );


        displayLatestGlucose(
            readings
        );

        displayGlucoseTable(
            readings
        );

        displayGlucoseChart(
            readings
        );

    } catch (error) {

        console.error(
            "Error loading glucose:",
            error
        );
    }
}


// ============================================================
// DISPLAY LATEST GLUCOSE
// ============================================================

function displayLatestGlucose(readings) {

    const latestGlucose =
        document.getElementById(
            "latestGlucose"
        );

    const latestMeasurement =
        document.getElementById(
            "latestMeasurement"
        );

    const latestDate =
        document.getElementById(
            "latestDate"
        );

    const glucoseStatus =
        document.getElementById(
            "glucoseStatus"
        );


    if (
        !readings ||
        readings.length === 0
    ) {

        if (latestGlucose) {
            latestGlucose.textContent = "-";
        }

        if (latestMeasurement) {
            latestMeasurement.textContent = "-";
        }

        if (latestDate) {
            latestDate.textContent = "-";
        }

        if (glucoseStatus) {
            glucoseStatus.textContent =
                "No data";
        }

        return;
    }


    // Backend should return newest first.
    // Sort again here to be safe.

    const sortedReadings =
        [...readings].sort(
            (a, b) =>
                new Date(b.reading_date) -
                new Date(a.reading_date)
        );


    const latest =
        sortedReadings[0];


    // Latest glucose
    if (latestGlucose) {

        latestGlucose.textContent =
            Number(
                latest.glucose_level
            ).toFixed(0);
    }


    // Measurement type
    if (latestMeasurement) {

        latestMeasurement.textContent =
            latest.measurement_type ||
            "Not specified";
    }


    // Date
    if (latestDate) {

        latestDate.textContent =
            formatDateTime(
                latest.reading_date
            );
    }


    // Demonstration status
    if (glucoseStatus) {

        glucoseStatus.textContent =
            getGlucoseStatus(
                Number(latest.glucose_level)
            );
    }
}


// ============================================================
// GLUCOSE STATUS
// ============================================================

function getGlucoseStatus(value) {

    if (value < 70) {

        return "Low";
    }

    if (value > 180) {

        return "High";
    }

    return "Within range";
}


// ============================================================
// DISPLAY GLUCOSE TABLE
// ============================================================

function displayGlucoseTable(readings) {

    const tableBody =
        document.getElementById(
            "glucoseTableBody"
        );

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !readings ||
        readings.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No glucose readings recorded.
                </td>
            </tr>
        `;

        return;
    }


    const sortedReadings =
        [...readings].sort(
            (a, b) =>
                new Date(b.reading_date) -
                new Date(a.reading_date)
        );


    sortedReadings.forEach(
        reading => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${formatDateTime(
                        reading.reading_date
                    )}
                </td>

                <td>
                    <strong>
                        ${Number(
                            reading.glucose_level
                        ).toFixed(0)}
                        mg/dL
                    </strong>
                </td>

                <td>
                    ${
                        reading.measurement_type ||
                        "Not specified"
                    }
                </td>

            `;


            tableBody.appendChild(row);
        }
    );
}


// ============================================================
// GLUCOSE CHART
// ============================================================

function displayGlucoseChart(readings) {

    const canvas =
        document.getElementById(
            "glucoseChart"
        );

    if (!canvas) {
        return;
    }


    const ctx =
        canvas.getContext("2d");


    // Destroy old chart
    if (glucoseChart) {

        glucoseChart.destroy();

        glucoseChart = null;
    }


    if (
        !readings ||
        readings.length === 0
    ) {

        return;
    }


    // Oldest → newest
    const chartReadings =
        [...readings].sort(
            (a, b) =>
                new Date(a.reading_date) -
                new Date(b.reading_date)
        );


    const labels =
        chartReadings.map(
            reading =>
                formatDateTime(
                    reading.reading_date
                )
        );


    const values =
        chartReadings.map(
            reading =>
                Number(
                    reading.glucose_level
                )
        );


    glucoseChart =
        new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Glucose Level",

                            data:
                                values,

                            tension:
                                0.3,

                            fill:
                                false
                        }

                    ]
                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            title: {

                                display:
                                    true,

                                text:
                                    "Glucose (mg/dL)"
                            }
                        },

                        x: {

                            title: {

                                display:
                                    true,

                                text:
                                    "Date & Time"
                            }
                        }
                    }
                }
            }
        );
}


// ============================================================
// LOAD SUMMARY
// ============================================================

async function loadSummary(patientId) {

    try {

        const response =
            await fetch(
                `${API_URL}/patients/${patientId}/summary`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load summary"
            );
        }

        const summary =
            await response.json();


        console.log(
            "Summary:",
            summary
        );


        // ----------------------------------------------------
        // Average
        // ----------------------------------------------------

        const averageGlucose =
            document.getElementById(
                "averageGlucose"
            );

        if (averageGlucose) {

            averageGlucose.textContent =
                formatNumber(
                    summary.average_glucose
                );
        }


        // ----------------------------------------------------
        // Highest
        // ----------------------------------------------------

        const highestGlucose =
            document.getElementById(
                "highestGlucose"
            );

        if (highestGlucose) {

            highestGlucose.textContent =
                formatNumber(
                    summary.highest_glucose
                );
        }


        // ----------------------------------------------------
        // Lowest
        // ----------------------------------------------------

        const lowestGlucose =
            document.getElementById(
                "lowestGlucose"
            );

        if (lowestGlucose) {

            lowestGlucose.textContent =
                formatNumber(
                    summary.lowest_glucose
                );
        }


        // ----------------------------------------------------
        // Total readings
        // ----------------------------------------------------

        const totalReadings =
            document.getElementById(
                "totalReadings"
            );

        if (totalReadings) {

            totalReadings.textContent =
                summary.total_readings || 0;
        }

    } catch (error) {

        console.error(
            "Error loading summary:",
            error
        );
    }
}


// ============================================================
// LOAD ANALYTICS
// ============================================================

async function loadAnalytics(patientId) {

    try {

        const response =
            await fetch(
                `${API_URL}/patients/${patientId}/analytics`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load analytics"
            );
        }


        const analytics =
            await response.json();


        console.log(
            "Analytics response:",
            analytics
        );


        // ====================================================
        // OVERALL STATISTICS
        // ====================================================

        const statistics =
            analytics.statistics || {};


        // Standard deviation
        const standardDeviation =
            document.getElementById(
                "standardDeviation"
            );


        if (standardDeviation) {

            standardDeviation.textContent =
                formatNumber(
                    statistics.standard_deviation
                );
        }


        // ====================================================
        // MEASUREMENT TYPE AVERAGES
        // ====================================================

        const measurementTypes =
            analytics.measurementTypes || [];


        // ----------------------------------------------------
        // Find Fasting
        // ----------------------------------------------------

        const fasting =
            measurementTypes.find(
                item =>
                    item.measurement_type ===
                    "Fasting"
            );


        const fastingAverage =
            document.getElementById(
                "fastingAverage"
            );


        if (fastingAverage) {

            fastingAverage.textContent =
                fasting
                    ? formatNumber(
                        fasting.average_glucose
                    )
                    : "-";
        }


        // ----------------------------------------------------
        // Find Post Lunch
        // ----------------------------------------------------

        const postLunch =
            measurementTypes.find(
                item =>
                    item.measurement_type ===
                    "Post Lunch"
            );


        const postLunchAverage =
            document.getElementById(
                "postLunchAverage"
            );


        if (postLunchAverage) {

            postLunchAverage.textContent =
                postLunch
                    ? formatNumber(
                        postLunch.average_glucose
                    )
                    : "-";
        }


        // ----------------------------------------------------
        // Find Post Dinner
        // ----------------------------------------------------

        const postDinner =
            measurementTypes.find(
                item =>
                    item.measurement_type ===
                    "Post Dinner"
            );


        const postDinnerAverage =
            document.getElementById(
                "postDinnerAverage"
            );


        if (postDinnerAverage) {

            postDinnerAverage.textContent =
                postDinner
                    ? formatNumber(
                        postDinner.average_glucose
                    )
                    : "-";
        }


    } catch (error) {

        console.error(
            "Error loading analytics:",
            error
        );

    }

}

// ============================================================
// MEDICATIONS
// ============================================================

async function loadMedications(patientId) {

    try {

        const response =
            await fetch(
                `${API_URL}/patients/${patientId}/medications`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load medications"
            );
        }

        const medications =
            await response.json();


        displayMedications(
            medications
        );

    } catch (error) {

        console.error(
            "Error loading medications:",
            error
        );
    }
}


// ============================================================
// DISPLAY MEDICATIONS
// ============================================================

function displayMedications(
    medications
) {

    const tableBody =
        document.getElementById(
            "medicationTableBody"
        );

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !medications ||
        medications.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>

                <td
                    colspan="5"
                >
                    No medications recorded.
                </td>

            </tr>
        `;

        return;
    }


    medications.forEach(
        medication => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${
                            medication.medication_name
                        }
                    </strong>
                </td>

                <td>
                    ${
                        medication.dosage ||
                        "Not specified"
                    }
                </td>

                <td>
                    ${
                        medication.frequency ||
                        "Not specified"
                    }
                </td>

                <td>
                    ${
                        formatDate(
                            medication.start_date
                        )
                    }
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-danger btn-small"
                        onclick="deleteMedication(${medication.medication_id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(row);
        }
    );
}


// ============================================================
// OPEN MEDICATION MODAL
// ============================================================

function openMedicationModal() {

    const patientId =
        getCurrentPatientId();


    if (!patientId) {

        alert(
            "Please select a patient first."
        );

        return;
    }


    const form =
        document.getElementById(
            "medicationForm"
        );

    if (form) {
        form.reset();
    }


    const modal =
        document.getElementById(
            "medicationModal"
        );

    if (modal) {

        modal.classList.remove(
            "hidden"
        );
    }
}


// ============================================================
// CLOSE MEDICATION MODAL
// ============================================================

function closeMedicationModal() {

    const modal =
        document.getElementById(
            "medicationModal"
        );

    if (modal) {

        modal.classList.add(
            "hidden"
        );
    }
}


// ============================================================
// ADD MEDICATION
// ============================================================

async function addMedication(event) {

    event.preventDefault();


    const patientId =
        getCurrentPatientId();


    if (!patientId) {

        alert(
            "Please select a patient first."
        );

        return;
    }


    const medicationName =
        document.getElementById(
            "medicationName"
        ).value.trim();


    const medicationDosage =
        document.getElementById(
            "medicationDosage"
        ).value.trim();


    const medicationFrequency =
        document.getElementById(
            "medicationFrequency"
        ).value.trim();


    const medicationStartDate =
        document.getElementById(
            "medicationStartDate"
        ).value;


    const medicationEndDate =
        document.getElementById(
            "medicationEndDate"
        ).value;


    if (!medicationName) {

        alert(
            "Please enter the medication name."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/medications`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            patient_id:
                                Number(
                                    patientId
                                ),

                            medication_name:
                                medicationName,

                            dosage:
                                medicationDosage ||
                                null,

                            frequency:
                                medicationFrequency ||
                                null,

                            start_date:
                                medicationStartDate ||
                                null,

                            end_date:
                                medicationEndDate ||
                                null
                        })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to add medication"
            );
        }


        alert(
            "Medication added successfully."
        );


        closeMedicationModal();


        await loadDashboard(
            patientId
        );

    } catch (error) {

        console.error(
            "Error adding medication:",
            error
        );

        alert(
            error.message ||
            "Failed to add medication."
        );
    }
}


// ============================================================
// DELETE MEDICATION
// ============================================================

async function deleteMedication(
    medicationId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this medication?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/medications/${medicationId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to delete medication"
            );
        }


        alert(
            "Medication deleted successfully."
        );


        const patientId =
            getCurrentPatientId();


        if (patientId) {

            await loadDashboard(
                patientId
            );
        }

    } catch (error) {

        console.error(
            "Error deleting medication:",
            error
        );

        alert(
            error.message ||
            "Failed to delete medication."
        );
    }
}


// ============================================================
// APPOINTMENTS
// ============================================================

async function loadAppointments(
    patientId
) {

    try {

        const response =
            await fetch(
                `${API_URL}/patients/${patientId}/appointments`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load appointments"
            );
        }


        const appointments =
            await response.json();


        displayAppointments(
            appointments
        );

    } catch (error) {

        console.error(
            "Error loading appointments:",
            error
        );
    }
}


// ============================================================
// DISPLAY APPOINTMENTS
// ============================================================

function displayAppointments(
    appointments
) {

    const tableBody =
        document.getElementById(
            "appointmentTableBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (
        !appointments ||
        appointments.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>

                <td
                    colspan="4"
                >
                    No appointments scheduled.
                </td>

            </tr>
        `;

        return;
    }


    appointments.forEach(
        appointment => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${
                        formatDateTime(
                            appointment.appointment_date
                        )
                    }
                </td>

                <td>
                    ${
                        appointment.doctor_name ||
                        "Not specified"
                    }
                </td>

                <td>
                    ${
                        appointment.appointment_type ||
                        "Not specified"
                    }
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-danger btn-small"
                        onclick="deleteAppointment(${appointment.appointment_id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(row);
        }
    );
}


// ============================================================
// OPEN APPOINTMENT MODAL
// ============================================================

function openAppointmentModal() {

    const patientId =
        getCurrentPatientId();


    if (!patientId) {

        alert(
            "Please select a patient first."
        );

        return;
    }


    const form =
        document.getElementById(
            "appointmentForm"
        );


    if (form) {
        form.reset();
    }


    const modal =
        document.getElementById(
            "appointmentModal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );
    }
}


// ============================================================
// CLOSE APPOINTMENT MODAL
// ============================================================

function closeAppointmentModal() {

    const modal =
        document.getElementById(
            "appointmentModal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );
    }
}


// ============================================================
// ADD APPOINTMENT
// ============================================================

async function addAppointment(event) {

    event.preventDefault();


    const patientId =
        getCurrentPatientId();


    if (!patientId) {

        alert(
            "Please select a patient first."
        );

        return;
    }


    const appointmentDateInput =
        document.getElementById(
            "appointmentDate"
        ).value;


    const doctorName =
        document.getElementById(
            "doctorName"
        ).value.trim();


    const appointmentType =
        document.getElementById(
            "appointmentType"
        ).value;


    const appointmentNotes =
        document.getElementById(
            "appointmentNotes"
        ).value.trim();


    if (!appointmentDateInput) {

        alert(
            "Please select appointment date and time."
        );

        return;
    }


    if (!doctorName) {

        alert(
            "Please enter the doctor's name."
        );

        return;
    }


    if (!appointmentType) {

        alert(
            "Please select an appointment type."
        );

        return;
    }


    // Convert:
    //
    // 2026-10-10T10:30
    //
    // into:
    //
    // 2026-10-10 10:30:00
    //
    // for MySQL DATETIME.

    const appointmentDate =
        appointmentDateInput
            .replace("T", " ") +
        ":00";


    try {

        const response =
            await fetch(
                `${API_URL}/appointments`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            patient_id:
                                Number(
                                    patientId
                                ),

                            appointment_date:
                                appointmentDate,

                            doctor_name:
                                doctorName,

                            appointment_type:
                                appointmentType,

                            notes:
                                appointmentNotes ||
                                null
                        })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to add appointment"
            );
        }


        alert(
            "Appointment added successfully."
        );


        closeAppointmentModal();


        await loadDashboard(
            patientId
        );

    } catch (error) {

        console.error(
            "Error adding appointment:",
            error
        );

        alert(
            error.message ||
            "Failed to add appointment."
        );
    }
}


// ============================================================
// DELETE APPOINTMENT
// ============================================================

async function deleteAppointment(
    appointmentId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this appointment?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/appointments/${appointmentId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to delete appointment"
            );
        }


        alert(
            "Appointment deleted successfully."
        );


        const patientId =
            getCurrentPatientId();


        if (patientId) {

            await loadDashboard(
                patientId
            );
        }

    } catch (error) {

        console.error(
            "Error deleting appointment:",
            error
        );

        alert(
            error.message ||
            "Failed to delete appointment."
        );
    }
}


// ============================================================
// ADD GLUCOSE READING
// ============================================================

async function addGlucoseReading(event) {

    event.preventDefault();


    const patientId =
        getCurrentPatientId();


    if (!patientId) {

        alert(
            "Please select a patient first."
        );

        return;
    }


    const glucoseLevel =
        document.getElementById(
            "glucoseLevel"
        ).value;


    const measurementType =
        document.getElementById(
            "measurementType"
        ).value;


    if (!glucoseLevel) {

        alert(
            "Please enter the glucose level."
        );

        return;
    }


    // Your HTML does NOT contain a
    // reading date input.
    //
    // Therefore we use the current date/time.

    const now =
        new Date();


    const readingDate =
        formatForMySQL(
            now
        );


    try {

        const response =
            await fetch(
                `${API_URL}/glucose`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            patient_id:
                                Number(
                                    patientId
                                ),

                            reading_date:
                                readingDate,

                            glucose_level:
                                Number(
                                    glucoseLevel
                                ),

                            measurement_type:
                                measurementType
                        })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to add glucose reading"
            );
        }


        alert(
            "Glucose reading added successfully."
        );


        const glucoseForm =
            document.getElementById(
                "glucoseForm"
            );


        if (glucoseForm) {

            glucoseForm.reset();
        }


        await loadDashboard(
            patientId
        );

    } catch (error) {

        console.error(
            "Error adding glucose:",
            error
        );

        alert(
            error.message ||
            "Failed to add glucose reading."
        );
    }
}


// ============================================================
// ADD PATIENT
// ============================================================

async function addPatient(event) {

    event.preventDefault();


    const firstName =
        document.getElementById(
            "firstName"
        ).value.trim();


    const lastName =
        document.getElementById(
            "lastName"
        ).value.trim();


    const dateOfBirth =
        document.getElementById(
            "dateOfBirth"
        ).value;


    const gender =
        document.getElementById(
            "gender"
        ).value;


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const diagnosisDate =
        document.getElementById(
            "diagnosisDate"
        ).value;


    if (
        !firstName ||
        !lastName
    ) {

        alert(
            "First name and last name are required."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/patients`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            first_name:
                                firstName,

                            last_name:
                                lastName,

                            date_of_birth:
                                dateOfBirth ||
                                null,

                            gender:
                                gender ||
                                null,

                            phone:
                                phone ||
                                null,

                            email:
                                email ||
                                null,

                            diagnosis_date:
                                diagnosisDate ||
                                null
                        })
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to add patient"
            );
        }


        alert(
            "Patient added successfully."
        );


        closePatientModal();


        // Reload patient dropdown
        await loadPatients();

    } catch (error) {

        console.error(
            "Error adding patient:",
            error
        );

        alert(
            error.message ||
            "Failed to add patient."
        );
    }
}


// ============================================================
// DELETE PATIENT
// ============================================================

async function deletePatient() {

    const patientId =
        getCurrentPatientId();


    if (!patientId) {

        alert(
            "Please select a patient first."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this patient and all associated records?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/patients/${patientId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to delete patient"
            );
        }


        alert(
            "Patient deleted successfully."
        );


        await loadPatients();

    } catch (error) {

        console.error(
            "Error deleting patient:",
            error
        );

        alert(
            error.message ||
            "Failed to delete patient."
        );
    }
}


// ============================================================
// PATIENT MODAL
// ============================================================

function openPatientModal() {

    const form =
        document.getElementById(
            "patientForm"
        );


    if (form) {
        form.reset();
    }


    const modal =
        document.getElementById(
            "patientModal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );
    }
}


function closePatientModal() {

    const modal =
        document.getElementById(
            "patientModal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );
    }
}


// ============================================================
// DATE FORMATTING
// ============================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "Not specified";
    }


    const date =
        new Date(dateValue);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return dateValue;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ============================================================
// DATE + TIME FORMATTING
// ============================================================

function formatDateTime(
    dateValue
) {

    if (!dateValue) {

        return "Not specified";
    }


    const date =
        new Date(dateValue);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return dateValue;
    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ============================================================
// FORMAT DATE FOR MYSQL
// ============================================================

function formatForMySQL(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");


    const seconds =
        String(
            date.getSeconds()
        ).padStart(2, "0");


    return (
        `${year}-${month}-${day} ` +
        `${hours}:${minutes}:${seconds}`
    );
}


// ============================================================
// NUMBER FORMATTING
// ============================================================

function formatNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "-";
    }


    const number =
        Number(value);


    if (
        isNaN(number)
    ) {

        return "-";
    }


    return number.toFixed(1);
}


// ============================================================
// LAST UPDATED
// ============================================================

function updateLastUpdated() {

    const lastUpdated =
        document.getElementById(
            "lastUpdated"
        );


    if (!lastUpdated) {
        return;
    }


    lastUpdated.textContent =
        new Date().toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
}


// ============================================================
// NAVIGATION
// ============================================================

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    navItems.forEach(
                        nav =>
                            nav.classList.remove(
                                "active"
                            )
                    );


                    this.classList.add(
                        "active"
                    );
                }
            );
        }
    );
}


// ============================================================
// EVENT LISTENERS
// ============================================================

function setupEventListeners() {


    // --------------------------------------------------------
    // Patient dropdown
    // --------------------------------------------------------

    const patientSelect =
        document.getElementById(
            "patientSelect"
        );


    if (patientSelect) {

        patientSelect.addEventListener(
            "change",
            async function () {

                const patientId =
                    this.value;


                if (patientId) {

                    await loadDashboard(
                        patientId
                    );
                }
            }
        );
    }


    // --------------------------------------------------------
    // Add Patient
    // --------------------------------------------------------

    const addPatientButton =
        document.getElementById(
            "addPatientButton"
        );


    if (addPatientButton) {

        addPatientButton.addEventListener(
            "click",
            openPatientModal
        );
    }


    // --------------------------------------------------------
    // Patient Form
    // --------------------------------------------------------

    const patientForm =
        document.getElementById(
            "patientForm"
        );


    if (patientForm) {

        patientForm.addEventListener(
            "submit",
            addPatient
        );
    }


    // --------------------------------------------------------
    // Patient Modal Close
    //
    // IMPORTANT:
    // Your HTML uses:
    // closeModalButton
    // cancelModalButton
    // --------------------------------------------------------

    const closeModalButton =
        document.getElementById(
            "closeModalButton"
        );


    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closePatientModal
        );
    }


    const cancelModalButton =
        document.getElementById(
            "cancelModalButton"
        );


    if (cancelModalButton) {

        cancelModalButton.addEventListener(
            "click",
            closePatientModal
        );
    }


    // --------------------------------------------------------
    // Delete Patient
    // --------------------------------------------------------

    const deletePatientButton =
        document.getElementById(
            "deletePatientButton"
        );


    if (deletePatientButton) {

        deletePatientButton.addEventListener(
            "click",
            deletePatient
        );
    }


    // --------------------------------------------------------
    // Glucose Form
    // --------------------------------------------------------

    const glucoseForm =
        document.getElementById(
            "glucoseForm"
        );


    if (glucoseForm) {

        glucoseForm.addEventListener(
            "submit",
            addGlucoseReading
        );
    }


    // --------------------------------------------------------
    // Add Medication
    // --------------------------------------------------------

    const addMedicationButton =
        document.getElementById(
            "addMedicationButton"
        );


    if (addMedicationButton) {

        addMedicationButton.addEventListener(
            "click",
            openMedicationModal
        );
    }


    // --------------------------------------------------------
    // Medication Form
    // --------------------------------------------------------

    const medicationForm =
        document.getElementById(
            "medicationForm"
        );


    if (medicationForm) {

        medicationForm.addEventListener(
            "submit",
            addMedication
        );
    }


    // --------------------------------------------------------
    // Medication Modal Close
    // --------------------------------------------------------

    const closeMedicationModalButton =
        document.getElementById(
            "closeMedicationModalButton"
        );


    if (closeMedicationModalButton) {

        closeMedicationModalButton.addEventListener(
            "click",
            closeMedicationModal
        );
    }


    const cancelMedicationButton =
        document.getElementById(
            "cancelMedicationButton"
        );


    if (cancelMedicationButton) {

        cancelMedicationButton.addEventListener(
            "click",
            closeMedicationModal
        );
    }


    // --------------------------------------------------------
    // Add Appointment
    // --------------------------------------------------------

    const addAppointmentButton =
        document.getElementById(
            "addAppointmentButton"
        );


    if (addAppointmentButton) {

        addAppointmentButton.addEventListener(
            "click",
            openAppointmentModal
        );
    }


    // --------------------------------------------------------
    // Appointment Form
    // --------------------------------------------------------

    const appointmentForm =
        document.getElementById(
            "appointmentForm"
        );


    if (appointmentForm) {

        appointmentForm.addEventListener(
            "submit",
            addAppointment
        );
    }


    // --------------------------------------------------------
    // Appointment Modal Close
    // --------------------------------------------------------

    const closeAppointmentModalButton =
        document.getElementById(
            "closeAppointmentModalButton"
        );


    if (closeAppointmentModalButton) {

        closeAppointmentModalButton.addEventListener(
            "click",
            closeAppointmentModal
        );
    }


    const cancelAppointmentButton =
        document.getElementById(
            "cancelAppointmentButton"
        );


    if (cancelAppointmentButton) {

        cancelAppointmentButton.addEventListener(
            "click",
            closeAppointmentModal
        );
    }


    // --------------------------------------------------------
    // Navigation
    // --------------------------------------------------------

    setupNavigation();
}


// ============================================================
// APPLICATION START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "DiaTrack starting..."
        );


        setupEventListeners();


        await loadPatients();


        console.log(
            "DiaTrack ready."
        );
    }
);

