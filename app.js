const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { corsOptions } = require("./config/cors");
const { swaggerUi, swaggerUiOptions, specs } = require("./config/swagger");
const { ErrorHandler } = require("./middleware/ErrorHandler");

const userRouter = require("./src/routes/user.router");

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

app.use("/api", userRouter);

// 테스트를 위해 export
module.exports = app;

app.use(ErrorHandler);

// main 모듈일 때만 실행 중복 실행 방지
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
  });
}
