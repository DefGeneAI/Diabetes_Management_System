const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");

const app = express();

const PORT = 5000;

// ----------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));


// ----------------------------------------------------
// HOME PAGE
// ----------------------------------------------------

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/index.html")
    );
});


// ====================================================
// PATIENT APIs
// ====================================================


// ----------------------------------------------------
// GET ALL PATIENTS
// GET /api/patients
// ----------------------------------------------------

app.get("/api/patients", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT *
            FROM patient
            ORDER BY first_name, last_name
        `);

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve patients"
        });

    }

});


// ----------------------------------------------------
// GET ONE PATIENT
// GET /api/patients/:id
// ----------------------------------------------------

app.get("/api/patients/:id", async (req, res) => {

    try {

        const patientId = req.params.id;

        const [rows] = await db.query(
            `
            SELECT *
            FROM patient
            WHERE patient_id = ?
            `,
            [patientId]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                error: "Patient not found"
            });

        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve patient"
        });

    }

});


// ----------------------------------------------------
// ADD PATIENT
// POST /api/patients
// ----------------------------------------------------

app.post("/api/patients", async (req, res) => {

    try {

        const {
            first_name,
            last_name,
            date_of_birth,
            gender,
            phone,
            email,
            diagnosis_date
        } = req.body;


        // ====================================================
        // 1. BASIC VALIDATION
        // ====================================================

        if (
            !first_name ||
            !last_name ||
            !phone ||
            !email
        ) {

            return res.status(400).json({
                error:
                    "First name, last name, phone and email are required"
            });

        }


        // Remove unnecessary spaces

        const cleanFirstName = first_name.trim();
        const cleanLastName = last_name.trim();
        const cleanPhone = phone.trim();
        const cleanEmail = email.trim().toLowerCase();


        // ====================================================
        // 2. VALIDATE PHONE FORMAT
        // ====================================================

        const phoneRegex = /^[6-9][0-9]{9}$/;

        if (!phoneRegex.test(cleanPhone)) {

            return res.status(400).json({
                error:
                    "Invalid phone number. Enter a valid 10-digit Indian mobile number."
            });

        }


        // ====================================================
        // 3. VALIDATE EMAIL FORMAT
        // ====================================================

        const emailRegex =
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(cleanEmail)) {

            return res.status(400).json({
                error:
                    "Invalid email address."
            });

        }


        // ====================================================
        // 4. CHECK FOR EXISTING PATIENT
        // ====================================================

        const [existingPatients] = await db.query(
            `
            SELECT
                patient_id,
                first_name,
                last_name,
                phone,
                email
            FROM patient
            WHERE
                phone = ?
                OR email = ?
                OR (
                    LOWER(first_name) = LOWER(?)
                    AND LOWER(last_name) = LOWER(?)
                )
            `,
            [
                cleanPhone,
                cleanEmail,
                cleanFirstName,
                cleanLastName
            ]
        );


        // ====================================================
        // 5. IF DUPLICATE/POSSIBLE DUPLICATE EXISTS
        // ====================================================

        if (existingPatients.length > 0) {

            const existingPatient = existingPatients[0];


            // ---------------------------------------------
            // Same phone
            // ---------------------------------------------

            if (existingPatient.phone === cleanPhone) {

                return res.status(409).json({

                    error:
                        "Patient already exists with this phone number.",

                    patient: existingPatient

                });

            }


            // ---------------------------------------------
            // Same email
            // ---------------------------------------------

            if (
                existingPatient.email &&
                existingPatient.email.toLowerCase() === cleanEmail
            ) {

                return res.status(409).json({

                    error:
                        "Patient already exists with this email address.",

                    patient: existingPatient

                });

            }


            // ---------------------------------------------
            // Same first name + last name
            // ---------------------------------------------

            return res.status(409).json({

                error:
                    "A patient with the same name already exists in the database. Please verify the patient details.",

                patient: existingPatient

            });

        }


        // ====================================================
        // 6. INSERT NEW PATIENT
        // ====================================================

        const [result] = await db.query(
            `
            INSERT INTO patient
            (
                first_name,
                last_name,
                date_of_birth,
                gender,
                phone,
                email,
                diagnosis_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                cleanFirstName,
                cleanLastName,
                date_of_birth || null,
                gender || null,
                cleanPhone,
                cleanEmail,
                diagnosis_date || null
            ]
        );


        // ====================================================
        // 7. SUCCESS RESPONSE
        // ====================================================

        res.status(201).json({

            message:
                "Patient added successfully",

            patient_id:
                result.insertId

        });


    } catch (error) {

        console.error(error);


        // ====================================================
        // 8. HANDLE DATABASE DUPLICATE ERROR
        // ====================================================

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({

                error:
                    "Patient already exists. Phone number or email is already registered."

            });

        }


        // ====================================================
        // 9. GENERAL ERROR
        // ====================================================

        res.status(500).json({

            error:
                "Failed to add patient"

        });

    }

});


