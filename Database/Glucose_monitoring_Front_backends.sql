CREATE DATABASE diabetes_monitor;
USE diabetes_monitor;
SHOW DATABASES;
SELECT DATABASE();

CREATE TABLE patient(patient_id INT AUTO_INCREMENT PRIMARY KEY, 
	first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(15),
    email VARCHAR(100),
    diagnosis_date date
);

SHOW TABLES;
DESC patient;

CREATE TABLE glucose_reading(
	reading_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    reading_date DATETIME NOT NULL,
    glucose_level DECIMAL(5,2) NOT NULL,
    measurement_type VARCHAR(30),
    FOREIGN KEY(patient_id) REFERENCES patient(patient_id)
);

SHOW TABLES;
DESC glucose_reading;

CREATE TABLE medication(
	medication_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);

SHOW TABLES;
DESC medication;

CREATE TABLE appointment(
	appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    doctor_name VARCHAR(100),
    appointment_type VARCHAR(50),
    notes VARCHAR(500),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);

SHOW TABLES;

DESC patient;
DESC glucose_reading;
DESC medication;
DESC appointment;

INSERT INTO patient
(first_name, last_name, date_of_birth, gender, phone, email, diagnosis_date)
VALUES
('Rahul', 'Sharma', '1995-04-12', 'Male',
 '9876543210', 'rahul@example.com', '2022-06-15'),
('Priya', 'Nair', '1990-08-25', 'Female',
 '9876543211', 'priya@example.com', '2021-03-10'),
('Arjun', 'Menon', '1987-12-03', 'Male',
 '9876543212', 'arjun@example.com', '2020-11-20'),
('Ananya', 'Rao', '1998-02-17', 'Female',
 '9876543213', 'ananya@example.com', '2023-01-05'),
('Vikram', 'Iyer', '1982-07-30', 'Male',
 '9876543214', 'vikram@example.com', '2019-09-12'),
('Sneha', 'Krishnan', '1993-11-21', 'Female',
 '9876543215', 'sneha@example.com', '2022-02-18'),
('Karthik', 'Reddy', '1989-05-14', 'Male',
 '9876543216', 'karthik@example.com', '2020-05-11'),
('Meera', 'Joshi', '1996-09-08', 'Female',
 '9876543217', 'meera@example.com', '2024-01-20'),
('Aditya', 'Patel', '1985-03-19', 'Male',
 '9876543218', 'aditya@example.com', '2018-08-14'),
('Divya', 'Shah', '1991-06-27', 'Female',
 '9876543219', 'divya@example.com', '2021-12-02');
 
 SELECT * FROM patient;
 
INSERT INTO glucose_reading
(patient_id, reading_date, glucose_level, measurement_type)
VALUES
(1, '2026-10-01 07:30:00', 112, 'Fasting'),
(1, '2026-10-01 13:00:00', 148, 'Post Lunch'),
(1, '2026-10-01 20:00:00', 135, 'Post Dinner'),

(1, '2026-10-02 07:30:00', 108, 'Fasting'),
(1, '2026-10-02 13:00:00', 142, 'Post Lunch'),
(1, '2026-10-02 20:00:00', 130, 'Post Dinner'),

(1, '2026-10-03 07:30:00', 115, 'Fasting'),
(1, '2026-10-03 13:00:00', 151, 'Post Lunch'),
(1, '2026-10-03 20:00:00', 138, 'Post Dinner'),

(1, '2026-10-04 07:30:00', 110, 'Fasting'),
(1, '2026-10-04 13:00:00', 145, 'Post Lunch'),
(1, '2026-10-04 20:00:00', 132, 'Post Dinner');

SELECT * FROM glucose_reading;

