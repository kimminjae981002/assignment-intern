const jwt = require("jsonwebtoken");

// JWT 토큰 생성 함수
const generateToken = (user) => {
  const accessToken = jwt.sign(
    { username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m", // Access Token 유효 기간
    }
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d", // Refresh Token 유효 기간
    }
  );

  return { accessToken, refreshToken };
};

module.exports = {
  generateToken,
};
