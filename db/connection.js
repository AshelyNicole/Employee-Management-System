const util = require("util")
const mysql = require("mysql")

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "dbemployees"
})

connection.connect()

connection.query = util.promisfy(connection.query)

module.exports = connection;