// ----------------------------------------------------
// DELETE PATIENT
// DELETE /api/patients/:id
// ----------------------------------------------------

app.delete("/api/patients/:id", async (req, res) => {

    const patientId = req.params.id;

    let connection;

    try {

        // Get a dedicated connection from pool

        connection = await db.getConnection();


        // Start transaction

        await connection.beginTransaction();


        // ---------------------------------------------
        // Delete glucose records
        // ---------------------------------------------

        await connection.query(
            `
            DELETE FROM glucose_reading
            WHERE patient_id = ?
            `,
            [patientId]
        );


        // ---------------------------------------------
        // Delete medication records
        // ---------------------------------------------

        await connection.query(
            `
            DELETE FROM medication
            WHERE patient_id = ?
            `,
            [patientId]
        );


        // ---------------------------------------------
        // Delete appointment records
        // ---------------------------------------------

        await connection.query(
            `
            DELETE FROM appointment
            WHERE patient_id = ?
            `,
            [patientId]
        );


        // ---------------------------------------------
        // Delete patient
        // ---------------------------------------------

        const [result] = await connection.query(
            `
            DELETE FROM patient
            WHERE patient_id = ?
            `,
            [patientId]
        );


        // Patient doesn't exist

        if (result.affectedRows === 0) {

            await connection.rollback();

            return res.status(404).json({
                error: "Patient not found"
            });

        }


        // Everything successful

        await connection.commit();


        res.json({

            message:
                "Patient and associated records deleted successfully"

        });


    } catch (error) {

        console.error(error);


        // Undo everything if something failed

        if (connection) {

            await connection.rollback();

        }


        res.status(500).json({

            error:
                "Failed to delete patient"

        });


    } finally {

        if (connection) {

            connection.release();

        }

    }

});


// ====================================================
// GLUCOSE APIs
// ====================================================


// ----------------------------------------------------
// GET GLUCOSE READINGS
// GET /api/patients/:id/glucose
// ----------------------------------------------------

app.get("/api/patients/:id/glucose", async (req, res) => {

    try {

        const patientId = req.params.id;

        const [rows] = await db.query(
            `
            SELECT
                reading_id,
                reading_date,
                glucose_level,
                measurement_type
            FROM glucose_reading
            WHERE patient_id = ?
            ORDER BY reading_date ASC
            `,
            [patientId]
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve glucose readings"
        });

    }

});


// ----------------------------------------------------
// ADD GLUCOSE READING
// POST /api/glucose
// ----------------------------------------------------

