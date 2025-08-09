const express = require('express');
const router = express.Router();
const { IngredientMaster } = require('../models/Ingredients');
const auth = require('../middleware/auth');
const ingredientService = require('../services/ingredientService');

// ✅ 핵심 수정: 정규 표현식의 특수 문자를 이스케이프하는 헬퍼 함수
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// --- (GET) 마스터 식재료 검색 API ---
router.get('/ingredients/search', auth, async (req, res) => {
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

// ✅ [추가] 새로운 마스터 식재료 생성 API
// POST /api/masterdata/ingredients
router.post('/ingredients', auth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ msg: '재료 이름은 필수입니다.' });
        }

        // 서비스 레이어를 호출하여 식재료 마스터 데이터를 찾거나 생성
        const masterIngredient = await ingredientService.findOrCreateMasterIngredient(name);

        if (!masterIngredient) {
            // Gemini API 등에서 정보를 가져오지 못한 경우
            return res.status(500).json({ msg: 'AI를 통해 재료 정보를 생성하는 데 실패했습니다.' });
        }

        res.status(201).json(masterIngredient);
    } catch (error) {
        console.error('Create master ingredient error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});


module.exports = router;
