const express = require('express');
const { getRecommendations } = require('./services/recommendationService');
// 식재료 관리를 위한 새로운 서비스 임포트
const ingredientService = require('./services/ingredientService');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('스마트 냉장고 추천 API 서버입니다.');
});

// --- 레시피 추천 API ---
app.post('/api/recommend', (req, res) => {
    try {
        const { userId, availableTime, tempExcludeIngredients } = req.body;
        if (!userId || !availableTime) {
            return res.status(400).json({ error: 'userId와 availableTime은 필수입니다.' });
        }
        const recommendations = getRecommendations(userId, availableTime, tempExcludeIngredients);
        res.json({ recommendations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- 식재료 관리 API (CRUD) ---

// (R)ead: 특정 유저의 모든 식재료 조회
app.get('/api/ingredients/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const ingredients = ingredientService.getIngredients(userId);
        res.json(ingredients);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// (C)reate: 새로운 식재료 추가
app.post('/api/ingredients/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { name, quantity } = req.body;
        if (!name || !quantity) {
            return res.status(400).json({ error: 'name과 quantity는 필수입니다.' });
        }
        const newIngredient = ingredientService.addIngredient(userId, { name, quantity });
        res.status(201).json(newIngredient);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// (U)pdate: 식재료 수량 변경
app.put('/api/ingredients/:userId/:ingredientId', (req, res) => {
    try {
        const { userId, ingredientId } = req.params;
        const { quantity } = req.body;
        if (!quantity) {
            return res.status(400).json({ error: 'quantity는 필수입니다.' });
        }
        const updatedIngredient = ingredientService.updateIngredient(userId, ingredientId, { quantity });
        res.json(updatedIngredient);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// (D)elete: 식재료 삭제
app.delete('/api/ingredients/:userId/:ingredientId', (req, res) => {
    try {
        const { userId, ingredientId } = req.params;
        ingredientService.deleteIngredient(userId, ingredientId);
        res.status(204).send(); // 성공적으로 삭제되었으나 본문 내용은 없음
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
