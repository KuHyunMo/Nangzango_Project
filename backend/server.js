const express = require('express');
const { getRecommendations } = require('./services/recommendationService');

const app = express();
const PORT = 3000;

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// 루트 경로
app.get('/', (req, res) => {
    res.send('스마트 냉장고 추천 API 서버입니다.');
});

/**
 * 레시피 추천 API 엔드포인트
 * POST /api/recommend
 * Request Body: { "userId": "user01", "availableTime": 30, "tempExcludeIngredients": ["양파"] }
 */
app.post('/api/recommend', (req, res) => {
    try {
        const { userId, availableTime, tempExcludeIngredients } = req.body;

        if (!userId || !availableTime) {
            return res.status(400).json({ error: 'userId와 availableTime은 필수입니다.' });
        }

        const recommendations = getRecommendations(userId, availableTime, tempExcludeIngredients);
        res.json({
            message: '레시피를 추천해드릴게요!',
            count: recommendations.length,
            recommendations: recommendations
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});