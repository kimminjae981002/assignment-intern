const cors = require("cors");

// CORS 설정
const corsOptions = {
  origin: "http://localhost:3000", // 클라이언트 주소
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

module.exports = cors(corsOptions);
