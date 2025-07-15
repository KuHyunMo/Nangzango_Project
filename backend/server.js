const express = require('express');
const connectDB = require('./config/db');
const recommendationService = require('./services/recommendationService');
const ingredientService = require('./services/ingredientService');
const cors = require('cors'); // CORS 패키지 임포트

// DB에 연결
connectDB();

const app = express();
const PORT = 3000;

// --- 미들웨어 설정 ---
app.use(cors()); // 모든 도메인에서의 요청을 허용하도록 CORS 미들웨어 추가
app.use(express.json());


app.get('/', (req, res) => {
    res.send('스마트 냉장고 추천 API 서버입니다.');
});

// --- (이하 API 라우팅 코드는 이전과 동일) ---

// (R)ead: 특정 유저의 모든 식재료 조회
app.get('/api/ingredients/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const ingredients = await ingredientService.getIngredients(userId);
        res.json(ingredients);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// (C)reate: 새로운 식재료 추가
app.post('/api/ingredients/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, quantity } = req.body;
        if (!name || !quantity) {
            return res.status(400).json({ error: 'name과 quantity는 필수입니다.' });
        }
        const newIngredient = await ingredientService.addIngredient(userId, { name, quantity });
        res.status(201).json(newIngredient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// (U)pdate: 식재료 수량 변경
app.put('/api/ingredients/:userId/:ingredientId', async (req, res) => {
    try {
        const { userId, ingredientId } = req.params;
        const { quantity } = req.body;
        if (!quantity) {
            return res.status(400).json({ error: 'quantity는 필수입니다.' });
        }
        const updatedIngredient = await ingredientService.updateIngredient(userId, ingredientId, { quantity });
        res.json(updatedIngredient);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// (D)elete: 식재료 삭제
app.delete('/api/ingredients/:userId/:ingredientId', async (req, res) => {
    try {
        const { userId, ingredientId } = req.params;
        await ingredientService.deleteIngredient(userId, ingredientId);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
