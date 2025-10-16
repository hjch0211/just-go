# Just-Go

브라우저 이벤트 기반 고객사 서비스 자동 가이드 시스템

rrweb을 활용하여 사용자의 브라우저 세션을 기록하고 재생할 수 있는 시스템입니다.

## 프로젝트 구조

```
just-go/
├── just-go-fe/          # Frontend (React + Vite + TypeScript)
│   ├── src/
│   └── package.json
├── just-go-be/          # Backend (NestJS + MongoDB)
│   ├── src/
│   └── package.json
└── package.json         # Root workspace configuration
```

## 기술 스택

### Frontend
- React 19 + TypeScript
- Vite
- TailwindCSS
- rrweb + rrweb-player
- React Router
- Axios
- Zustand

### Backend
- NestJS + TypeScript
- MongoDB + Mongoose
- Passport.js + JWT
- Class-validator

## 시작하기

### 사전 요구사항
- Node.js >= 18
- Yarn
- Docker & Docker Compose (MongoDB 실행용)

### 설치

```bash
# 루트에서 모든 의존성 설치
yarn install
```

### MongoDB 실행 (Docker)

```bash
# MongoDB 실행
docker-compose up -d

# MongoDB: localhost:27017

# 중지
docker-compose down

# 데이터까지 삭제하고 중지
docker-compose down -v
```

### 환경 변수 설정

**Frontend (just-go-fe/.env)**
```env
VITE_API_URL=http://localhost:3000
```

**Backend (just-go-be/.env)**
```env
PORT=3000
MONGODB_URI=mongodb://admin:admin123@localhost:27017/just-go?authSource=admin
JWT_SECRET=dev-secret-key-please-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 개발 서버 실행

```bash
# Frontend 개발 서버 (http://localhost:5173)
yarn dev:fe

# Backend 개발 서버 (http://localhost:3000)
yarn dev:be
```

### 빌드

```bash
# Frontend 빌드
yarn build:fe

# Backend 빌드
yarn build:be

# 전체 빌드
yarn build
```

## 주요 기능

1. **관리자 로그인 및 프로젝트 관리**
   - 회원가입 / 로그인
   - 프로젝트 생성 및 API Key 발급
   - 추적 스크립트 생성

2. **이벤트 수집**
   - 고객사 웹사이트에 스크립트 삽입
   - 브라우저 이벤트 실시간 수집
   - 서버로 배치 전송

3. **세션 재생**
   - 수집된 이벤트 대시보드에서 확인
   - rrweb-player로 세션 재생
   - 세션별 통계 및 메트릭

## 라이선스

MIT
