const express = require('express');
const router = express.Router();
const { IngredientMaster } = require('../models/Recipe');

// --- (GET) 마스터 식재료 검색 API ---
// GET /api/masterdata/ingredients/search?q=검색어
router.get('/ingredients/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            // 검색어가 없으면 빈 배열을 반환
            return res.json([]);
        }

        // 'name' 필드에서 검색어를 포함하는 모든 식재료를 대소문자 구분 없이 검색합니다.
        // 정규 표현식(RegExp)을 사용하여 'contains' 검색을 구현합니다.
        const ingredients = await IngredientMaster.find({
            name: new RegExp(query, 'i')
        }).limit(10); // 결과는 최대 10개로 제한

        res.json(ingredients);
    } catch (error) {
        console.error('Search ingredients error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
