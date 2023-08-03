var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "coffee",
});

connection.connect((err) => {
  if (err) console.log("Connection error");
});

module.exports = connection;
