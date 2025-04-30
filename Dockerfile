# 빌드 스테이지
FROM node:20-alpine AS build

WORKDIR /app

# 의존성 파일 복사
COPY package.json package-lock.json* ./

# 필요한 모든 의존성 설치
RUN npm ci && \
    npm install --save chart.js axios && \
    npm install --save-dev eslint-plugin-prettier eslint-config-prettier

# 소스 코드 복사 (이 시점에 .env.local 파일도 같이 복사됨)
COPY . .

# ESLint 관련 설정
ENV ESLINT_NO_DEV_ERRORS=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 타입 체크와 린트 건너뛰고 빌드하기
RUN npm run build

# 실행 스테이지
FROM node:20-alpine AS runner

WORKDIR /app

# 환경 변수 설정
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED=1

# 필요한 파일만 복사
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env.local ./.env.local

# 포트 노출
EXPOSE 3000

# 실행 명령
CMD ["npm", "start"]