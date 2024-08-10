const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결에 실패했습니다:", err);
    process.exit(1);
  }
  console.log("MySQL에 성공적으로 연결되었습니다.");
});

module.exports = connection;
