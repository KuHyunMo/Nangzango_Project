const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileService = require('../services/profileService');

// --- (GET) 로그인한 사용자의 프로필 정보 조회 ---
// GET /api/profile
router.get('/', auth, async (req, res) => {
    try {
        const profile = await profileService.getProfile(req.user.id);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ msg: '서버 오류' });
    }
});

// --- (PUT) 로그인한 사용자의 프로필 정보 수정 ---
// PUT /api/profile
router.put('/', auth, async (req, res) => {
    try {
        const updatedProfile = await profileService.updateProfile(req.user.id, req.body);
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ msg: '서버 오류' });
    }
});

module.exports = router;
