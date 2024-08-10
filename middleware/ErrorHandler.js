const ErrorHandler = (err, req, res, next) => {
  console.log("에러처리 미들웨어 구동중 입니다.=>", err);
  const errorCodeMap = {
    "사용자명은 3글자 이상 10글자 이하이어야 합니다.": 400,
    "비밀번호는 최소 6자리로 한글, 영문, 숫자, 특수문자(!, @, #)를 포함해야 합니다.": 400,
    "별명은 5글자 이상 20글자 이하이어야 합니다.": 400,
    "이미 사용 중인 사용자명입니다.": 400,
    "이미 사용 중인 별명입니다.": 400,
    "회원가입을 진행해주세요.": 400,
    "비밀번호가 틀렸습니다.": 400,
    "비밀번호가 다릅니다.": 400,
  };

  const errorCode = errorCodeMap[err.message];
  if (errorCode)
    return res.status(errorCode).json({ success: false, message: err.message });

  return res.status(500).json({
    success: false,
    message: "연결에 실패하였습니다. 잠시 후 다시 시도해 주십시오.",
  });
};

module.exports = { ErrorHandler };
