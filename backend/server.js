const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

// DB에 연결
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('스마트 냉장고 API 서버입니다.');
});

// --- 라우트 정의 ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/profile', require('./routes/profile'));
// 새로 추가된 마스터 데이터 라우트
app.use('/api/masterdata', require('./routes/masterdata'));


app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
