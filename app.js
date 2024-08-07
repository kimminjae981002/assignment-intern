const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 회원가입
const users = [];

app.post("/signup", (req, res) => {
  const { username, password, confirmPassword, nickname } = req.body;

  // 배열에서 username이 같다면 true 반환
  const existingUser = users.some((user) => {
    return user.username === username;
  });

  // 배열에서 nickname이 같다면 true 반환
  const existingUserNickname = users.some((user) => {
    return user.nickname === nickname;
  });

  if (existingUser) {
    console.log("사용하고 있는 username입니다.");
    return res.status(400).json({ message: "이미 사용 중인 사용자명입니다." });
  }

  if (existingUserNickname) {
    console.log("사용하고 있는 nickname입니다.");
    return res.status(400).json({ message: "이미 사용 중인 별명입니다." });
  }

  if (password !== confirmPassword) {
    console.log("비밀번호를 확인해주세요.");
    return res.status(400).json({ message: "비밀번호가 다릅니다." });
  }

  users.push({ username, password, nickname });

  return res.status(201).json({
    message: {
      username: "minjae",
      nickname: "mjmj",
      authorities: [
        {
          authorityName: "ROLE_USER",
        },
      ],
    },
  });
});

// jwt 로그인
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => {
    return user.username === username;
  });

  if (!user) {
    console.log("회원가입을 진행해주세요.");
    return res.status(400).json({ message: "회원가입을 진행해주세요." });
  }

  if (user.password !== password) {
    console.log("비밀번호가 틀렸습니다.");
    return res.status(400).json({ message: "비밀번호가 틀렸습니다." });
  }

  return res.status(201).json({ message: "로그인이 되었습니다." });
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["src/routes/user.router.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, (req, res) => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
