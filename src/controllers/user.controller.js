const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();
// 회원가입
// db 이용
const users = [];
const signup = async (req, res) => {
  const { username, password, confirmPassword, nickname } = req.body;
  // db접근하기 때문에 어러처리는 위로 가야된다.
  // db 접근은 최대한 적게

  if (username.length < 3 || username.length > 10) {
    throw new Error("사용자명은 3글자 이상 10글자 이하이어야 합니다.");
  }

  if (!password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#])[A-Za-z\d!@#]{6,}$/)) {
    throw new Error(
      "비밀번호는 최소 6자리로 한글, 영문, 숫자, 특수문자(!, @, #)를 포함해야 합니다."
    );
  }

  if (nickname.length < 5 || nickname.length > 20) {
    throw new Error("별명은 5글자 이상 20글자 이하이어야 합니다.");
  }

  if (password !== confirmPassword) {
    throw new Error("비밀번호가 다릅니다.");
  }

  // 배열에서 username이 같다면 true 반환
  const existingUser = users.some((user) => {
    return user.username === username;
  });

  // 배열에서 nickname이 같다면 true 반환
  const existingUserNickname = users.some((user) => {
    return user.nickname === nickname;
  });

  if (existingUserNickname) {
    throw new Error("이미 사용 중인 별명입니다.");
  }

  if (existingUser) {
    throw new Error("이미 사용 중인 사용자명입니다.");
  }

  const hashedPassword = await bcrypt.hash(password, +process.env.saltRounds);

  users.push({ username, password: hashedPassword, nickname });

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

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => {
    return user.username === username;
  });

  if (!user) {
    throw new Error("회원가입을 진행해주세요.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("비밀번호가 틀렸습니다.");
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
