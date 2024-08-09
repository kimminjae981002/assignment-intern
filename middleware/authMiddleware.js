const jwt = require("jsonwebtoken");
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

module.exports = {
  authMiddleware,
};
