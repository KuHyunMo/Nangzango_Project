// 'mongoose'는 MongoDB 데이터베이스를 Node.js 환경에서 쉽게 사용할 수 있도록 도와주는 ODM(Object Data Modeling) 라이브러리입니다.
// 스키마(데이터 구조)를 정의하고 데이터를 다루는 다양한 메서드를 제공합니다.
const mongoose = require('mongoose');

// 'dotenv' 라이브러리는 .env 파일에 저장된 환경 변수를 `process.env` 객체로 로드해주는 역할을 합니다.
// 데이터베이스 연결 URI나 API 키 등 민감한 정보를 코드에서 분리하여 관리하기 위해 사용됩니다.
require('dotenv').config();

/**
 * MongoDB 데이터베이스에 비동기적으로 연결하는 함수입니다.
 * async/await 문법을 사용하여 비동기 연결 과정을 동기적인 코드처럼 작성할 수 있습니다.
 */
const connectDB = async () => {
    // try...catch 블록을 사용하여 데이터베이스 연결 과정에서 발생할 수 있는 오류를 처리합니다.
    try {
        // mongoose.connect() 함수를 사용하여 MongoDB에 연결을 시도합니다.
        // 연결 주소(URI)는 .env 파일에 정의된 MONGODB_URI 환경 변수에서 가져옵니다.
        // await 키워드는 연결이 성공적으로 완료될 때까지 다음 코드의 실행을 기다리게 합니다.
        await mongoose.connect(process.env.MONGODB_URI);

        // 연결이 성공하면 콘솔에 성공 메시지를 출력합니다.
        console.log('✅ MongoDB에 성공적으로 연결되었습니다.');

    } catch (err) {
        // 연결 과정에서 오류가 발생하면 catch 블록이 실행됩니다.
        // 콘솔에 오류 메시지를 출력하여 어떤 문제가 발생했는지 알려줍니다.
        console.error('❌ MongoDB 연결 실패:', err.message);

        // 데이터베이스 연결은 애플리케이션 실행에 필수적인 경우가 많으므로,
        // 연결에 실패했을 때 process.exit(1)을 호출하여 Node.js 프로세스를 즉시 종료합니다.
        // 숫자 1은 비정상적인 종료를 의미합니다.
        process.exit(1);
    }
};

// connectDB 함수를 다른 파일에서 require()를 통해 가져와 사용할 수 있도록 모듈로 내보냅니다.
module.exports = connectDB;
