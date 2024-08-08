const request = require("supertest");
const app = require("../app");

describe("POST /login", () => {
  it("로그인 성공 테스트", async () => {
    await request(app).post("/signup").send({
      username: "testuser",
      password: "Password1!",
      confirmPassword: "Password1!",
      nickname: "testnick",
    });

    const response = await request(app).post("/login").send({
      username: "testuser",
      password: "Password1!",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("로그인 실패 테스트 - 잘못된 비밀번호", async () => {
    await request(app).post("/signup").send({
      username: "testuser",
      password: "Password1!",
      confirmPassword: "Password1!",
      nickname: "testnick",
    });

    const response = await request(app).post("/login").send({
      username: "testuser",
      password: "WrongPassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("비밀번호가 틀렸습니다.");
  });

  it("로그인 실패 테스트 - 존재하지 않는 사용자", async () => {
    const response = await request(app).post("/login").send({
      username: "noneUser",
      password: "Password1!",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("회원가입을 진행해주세요.");
  });
});
