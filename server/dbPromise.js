import mysql from 'mysql2/promise';

const dbPromise = mysql.createPool({
    // host: "localhost",
    // user: "root",
    // password: "",
    // database: "activitydb"
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
});

export default dbPromise;