INSERT INTO glucose_reading
(patient_id, reading_date, glucose_level, measurement_type)
VALUES
(2, '2026-10-01 07:30:00', 126, 'Fasting'),
(2, '2026-10-01 13:00:00', 155, 'Post Lunch'),
(2, '2026-10-01 20:00:00', 142, 'Post Dinner'),
(2, '2026-10-02 07:30:00', 120, 'Fasting'),
(2, '2026-10-02 13:00:00', 149, 'Post Lunch'),
(2, '2026-10-02 20:00:00', 139, 'Post Dinner');

SELECT * FROM glucose_reading;

INSERT INTO glucose_reading
(patient_id, reading_date, glucose_level, measurement_type)
VALUES
(3, '2026-10-01 07:30:00', 118, 'Fasting'),
(3, '2026-10-01 13:00:00', 146, 'Post Lunch'),
(3, '2026-10-02 07:30:00', 121, 'Fasting'),
(3, '2026-10-02 13:00:00', 150, 'Post Lunch'),
(4, '2026-10-01 07:30:00', 105, 'Fasting'),
(4, '2026-10-01 13:00:00', 136, 'Post Lunch'),
(4, '2026-10-02 07:30:00', 109, 'Fasting'),
(4, '2026-10-02 13:00:00', 140, 'Post Lunch'),
(5, '2026-10-01 07:30:00', 130, 'Fasting'),
(5, '2026-10-01 13:00:00', 160, 'Post Lunch'),
(5, '2026-10-02 07:30:00', 127, 'Fasting'),
(5, '2026-10-02 13:00:00', 157, 'Post Lunch'),
(6, '2026-10-01 07:30:00', 116, 'Fasting'),
(6, '2026-10-01 13:00:00', 144, 'Post Lunch'),
(7, '2026-10-01 07:30:00', 135, 'Fasting'),
(7, '2026-10-01 13:00:00', 170, 'Post Lunch'),
(8, '2026-10-01 07:30:00', 102, 'Fasting'),
(8, '2026-10-01 13:00:00', 132, 'Post Lunch'),
(9, '2026-10-01 07:30:00', 128, 'Fasting'),
(9, '2026-10-01 13:00:00', 162, 'Post Lunch'),
(10, '2026-10-01 07:30:00', 119, 'Fasting'),
(10, '2026-10-01 13:00:00', 147, 'Post Lunch');

SELECT * FROM glucose_reading;

SELECT COUNT(*) as No_of_readings
FROM glucose_reading;

-- this particular code must fail because of foreign key \
INSERT INTO glucose_reading
(patient_id, reading_date, glucose_level, measurement_type)
VALUES
(999, '2026-10-05 08:00:00', 120, 'Fasting');

INSERT INTO medication
(patient_id, medication_name, dosage, frequency, start_date)
VALUES
(1, 'Metformin', '500 mg', 'Twice daily', '2022-06-20'),
(2, 'Metformin', '500 mg', 'Once daily', '2021-03-15'),
(3, 'Insulin Glargine', '10 units', 'Once daily', '2020-12-01'),
(4, 'Metformin', '500 mg', 'Once daily', '2023-01-10'),
(5, 'Glimepiride', '2 mg', 'Once daily', '2019-09-20'),
(6, 'Metformin', '500 mg', 'Twice daily', '2022-02-20'),
(7, 'Insulin Aspart', '8 units', 'Before meals', '2020-06-01'),
(8, 'Metformin', '500 mg', 'Once daily', '2024-02-01'),
(9, 'Metformin', '500 mg', 'Twice daily', '2018-08-20'),
(10, 'Metformin', '500 mg', 'Once daily', '2021-12-10');

SELECT * FROM medication;

INSERT INTO appointment
(patient_id, appointment_date, doctor_name, appointment_type, notes)
VALUES
(1, '2026-10-10 10:00:00',
 'Dr. Mehta', 'Routine Checkup',
 'Review glucose trend'),

(2, '2026-10-12 11:30:00',
 'Dr. Sharma', 'Follow-up',
 'Review medication response'),

(3, '2026-10-14 09:30:00',
 'Dr. Kumar', 'Routine Checkup',
 'Review insulin dosage'),

