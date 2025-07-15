const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- 회원가입 API ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
    // email 대신 username을 받도록 수정
    const { name, username, password } = req.body;
    try {
        // username으로 중복 확인
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: '이미 존재하는 아이디입니다.' });
        }

        user = new User({
            profile: { name },
            username,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다. 다시 시도해주세요.' });
    }
});

// --- 로그인 API ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
    // email 대신 username을 받도록 수정
    const { username, password } = req.body;
    try {
        // username으로 사용자 검색
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: '서버 오류가 발생했습니다. 다시 시도해주세요.' });
    }
});

module.exports = router;
