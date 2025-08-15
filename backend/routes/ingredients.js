const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ingredientService = require('../services/ingredientService');

// 이 라우터의 모든 API는 'auth' 미들웨어를 통과해야만 실행됩니다.

// (R)ead: 로그인한 사용자의 모든 식재료 조회
router.get('/', auth, async (req, res) => {
    try {
        const ingredients = await ingredientService.getIngredients(req.user.id);
        res.json(ingredients);
    } catch (error) {
        console.error('GET /ingredients error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

// (C)reate: 새로운 식재료 추가 (기존 수동 추가 API)
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
        res.status(204).send();
    } catch (error) {
        console.error('DELETE /ingredients/:id error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

// ✅ 핵심: 요리 후 재료 상태 일괄 업데이트 API (기존 유지)
router.post('/batch-update', auth, async (req, res) => {
    try {
        const updates = req.body.updates;
        await ingredientService.batchUpdateIngredients(req.user.id, updates);
        res.status(200).json({ msg: '재료 상태가 성공적으로 업데이트되었습니다.' });
    } catch (error) {
        console.error('Batch update error:', error);
        res.status(500).json({ msg: '재료 상태 업데이트 중 오류가 발생했습니다.' });
    }
});

// ✅ [추가] 재료 선호도 업데이트 라우트
router.put('/:id/preference', auth, async (req, res) => {
    try {
        const { preference } = req.body;
        const updatedIngredient = await ingredientService.updateIngredientPreference(req.user.id, req.params.id, preference);
        res.json(updatedIngredient);
    } catch (error) {
        console.error('PUT /ingredients/:id/preference error:', error.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
    }
});

// 유통기한 지난 재료만 조회
router.get('/expired', auth, async (req, res) => {
  try {
    const all = await ingredientService.getIngredients(req.user.id); // daysLeft 포함 반환
    const expired = all.filter(ing => ing.daysLeft !== null && ing.daysLeft < 0);
    res.json(expired);
  } catch (err) {
    console.error('GET /ingredients/expired error:', err.message);
    res.status(500).json({ msg: '서버 오류가 발생했습니다.' });
  }
});


module.exports = router;