app.post("/api/glucose", async (req, res) => {

    try {

        const {
            patient_id,
            reading_date,
            glucose_level,
            measurement_type
        } = req.body;


        if (
            !patient_id ||
            !reading_date ||
            !glucose_level ||
            !measurement_type
        ) {

            return res.status(400).json({

                error:
                    "All glucose fields are required"

            });

        }


        const [result] = await db.query(
            `
            INSERT INTO glucose_reading
            (
                patient_id,
                reading_date,
                glucose_level,
                measurement_type
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                patient_id,
                reading_date,
                glucose_level,
                measurement_type
            ]
        );


        res.status(201).json({

            message:
                "Glucose reading added successfully",

            reading_id:
                result.insertId

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to add glucose reading"

        });

    }

});


// ====================================================
// ANALYTICS API
// ====================================================


// ----------------------------------------------------
// GET PATIENT SUMMARY
// GET /api/patients/:id/summary
// ----------------------------------------------------

app.get("/api/patients/:id/summary", async (req, res) => {

    try {

        const patientId = req.params.id;

        const [rows] = await db.query(
            `
            SELECT

                ROUND(AVG(glucose_level), 2)
                    AS average_glucose,

                MAX(glucose_level)
                    AS highest_glucose,

                MIN(glucose_level)
                    AS lowest_glucose,

                COUNT(*)
                    AS total_readings

            FROM glucose_reading

            WHERE patient_id = ?
            `,
            [patientId]
        );


        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to calculate summary"

        });

    }

});


// ----------------------------------------------------
// ADVANCED ANALYTICS
// GET /api/patients/:id/analytics
// ----------------------------------------------------

app.get("/api/patients/:id/analytics", async (req, res) => {

    try {

        const patientId = req.params.id;


        // ---------------------------------------------
        // Overall statistics
        // ---------------------------------------------

        const [statistics] = await db.query(
            `
            SELECT

                ROUND(AVG(glucose_level), 2)
                    AS average,

                ROUND(STDDEV(glucose_level), 2)
                    AS standard_deviation,

                MIN(glucose_level)
                    AS minimum,

                MAX(glucose_level)
                    AS maximum,

                COUNT(*)
                    AS total

            FROM glucose_reading

            WHERE patient_id = ?
            `,
            [patientId]
        );


        // ---------------------------------------------
        // Average by measurement type
        // ---------------------------------------------

        const [measurementTypes] = await db.query(
            `
            SELECT

                measurement_type,

                COUNT(*) AS total_readings,

                ROUND(AVG(glucose_level), 2)
                    AS average_glucose,

                MIN(glucose_level)
                    AS minimum_glucose,

                MAX(glucose_level)
                    AS maximum_glucose

            FROM glucose_reading

            WHERE patient_id = ?

            GROUP BY measurement_type

            ORDER BY average_glucose DESC
            `,
            [patientId]
        );


        // ---------------------------------------------
        // Return combined analytics
        // ---------------------------------------------

        res.json({

            statistics:
                statistics[0],

            measurementTypes:
                measurementTypes

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to calculate analytics"

        });

    }

});


// ====================================================
// MEDICATION APIs
// ====================================================


// ----------------------------------------------------
// GET MEDICATIONS
// ----------------------------------------------------

app.get("/api/patients/:id/medications", async (req, res) => {

    try {

        const patientId = req.params.id;

        const [rows] = await db.query(
            `
            SELECT
                medication_id,
                medication_name,
                dosage,
                frequency,
                start_date,
                end_date
            FROM medication
            WHERE patient_id = ?
            ORDER BY start_date DESC
            `,
            [patientId]
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to retrieve medications"

        });

    }

});

// ADD MEDICATION
app.post("/api/medications", async (req, res) => {
    try {
        const {
            patient_id,
            medication_name,
            dosage,
            frequency,
            start_date,
            end_date
        } = req.body;

        if (!patient_id || !medication_name) {
            return res.status(400).json({
                error: "Patient and medication name are required"
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO medication
            (
                patient_id,
                medication_name,
                dosage,
                frequency,
                start_date,
                end_date
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                patient_id,
                medication_name,
                dosage || null,
                frequency || null,
                start_date || null,
                end_date || null
            ]
        );

        res.status(201).json({
            message: "Medication added successfully",
            medication_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to add medication"
        });
    }
});


// DELETE MEDICATION
app.delete("/api/medications/:id", async (req, res) => {
    try {
        const medicationId = req.params.id;

        const [result] = await db.query(
            `
            DELETE FROM medication
            WHERE medication_id = ?
            `,
            [medicationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Medication not found"
            });
        }

        res.json({
            message: "Medication deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete medication"
        });
    }
});

// ====================================================
// APPOINTMENT APIs
// ====================================================


// ----------------------------------------------------
// GET APPOINTMENTS
// ----------------------------------------------------

app.get("/api/patients/:id/appointments", async (req, res) => {

    try {

        const patientId = req.params.id;

        const [rows] = await db.query(
            `
            SELECT
                appointment_id,
                appointment_date,
                doctor_name,
                appointment_type,
                notes
            FROM appointment
            WHERE patient_id = ?
            ORDER BY appointment_date ASC
            `,
            [patientId]
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to retrieve appointments"

        });

    }

});

// ADD APPOINTMENT
app.post("/api/appointments", async (req, res) => {
    try {
        const {
            patient_id,
            appointment_date,
            doctor_name,
            appointment_type,
            notes
        } = req.body;

        if (!patient_id || !appointment_date) {
            return res.status(400).json({
                error: "Patient and appointment date are required"
            });
        }

        const [result] = await db.query(
            `
            INSERT INTO appointment
            (
                patient_id,
                appointment_date,
                doctor_name,
                appointment_type,
                notes
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                patient_id,
                appointment_date,
                doctor_name || null,
                appointment_type || null,
                notes || null
            ]
        );

        res.status(201).json({
            message: "Appointment added successfully",
            appointment_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to add appointment"
        });
    }
});


// DELETE APPOINTMENT
app.delete("/api/appointments/:id", async (req, res) => {
    try {
        const appointmentId = req.params.id;

        const [result] = await db.query(
            `
            DELETE FROM appointment
            WHERE appointment_id = ?
            `,
            [appointmentId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Appointment not found"
            });
        }

        res.json({
            message: "Appointment deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete appointment"
        });
    }
});

// ====================================================
// START SERVER
// ====================================================

app.listen(PORT, () => {

    console.log(
        `DiaTrack server running at http://localhost:${PORT}`
    );
});