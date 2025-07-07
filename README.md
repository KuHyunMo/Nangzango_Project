# 스마트 냉장고 관리 및 레시피 추천 앱

내 냉장고 속 식재료를 관리하고, 유통기한 임박 재료를 활용한 맞춤 레시피를 추천받아 음식물 쓰레기를 줄이는 애플리케이션입니다.

## 🌟 현재 구현된 기능

-   **데이터베이스 연동:** 모든 데이터는 MongoDB Atlas 클라우드 데이터베이스에 영구적으로 저장됩니다.
-   **식재료 관리 (CRUD):**
    -   냉장고 속 재료 목록 조회 (유통기한 임박 순 정렬)
    -   새로운 재료 추가
    -   재료 삭제
-   **레시피 추천:** 유통기한, 사용자 선호도, 요리 실력 등을 고려한 기본 레시피 추천 기능이 동작합니다.

## 🛠️ 기술 스택 및 아키텍처

-   **Frontend:** React Native (Expo)
-   **Backend:** Node.js, Express
-   **Database:** MongoDB (MongoDB Atlas 클라우드 서비스 사용)
-   **Architecture:** API 통신을 통해 프론트엔드와 백엔드가 분리된 구조

---

## ✅ 개발 환경 구축 (Prerequisites)

이 프로젝트를 실행하기 전, 아래의 환경을 **반드시** 먼저 구축해야 합니다.

### 1. Git
-   코드를 내려받기 위해 [Git](https://git-scm.com/downloads)이 설치되어 있어야 합니다.

### 2. Node.js 버전 관리자 (nvm-windows)
-   안정적인 개발 환경을 위해 **nvm**을 사용하여 Node.js 버전을 관리합니다.
-   **[nvm-windows 다운로드 페이지](https://github.com/coreybutler/nvm-windows/releases)**에서 `nvm-setup.zip`을 받아 **관리자 권한으로 설치**하세요.

### 3. Node.js 버전 (v18.18.0)
-   **반드시 `v18.18.0 (LTS)` 버전을 사용해야 합니다.** **관리자 권한으로 터미널을 열고** 아래 명령어로 설치 및 설정하세요.
    ```bash
    nvm install 18.18.0
    nvm use 18.18.0
    ```

### 4. MongoDB Atlas 클라우드 데이터베이스
-   데이터를 저장하기 위해 무료 클라우드 데이터베이스가 필요합니다.
-   **[이전 가이드](#immersive_id=mongodb_setup_guide)**에 따라 무료 `M0` 클러스터를 생성하고, 다음 두 가지를 준비하세요.
    1.  **데이터베이스 사용자**의 `username`과 `password`
    2.  **연결 문자열 (Connection String)**

### 5. 모바일 클라이언트
-   스마트폰에 **Expo Go** 앱을 설치해야 합니다. (Google Play Store / Apple App Store)

---

## 🚀 설치 및 실행 방법

### 1단계: 프로젝트 다운로드 및 위치 선정

1.  **프로젝트 클론:**
    ```bash
    git clone [https://github.com/YourUsername/MyFridgeProject.git](https://github.com/YourUsername/MyFridgeProject.git)
    ```
2.  **폴더 이동:**
    **매우 중요:** 다운로드한 `MyFridgeProject` 폴더를 **OneDrive나 `바탕 화면`을 피해서** `C:\dev` 와 같이 한글/공백이 없는 단순한 경로로 옮겨주세요.

### 2단계: 백엔드(Backend) 서버 실행

**관리자 권한으로 터미널을 열고** 아래 과정을 진행합니다.

1.  **폴더 이동 및 패키지 설치:**
    ```bash
    cd C:\dev\MyFridgeProject\backend
    npm install
    ```

2.  **.env 파일 생성:**
    -   `backend` 폴더 안에 `.env` 파일을 새로 만듭니다.
    -   아래 내용을 파일에 붙여넣고, 본인의 **MongoDB Atlas 연결 정보로 수정**하세요.
        ```env
        # <password> 부분은 실제 데이터베이스 사용자 비밀번호로 변경해야 합니다.
        MONGODB_URI=mongodb+srv://YourUsername:<password>@cluster0.xxxxx.mongodb.net/smart-fridge?retryWrites=true&w=majority
        ```

3.  **데이터베이스 초기화:**
    -   아래 명령어를 실행하여 MongoDB에 초기 데이터를 저장합니다.
    ```bash
    node scripts/seed.js
    ```

4.  **서버 시작:**
    ```bash
    node server.js
    ```
    > "✅ MongoDB에 성공적으로 연결되었습니다." 와 "🚀 서버가 ... 실행 중입니다." 메시지가 나타나면 성공입니다. 이 터미널은 계속 켜두세요.

### 3단계: 프론트엔드(Frontend) 앱 실행

**새로운 터미널을 관리자 권한으로 열고** 아래 과정을 진행합니다.

1.  **Node.js 버전 설정 및 폴더 이동:**
    ```bash
    nvm use 18.18.0
    cd C:\dev\MyFridgeProject\frontend
    ```

2.  **패키지 설치:**
    ```bash
    npm install
    ```

3.  **API 주소 확인:**
    -   `frontend/api/ingredientApi.js` 파일을 열어 `API_BASE_URL`의 IP 주소가 현재 컴퓨터의 IP 주소와 일치하는지 확인하세요.

4.  **앱 시작:**
    ```bash
    npx expo start
    ```

### 4단계: Expo Go에서 앱 실행

1.  컴퓨터와 스마트폰이 **반드시 동일한 Wi-Fi**에 연결되어 있는지 확인합니다.
2.  `npx expo start` 실행 후 터미널에 나타난 **QR 코드**를 스마트폰의 **Expo Go** 앱으로 스캔합니다.
3.  앱이 정상적으로 로딩되면 성공입니다!
