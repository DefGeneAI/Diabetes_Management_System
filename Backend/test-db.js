const db = require("./db");

async function testDatabase() {
    try {

        const [rows] = await db.query("SHOW TABLES");

        console.log("Database connection successful!");
        console.log("Tables in glucose_monitor:");

        console.table(rows);

    } catch (error) {

        console.error("Database connection failed:");
        console.error(error.message);

    }
}

testDatabase();