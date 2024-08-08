# env

ACCESS_TOKEN_SECRET: JWT ACCESS SECRET KEY
REFRESH_TOKEN_SECRET: JWT REFRESH SECRET KEY

# Swagger

http://3.35.242.127/api-docs

# [한 달 인턴] Node.js 과제

### Requirements

■ Jest를 이용한 테스트 코드 작성법 이해
유닛테스트 - 로그인 / 회원가입 구현 완료(2024/08/07)

■ Express.js와 Middleware에 대한 이해
Express 구조 완료(2024/08/07)
유저 권한 미들웨어 구현 완료(2024/08/07)

■ JWT와 구체적인 알고리즘의 이해
JWT를 이용한 로그인, accessToken - refreshToken 구현 완료(2024/08/07)

■ Swagger UI로 접속 가능하게 하기
2024/08/07 구현 완료

■ AI(GPT)에게 코드리뷰 받아보기
내용 - 회원가입 부분 유효성 검사 추가
2024/08/07 구현 완료

■ 리뷰 바탕으로 개선하기(피드백)
2024/08/10 예정

■ EC2에 배포해보기

### 시나리오 설계 및 코딩 시작!

##### Middleware란 무엇인가?(with Interceptor, AOP)

Middleware

- 애플리케이션의 요청-응답 주기에서 요청 객체(req), 응답 객체(res), ** next() 미들웨어 함수에 접근할 수 있는 기능이다. **
  요청과 응답을 처리하는 중간 단계에서 특정 작업을 수행하거나, 요청을 변형하거나, 응답을 가공하는 역할을 한다.
  next() 함수를 이용해 다음 미들웨어 또는 함수로 이동할 수 있다.

- 기능

1. 인증 밎 권한 부여
2. 로깅
3. 요청 변형
4. 응답 변형
5. 에러 처리

Interceptor

- 특정 메소드 호출 전후에 동작을 삽입할 수 있는 메커니즘을 제공한다. 예를 들어, 메소드 호출 전후에 로깅을 추가하거나, 메소드가
  호출되지 않도록 막을 수 있다. 주로 java의 spring에서 사용한다.

AOP

- 프로그램의 특정 관심사(Aspect)를 모듈화하여 코드의 중복을 줄이고 관심사를 분리하는 방법입니다. AOP의 핵심 개념은 Advice, Join Point, Pointcut, Aspect입니다.

##### Express.js란?

- Express는 웹 및 모바일 애플리케이션을 위한 일련의 강력한 기능을 제공하는 간결하고 유연한 Node.js 웹 애플리케이션 프레임워크이다.
  대안으로는 Typescript 기반의 NestJS가 있다.

  Express의 장점은 간단한 API와 구조 덕분에 배우기 쉽고, 빠르게 프로젝트를 시작할 수 있습니다.
  단점으로는 대규모 애플리케이션에는 코드 구조와 유지 보수가 어려울 수 있습니다.

##### JWT란 무엇인가요?

- JWT는 정보를 안전하게 전할 때 혹은 유저의 권한 같은 것을 체크하기 위해서 사용되는 모듈이다.
- JWT는 .을 기준으로 3등분으로 나뉘어져 있다.
  Header: 토큰에 대한 메타 데이터를 포함
  Payload: 유저 정보, 만료 기간, 주제 등등을 포함
  Verify Signature: 변경이 되었는지, 안 되었는지 확인하는 데 사용되는 서명

- 동작방식은 서버에서 요청된 header와 payload를 가져오고,
  서버 안에 가지고 있는 secret key를 이용해 signature부분을 다시 생성하고 일치할때 통과가 됩니다.

##### 토큰 발행과 유효성 확인

1. 사용자가 로그인을 시도한다.

- 서버에서는 로그인 회원을 DB에서 찾는다.

2. 로그인이 완료되면 AccessToken과 RefreshToken이 발급된다.

- 회원 DB 또는 쿠키에 RefreshToken을 저장한다.
- 보통 RefreshToken은 하루, AccessToken은 짧게 준다.
  AccessToken은 탈취 가능성이 있어 시간을 짧게 둔다. 애플리케이션 마다 기간은 다 다르다.
  중요한 애플리케이션이면 RefreshToken도 짧게 둔다.

3. 사용자가 RefreshToken을 저장 후, 서버에 요청을 보낼 때 AccessToken을 헤더에 실어 요청을 보낸다.
4. Access Token을 서버에서 검증하게되며 맞는 Token이라면 요청한 데이터를 보내준다.
5. Access Token의 유효기간이 만료되었을 때 요청을 보낸다.
6. Access Token의 유효기간이 만료되었을 때 권한 없음 에러를 보낸다.
7. 사용자는 RefreshToken도 서버로 보내며 AccessToken 발급 요청을 한다.
8. RefreshToken이 동일하고 유효기간도 지나지 않았다면 AccessToken을 새로 발급한다.

##### Jest란?

- 페이스북에서 개발한 자바스크립트 테스트 프레임워크

##### 유닛 테스트란?

- 개발자가 수행하고 자신이 개발 한 코드 단위(모듈, 함수)를 테스트 한다.
- 사용자의 관점에서 비즈니스 로직을 테스트하는 목적
- 독립적이어야 하며, 어떤 테스트도 다른 테스트에 의존하지 않아야 한다.
