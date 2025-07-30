const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

// DB에 연결
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 핵심 수정: CORS 설정을 더 명확하게 변경합니다.
// 이제 우리 서버는 오직 배포된 프론트엔드 주소의 요청만 허용하게 됩니다.
// const corsOptions = {
//   origin: 'https://rkalsdud.github.io', // 허용할 프론트엔드 도메인
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('스마트 냉장고 API 서버입니다.');
});

// --- 라우트 정의 ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/masterdata', require('./routes/masterdata'));
app.use('/api/recommend', require('./routes/recommend'));


app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