(4, '2026-10-16 14:00:00',
 'Dr. Rao', 'Follow-up',
 'Review glucose readings'),

(5, '2026-10-18 16:00:00',
 'Dr. Iyer', 'Routine Checkup',
 'General diabetes review'),

(6, '2026-10-20 10:30:00',
 'Dr. Mehta', 'Follow-up',
 'Review glucose trend'),

(7, '2026-10-22 12:00:00',
 'Dr. Kumar', 'Routine Checkup',
 'Medication review'),

(8, '2026-10-24 15:00:00',
 'Dr. Rao', 'Follow-up',
 'Review recent readings'),

(9, '2026-10-26 11:00:00',
 'Dr. Sharma', 'Routine Checkup',
 'General review'),

(10, '2026-10-28 09:00:00',
 'Dr. Mehta', 'Follow-up',
 'Review glucose trend');
 
 SELECT * FROM appointment;
 
 -- display all patients
 SELECT * FROM patient;
 
 -- find one patient
 SELECT * FROM patient WHERE patient_id = 1;
 
 -- find patient_id 1's readings
 SELECT * FROM glucose_reading WHERE patient_id = 1;
 
 -- sort readings
 SELECT * FROM glucose_reading 
 WHERE patient_id = 1
 ORDER BY reading_date DESC;
 
 -- patient details and glucose readings join
 SELECT
    p.first_name,
    p.last_name,
    g.reading_date,
    g.glucose_level,
    g.measurement_type
FROM patient p
JOIN glucose_reading g
ON p.patient_id = g.patient_id
WHERE p.patient_id = 1
ORDER BY g.reading_date;

-- average glucose reading per patient
SELECT
    p.patient_id,
    p.first_name,
    p.last_name,
    ROUND(AVG(g.glucose_level), 2) AS average_glucose
FROM patient p
JOIN glucose_reading g
ON p.patient_id = g.patient_id
GROUP BY
    p.patient_id,
    p.first_name,
    p.last_name;
    
-- highest glucose per patient
SELECT 
	p.first_name,
    p.last_name,
    MAX(g.glucose_level) AS highest_glucose
FROM patient p
JOIN glucose_reading g
ON p.patient_id = g.patient_id
GROUP BY
	p.patient_id,
    p.first_name,
    p.last_name;
    
-- count reading
SELECT 
	p.patient_id,
    p.first_name,
    p.last_name,
    COUNT(g.reading_id) AS total_readings
FROM patient p
LEFT JOIN glucose_reading g
ON p.patient_id = g.patient_id
GROUP BY
	p.patient_id,
    p.first_name,
    p.last_name;

-- readings above 180
SELECT * FROM glucose_reading
WHERE glucose_level > 150;

-- join patients with their medications
SELECT
    p.first_name,
    p.last_name,
    m.medication_name,
    m.dosage,
    m.frequency
FROM patient p
JOIN medication m
ON p.patient_id = m.patient_id;

-- join patients with appointments
SELECT
    p.first_name,
    p.last_name,
    a.appointment_date,
    a.doctor_name,
    a.appointment_type
FROM patient p
JOIN appointment a
ON p.patient_id = a.patient_id
ORDER BY a.appointment_date;

-- main dashboard
SELECT
    p.patient_id,
    p.first_name,
    p.last_name,
    p.gender,
    p.date_of_birth,
    p.email,
    p.phone
FROM patient p
WHERE p.patient_id = 1;

SELECT
    reading_date,
    glucose_level,
    measurement_type
FROM glucose_reading
WHERE patient_id = 1
ORDER BY reading_date DESC;

SELECT
    medication_name,
    dosage,
    frequency,
    start_date,
    end_date
FROM medication
WHERE patient_id = 1;

SELECT
    appointment_date,
    doctor_name,
    appointment_type,
    notes
FROM appointment
WHERE patient_id = 1
ORDER BY appointment_date;