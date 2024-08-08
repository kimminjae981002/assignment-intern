const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 설정
const corsOptions = {
  origin: "http://3.35.242.127", // 클라이언트 주소
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

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
    components: {
      securitySchemes: {
        jwtAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        jwtAuth: [],
      },
    ],
  },
  apis: ["src/routes/user.router.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 회원가입
// db 이용
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

  if (username.length < 3 || username.length > 10) {
    return res
      .status(400)
      .json({ message: "사용자명은 3글자 이상 10글자 이하이어야 합니다." });
  }

  if (!password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#])[A-Za-z\d!@#]{6,}$/)) {
    return res.status(400).json({
      message:
        "비밀번호는 최소 6자리로 한글, 영문, 숫자, 특수문자(!, @, #)를 포함해야 합니다.",
    });
  }

  if (nickname.length < 5 || nickname.length > 20) {
    return res
      .status(400)
      .json({ message: "별명은 5글자 이상 20글자 이하이어야 합니다." });
  }

  if (existingUser) {
    return res.status(400).json({ message: "이미 사용 중인 사용자명입니다." });
  }

  if (existingUserNickname) {
    return res.status(400).json({ message: "이미 사용 중인 별명입니다." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "비밀번호가 다릅니다." });
  }

  users.push({ username, password, nickname });

  return res.status(201).json({
    message: {
      username,
      nickname,
      authorities: [
        {
          authorityName: "ROLE_USER",
        },
      ],
    },
  });
});

// jwt 로그인
// db 이용
const refreshTokens = [];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => {
    return user.username === username;
  });

  if (!user) {
    return res.status(400).json({ message: "회원가입을 진행해주세요." });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "비밀번호가 틀렸습니다." });
  }

  // jwt 토큰 생성
  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });

  const refreshToken = jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  refreshTokens.push(refreshToken);

  // refreshToken을 cookie에 넣기(클라이언트가 갖고 있는다.)
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ token: accessToken });
});

// 사용자 미들웨어
function authMiddleware(req, res, next) {
  // 토큰을 request headers에서 가져오기
  const authHeader = req.headers.authorization;

  // Beare 토큰
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  // 토큰이 있으면 유효한 토큰인지 확인
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    // authMiddleware를 실행하는 곳에서 req.user를 실행하면 payload값을 가져올 수 있다.
    next();
  });
}

const posts = [
  { username: "jon", title: "post 1" },
  { username: "han", title: "post 2" },
];

// 사용자 미들웨어를 이용해서 가져오기
app.get("/posts", authMiddleware, (req, res) => {
  res.json(posts);
});

// refresh를 이용해서 accessToken 재생성
app.get("/refresh", (req, res) => {
  // cookie-parser를 이용해 req.cookies 쿠키를 불러올 수 있다.
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  // refreshToken이 없다면 에러
  if (!refreshTokens.includes(refreshToken)) {
    return res.sendStatus(403);
  }

  // refreshToken이 있다면 accessToken을 새로 생성해준다.
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30s",
      }
    );

    res.json({ token: accessToken });
  });
});

// 테스트를 위해 export
module.exports = app;

// main 모듈일 때만 실행 중복 실행 방지
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
  });
}
