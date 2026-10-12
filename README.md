# 🩺 DiaTrack
### Diabetes Glucose Monitoring System

**Track readings. Explore trends. Organize care.**

A full-stack web application built to demonstrate how a frontend, REST API, and relational database work together.

<br/>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

</div>

---

## ✨ Overview

DiaTrack is an educational glucose-monitoring dashboard for recording and reviewing blood glucose readings. It was developed as an academic **DBMS and full-stack web development project**, with an emphasis on relational data, REST APIs, SQL queries, and data visualization.

## 🚀 Features

| Feature | What it does |
|---|---|
| 👤 **Patient Management** | Add, view, select, and delete patient records |
| 🩸 **Glucose Tracking** | Record readings and review measurement history |
| 📈 **Visual Dashboard** | Explore glucose history using a Chart.js line chart |
| 🧮 **Glucose Analytics** | View average, minimum, maximum, reading count, and standard deviation |
| 💊 **Medication Records** | Add, view, and delete medication details |
| 📅 **Appointments** | Organize appointment dates, doctors, types, and notes |

## 🧰 Built With

- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **Backend:** Node.js and Express.js
- **Database:** MySQL
- **Database driver:** `mysql2`
- **Visualization:** Chart.js
- **Configuration:** `dotenv`

## 🏗️ How It Works

```text
🖥️ Frontend
HTML · CSS · JavaScript
        │
        │ Fetch API / HTTP requests
        ▼
⚙️ Backend
Node.js · Express REST API
        │
        │ SQL queries
        ▼
🗄️ Database
MySQL · glucose_monitor
```

The browser requests data from the Express API. The backend queries MySQL and returns JSON, which the frontend uses to update the dashboard, tables, and chart.

## ⚡ Run Locally

### 1. Requirements

Install [Node.js](https://nodejs.org/) and [MySQL](https://dev.mysql.com/downloads/).

### 2. Set up the database

Run `database/schema.sql` in MySQL Workbench to create the `glucose_monitor` database and its tables. Add synthetic sample records if you want to see populated dashboards.

### 3. Configure the backend

Create `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=glucose_monitor
PORT=5000
```

### 4. Install and start

Run these commands from the project root:

```bash
cd backend
npm install
node server.js
```

### 5. Open DiaTrack

Visit **[http://localhost:5000](http://localhost:5000)** in your browser.

## 🎯 Who Is It For?

DiaTrack is intended for **students and beginner developers** learning:

- Database Management Systems (DBMS)
- CRUD operations and relational database design
- REST API development with Express
- Connecting a JavaScript frontend to a MySQL backend
- Basic analytics and chart-based visualization

## 🗺️ Possible Next Steps

- 🔐 Authentication and role-based access
- 🔎 Search, filtering, and date-range reports
- 📱 Improved mobile responsiveness and accessibility
- 🧪 Automated API and database tests
- 📦 Reproducible sample-data seeding and deployment setup

## ⚠️ Important Note

DiaTrack is an **educational prototype** intended for synthetic/demo data. It is not a medical device, is not clinically validated, and must not be used to diagnose conditions or guide treatment. Do not commit real patient data, database passwords, or your `.env` file to GitHub.

---

<div align="center">

**Built to learn full-stack development through a healthcare-inspired project.** 💙

</div>
"""
path = Path("/mnt/data/README.md")
path.write_text(content, encoding="utf-8")
print(f"Updated {path}")
