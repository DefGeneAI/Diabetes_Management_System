DiaTrack is a simple web application for recording and reviewing blood glucose readings. It was built as an academic DBMS and full-stack project to demonstrate how a frontend, backend, and MySQL database work together.

## Features

- Manage patient records
- Record and view glucose readings
- Visualize glucose history with a line chart
- View summary statistics and measurement-type averages
- Add and delete medications
- Manage appointments

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Charting:** Chart.js

## How It Works

The frontend sends requests to a Node.js/Express REST API. The backend runs SQL queries against MySQL and returns JSON data for the dashboard, tables, and charts.

```text
HTML / CSS / JavaScript → Express REST API → MySQL
```

## Run Locally

1. Install Node.js and MySQL.
2. Create the `glucose_monitor` database and tables using `database/schema.sql`.
3. In `backend/.env`, configure your database connection:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_PASSWORD
   DB_NAME=glucose_monitor
   PORT=5000
   ```

4. Install backend dependencies and start the server:

   ```bash
   cd backend
   npm install
   node server.js
   ```

5. Open [http://localhost:5000](http://localhost:5000).

## Who Is It For?

Designed for students and beginners learning database management, REST APIs, and full-stack web development. It demonstrates CRUD operations, relational data, SQL analytics, and frontend–backend integration.

## Note

This is an educational prototype intended for synthetic/demo data only. It is **not** a medical device and should not be used for diagnosis or treatment decisions. Do not commit real patient data or your `.env` file to GitHub.
"""
path = Path("/mnt/data/README.md")
path.write_text(content, encoding="utf-8")
print(f"Created {path}")
