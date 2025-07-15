const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ingredientService = require('../services/ingredientService');

// 이 라우터의 모든 API는 'auth' 미들웨어를 통과해야만 실행됩니다.
// 즉, 요청 헤더에 유효한 'x-auth-token'이 포함되어 있어야 합니다.

// (R)ead: 로그인한 사용자의 모든 식재료 조회
router.get('/', auth, async (req, res) => {
    try {
        // 더 이상 URL에서 userId를 받지 않고, 토큰에서 추출된 사용자 ID를 사용합니다.
        // req.user.id는 auth 미들웨어에서 토큰을 복호화하여 넣어준 값입니다.
        const ingredients = await ingredientService.getIngredients(req.user.id);
        res.json(ingredients);
    } catch (error) {
        console.error('GET /ingredients error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

// (C)reate: 새로운 식재료 추가
router.post('/', auth, async (req, res) => {
    try {
        const { name, quantity, storageMethod, isOpened } = req.body;
        if (!name || !quantity) {
            return res.status(400).json({ msg: '이름과 수량은 필수 항목입니다.' });
        }
        const newIngredient = await ingredientService.addIngredient(req.user.id, { name, quantity, storageMethod, isOpened });
        res.status(201).json(newIngredient);
    } catch (error) {
        console.error('POST /ingredients error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

// (U)pdate: 식재료 정보 수정
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedIngredient = await ingredientService.updateIngredient(req.user.id, req.params.id, req.body);
        res.json(updatedIngredient);
    } catch (error) {
        console.error('PUT /ingredients/:id error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

// (D)elete: 식재료 삭제
router.delete('/:id', auth, async (req, res) => {
    try {
        await ingredientService.deleteIngredient(req.user.id, req.params.id);
        res.status(204).send(); // 성공적으로 삭제되었으나 본문 내용은 없음
    } catch (error) {
        console.error('DELETE /ingredients/:id error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
