const User = require('../models/User');

/**
 * 사용자의 프로필 정보를 조회합니다.
 */
const getProfile = async (userId) => {
    const user = await User.findById(userId).select('profile');
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
    }
    return user.profile;
};

/**
 * 사용자의 프로필 정보를 업데이트합니다.
 */
const updateProfile = async (userId, profileData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 받은 데이터로 프로필 객체 전체를 업데이트합니다.
    user.profile = { ...user.profile, ...profileData };
    await user.save();
    return user.profile;
};

module.exports = {
    getProfile,
    updateProfile,
};
