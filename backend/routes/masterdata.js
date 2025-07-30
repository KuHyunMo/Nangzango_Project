const express = require('express');
const router = express.Router();
const { IngredientMaster } = require('../models/Ingredients');

// ✅ 핵심 수정: 정규 표현식의 특수 문자를 이스케이프하는 헬퍼 함수
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// --- (GET) 마스터 식재료 검색 API ---
router.get('/ingredients/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.json([]);
        }

        // ✅ 핵심 수정: 사용자 입력을 이스케이프 처리하여 안전한 정규 표현식을 생성
        const escapedQuery = escapeRegex(query);
        const ingredients = await IngredientMaster.find({
            name: new RegExp(escapedQuery, 'i')
        }).limit(10);

        res.json(ingredients);
    } catch (error) {
        console.error('Search ingredients error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
