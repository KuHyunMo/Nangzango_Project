const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
    // 요청 헤더에서 토큰을 가져옵니다.
    const token = req.header('x-auth-token');

    // 토큰이 없으면 접근을 거부합니다.
    if (!token) {
        return res.status(401).json({ msg: '인증 토큰이 없어 접근이 거부되었습니다.' });
    }

    // 토큰을 확인(verify)합니다.
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 요청 객체에 사용자 정보를 심어줍니다.
        req.user = decoded.user;
        next(); // 다음 미들웨어 또는 라우트 핸들러로 이동합니다.
    } catch (err) {
        res.status(401).json({ msg: '토큰이 유효하지 않습니다.' });
    }
};
