const request = require("supertest");
const app = require("../app");

let server;

beforeAll((done) => {
  server = app.listen(3001, () => {
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe("POST /signup", () => {
  it("비밀번호 체크 테스트", async () => {
    const response = await request(app).post("/signup").send({
      username: "testuser",
      password: "Password1!@",
      confirmPassword: "DifferentPassword!",
      nickname: "testnick",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("비밀번호가 다릅니다.");
  });

  it("사용자명 길이 테스트", async () => {
    const response = await request(app).post("/signup").send({
      username: "asasdasasdd",
      password: "Password1!",
      confirmPassword: "Password1!",
      nickname: "testnick",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "사용자명은 3글자 이상 10글자 이하이어야 합니다."
    );
  });

  it("비밀번호 유효성 테스트", async () => {
    const response = await request(app).post("/signup").send({
      username: "testuser",
      password: "pass",
      confirmPassword: "pass",
      nickname: "testnick",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "비밀번호는 최소 6자리로 한글, 영문, 숫자, 특수문자(!, @, #)를 포함해야 합니다."
    );
  });

  it("별명 길이 테스트", async () => {
    const response = await request(app).post("/signup").send({
      username: "testuser",
      password: "Password1!",
      confirmPassword: "Password1!",
      nickname: "mjm",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "별명은 5글자 이상 20글자 이하이어야 합니다."
    );
  });

  it("사용자명 중복 테스트", async () => {
    await request(app).post("/signup").send({
      username: "existing",
      password: "Password1!",
      confirmPassword: "Password1!",
      nickname: "testnick",
    });

    const response = await request(app).post("/signup").send({
      username: "existing",
      password: "Password1!",
      confirmPassword: "Password1!",
      nickname: "newnick",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("이미 사용 중인 사용자명입니다.");
  });

  it("별명 중복 테스트", async () => {
    await request(app).post("/signup").send({
      username: "newuser",
      password: "Password1!",
      confirmPassword: "Password1!",
      nickname: "nicknink",
    });

    const response = await request(app).post("/signup").send({
      username: "another",
      password: "Password1!",
      confirmPassword: "Password1!",
      nickname: "nicknink",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("이미 사용 중인 별명입니다.");
  });

  it("회원가입 테스트", async () => {
    const response = await request(app).post("/signup").send({
      username: "testus",
      password: "Password1!",
      confirmPassword: "Password1!",
      nickname: "testni",
    });

    // 상태 코드가 201이 돼야 한다.
    expect(response.status).toBe(201);

    // 속성을 갖고 있나 확인한다.
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toHaveProperty("username", "testus");
    expect(response.body.message).toHaveProperty("nickname", "testni");
    expect(response.body.message).toHaveProperty("authorities");

    expect(response.body.message.authorities).toEqual([
      { authorityName: "ROLE_USER" },
    ]);
  });
});
