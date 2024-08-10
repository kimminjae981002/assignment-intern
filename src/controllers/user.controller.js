const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { connection } = require("../../config/database");

const { generateToken } = require("../../utils/jwt");

dotenv.config();
// 회원가입

const signup = async (req, res, next) => {
  const { username, password, confirmPassword, nickname } = req.body;
  // db접근하기 때문에 어러처리는 위로 가야된다.
  // db 접근은 최대한 적게

  if (username.length < 3 || username.length > 10) {
    return next(new Error("사용자명은 3글자 이상 10글자 이하이어야 합니다."));
  }

  if (!password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#])[A-Za-z\d!@#]{6,}$/)) {
    return next(
      new Error(
        "비밀번호는 최소 6자리로 한글, 영문, 숫자, 특수문자(!, @, #)를 포함해야 합니다."
      )
    );
  }

  if (nickname.length < 5 || nickname.length > 20) {
    return next(new Error("별명은 5글자 이상 20글자 이하이어야 합니다."));
  }

  if (password !== confirmPassword) {
    return next(new Error("비밀번호가 다릅니다."));
  }

  const [existingUsername] = await connection
    .promise()
    .query("SELECT * FROM users WHERE username = ? ", [username]);

  if (existingUsername.length > 0) {
    return next(new Error("이미 사용 중인 사용자명입니다."));
  }

  const [existingNickname] = await connection
    .promise()
    .query("SELECT * FROM users WHERE nickname = ? ", [nickname]);

  if (existingNickname.length > 0) {
    return next(new Error("이미 사용 중인 별명입니다."));
  }

  const hashedPassword = await bcrypt.hash(password, +process.env.saltRounds);

  await connection
    .promise()
    .query(
      "INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)",
      [username, hashedPassword, nickname]
    );

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
};

// jwt 로그인
// db 이용
const refreshTokens = [];

const login = async (req, res, next) => {
  const { username, password } = req.body;

  const [user] = await connection
    .promise()
    .query("SELECT * FROM users WHERE username = ?", [username]);

  if (!user[0]) {
    return next(new Error("회원가입을 진행해주세요."));
  }

  const isMatch = await bcrypt.compare(password, user[0].password);

  if (!isMatch) {
    return next(new Error("비밀번호가 틀렸습니다."));
  }

  const { accessToken, refreshToken } = generateToken(user);

  refreshTokens.push(refreshToken);

  // refreshToken을 cookie에 넣기(클라이언트가 갖고 있는다.)
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax", // 'Strict' , 'Lax' , 'None' 3가지
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ token: accessToken });
};

const posts = [
  { username: "minjae", title: "post 1" },
  { username: "minji", title: "post 2" },
];

// 사용자 미들웨어를 이용해서 가져오기
const getPosts = (req, res) => {
  res.json(posts);
};

// refresh를 이용해서 accessToken 재생성
const refreshToken = (req, res) => {
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
};

module.exports = {
  signup,
  login,
  getPosts,
  refreshToken,
};
