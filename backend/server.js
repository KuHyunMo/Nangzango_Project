require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


connectDB();

const app = express();
const PORT = process.env.PORT || 3000;


const corsOptions = {
  origin: 'https://rkalsdud.github.io', // 허용할 프론트엔드 도메인
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('스마트 냉장고 API 서버입니다.');
});

// --- 라우트 정의 ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ingredients', require('./routes/ingredients'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/masterdata', require('./routes/masterdata'));
// 새로 추가된 LLM 추천 라우트
app.use('/api/recommend', require('./routes/recommend'));
// 새로 추가된 LLM 재료 추가 라우트
app.use('/api/addstuff', require('./routes/addstuff'));
// 홈 화면 Tip API
app.use('/api/tips', require('./routes/tips'));

app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
