const express = require('express');
const router = express.Router();
const { IngredientMaster, TempIngredientMaster } = require('../models/Ingredients');

// 정규 표현식의 특수 문자를 이스케이프하는 헬퍼 함수
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

        const escapedQuery = escapeRegex(query);
        const regex = new RegExp(escapedQuery, 'i');

        // 두 테이블을 동시에 검색합니다.
        const masterIngredients = await IngredientMaster.find({ name: regex });
        const tempMasterIngredients = await TempIngredientMaster.find({ name: regex });

        // 두 검색 결과를 합칩니다.
        const allIngredients = [...masterIngredients, ...tempMasterIngredients];

        // 중복을 제거하고 최대 10개만 반환합니다.
        const uniqueIngredients = Array.from(new Map(allIngredients.map(item => [item.name, item])).values());

        // 검색 결과를 10개로 제한하여 클라이언트로 응답합니다.
        res.json(uniqueIngredients.slice(0, 10));

    } catch (error) {
        console.error('Search ingredients error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;