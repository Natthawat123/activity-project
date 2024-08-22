import mysql from 'mysql2'

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "activitydb"
})
export default db

//testdddd