const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const users = [];

app.post("/signup", (req, res) => {
  const { username, password, confirmPassword, nickname } = req.body;

  // 배열에서 username이 같다면 true 반환
  const existingUser = users.some((user) => {
    user.username === username;
  });

  // 배열에서 nickname이 같다면 true 반환
  const existingUserNickname = users.some((user) => {
    user.nickname === nickname;
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

  return res.status(201).json({ message: "회원 가입이 완료되었습니다." });
});

app.listen(PORT, (req, res) => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
