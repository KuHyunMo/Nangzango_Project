# 스마트 냉장고 웹 애플리케이션

내 냉장고 속 식재료를 관리하고, Google Gemini AI를 통해 보유한 재료와 수량, 사용자의 상황(조리 시간, 인원)까지 고려한 맞춤 레시피를 실시간으로 추천받는 웹 애플리케이션입니다.

## 🌟 핵심 기능

-   **사용자 인증:** 아이디/비밀번호 기반의 회원가입 및 로그인 기능 (JWT 토큰 인증)
-   **식재료 관리 (CRUD):**
    -   데이터베이스에 저장된 '마스터 식재료' 목록 실시간 검색 및 추가
    -   사용자가 보유한 식재료 목록 조회 (유통기한 임박 순 정렬)
    -   식재료 정보(수량, 보관법) 수정 및 삭제
-   **AI 레시피 추천 (LLM 연동):**
    -   Google Gemini API (`gemini-1.5-flash`)를 활용한 동적 레시피 생성
    -   사용자의 보유 재료 및 **수량('있음', '자투리')**을 고려
    -   **기본 양념**(소금, 설탕 등)은 보유한 것으로 자동 가정
    -   사용자가 설정한 **최대 조리 시간**과 **인원 수**에 맞는 레시피 추천
-   **요리 후 재고 관리:**
    -   요리에 사용한 재료의 상태('있음', '자투리', '없음')를 업데이트
    -   **개별 포장 재료**를 사용하고 남은 경우, '자투리' 재료를 새로 추가하여 정확한 재고 관리
-   **사용자 프로필 설정:**
    -   이름, 요리 실력, 알러지 정보 설정 기능

## 🛠️ 기술 스택 및 아키텍처

-   **Frontend:** `React` (CDN 방식), `Tailwind CSS`
-   **Backend:** `Node.js`, `Express`
-   **Database:** `MongoDB` (Mongoose ODM, Atlas 클라우드 호스팅)
-   **AI:** `Google Gemini API`
-   **Architecture:** API 통신을 통해 프론트엔드와 백엔드가 분리된 구조

---

## ✅ 개발 환경 구축 (Prerequisites)

이 프로젝트를 로컬 컴퓨터에서 실행하기 위해 아래의 환경을 **반드시** 먼저 구축해야 합니다.

### 1. 기본 도구
-   **Git:** 코드 버전 관리를 위해 [Git](https://git-scm.com/downloads) 설치
-   **Node.js 버전 관리자 (nvm):** 안정적인 개발 환경을 위해 [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) (Windows) 또는 `nvm` (macOS/Linux) 설치

### 2. Node.js 버전 (v18.18.0)
-   **반드시 `v18.18.0 (LTS)` 버전을 사용해야 합니다.** **관리자 권한으로 터미널을 열고** 아래 명령어로 설치 및 설정하세요.
    ```bash
    nvm install 18.18.0
    nvm use 18.18.0
    ```

### 3. 외부 서비스 API 키
-   **MongoDB Atlas:** 클라우드 데이터베이스. [가이드](#immersive_id=mongodb_setup_guide)에 따라 무료 클러스터를 생성하고 **연결 문자열(Connection String)**을 준비합니다.
-   **Google Gemini API:** AI 레시피 생성을 위해 [Google AI Studio](https://aistudio.google.com/app/apikey)에서 **API 키**를 발급받습니다.

---

## 🚀 로컬 환경에서 실행 방법

### 1단계: 프로젝트 다운로드 및 위치 선정

1.  **프로젝트 클론:**
    ```bash
    git clone [https://github.com/rkalsdud/summerProj.git](https://github.com/rkalsdud/summerProj.git)
    ```
2.  **폴더 이동:**
    **매우 중요:** 다운로드한 `summerProj` 폴더를 **OneDrive나 `바탕 화면`을 피해서** `C:\dev` 와 같이 한글/공백이 없는 단순한 경로로 옮겨주세요.

### 2단계: 백엔드(Backend) 서버 설정 및 실행

**관리자 권한으로 터미널을 열고** 아래 과정을 진행합니다.

1.  **`.env` 파일 생성:**
    -   `backend` 폴더 안에 `.env` 파일을 새로 만듭니다.
    -   아래 내용을 파일에 붙여넣고, 본인의 **API 키와 연결 정보로 수정**하세요.
        ```env
        # MongoDB Atlas에서 복사한 연결 문자열 (<password> 부분은 실제 DB 비밀번호로 변경)
        MONGODB_URI=mongodb+srv://YourUsername:<password>@cluster0.xxxxx.mongodb.net/smart-fridge?retryWrites=true&w=majority

        # JWT 토큰 생성을 위한 비밀 키 (아무 문자열이나 가능)
        JWT_SECRET=mysecretkey

        # Google AI Studio에서 발급받은 Gemini API 키
        GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```

2.  **패키지 설치:**
    ```bash
    cd backend
    npm install
    ```

3.  **데이터베이스 초기화:**
    -   아래 명령어를 실행하여 MongoDB에 초기 데이터를 저장합니다. **스키마가 변경될 때마다 이 작업을 다시 수행해야 합니다.**
    ```bash
    node scripts/seed.js
    ```

4.  **서버 시작:**
    ```bash
    npm run dev
    ```
    > "🚀 서버가 http://localhost:3000 에서 실행 중입니다." 메시지가 나타나면 성공입니다. 이 터미널은 계속 켜두세요.

### 3단계: 프론트엔드(Frontend) 웹 실행

1.  **API 주소 확인:**
    -   프로젝트 최상위 폴더의 **`index.html`** 파일을 엽니다.
    -   `API_BASE_URL` 변수가 로컬 서버 주소로 되어 있는지 확인합니다.
        ```javascript
        const API_BASE_URL = 'http://localhost:3000/api';
        ```

2.  **브라우저에서 열기:**
    -   수정한 **`index.html` 파일을 웹 브라우저에서 직접 열면 됩니다.** (파일 더블클릭)

이제 로컬 환경에서 모든 기능이 정상적으로 동작하는 것을 확인할 수 있습니다.

---

## 🚢 배포 (Deployment)

이 프로젝트는 아래 서비스들을 통해 웹에 배포되어 있습니다.

-   **Backend:** [Render](https://render.com/) (`https://nangzango.onrender.com`)
-   **Frontend:** [GitHub Pages](https://pages.github.com/) (`https://rkalsdud.github.io/summerProj/`)

코드를 수정한 후 배포하려면, `index.html`의 `API_BASE_URL`을 Render 주소로 변경한 뒤 GitHub에 푸시하면 됩니다.
