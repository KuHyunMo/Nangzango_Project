const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB에 성공적으로 연결되었습니다.');
    } catch (err) {
        console.error('❌ MongoDB 연결 실패:', err.message);
        // 연결 실패 시 프로세스 종료
        process.exit(1);
    }
};

module.exports = connectDB;
