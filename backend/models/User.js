const mongoose = require('mongoose');

// 사용자가 보유한 개별 식재료의 상세 정보를 위한 스키마
const IngredientSubSchema = new mongoose.Schema({
    name: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    quantity: { 
        type: String, 
        // 'invisible' 상태 추가
        enum: ['있음', '자투리', '없음', 'invisible'], 
        required: true 
    },
    // '보관 방식'과 '개봉 여부' 필드 추가
    storageMethod: {
        type: String,
        enum: ['실온', '냉장', '냉동'],
        default: '냉장',
    },
    isOpened: {
        type: Boolean,
        default: false,
    },
});

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    profile: {
        name: String,
        skillLevel: Number,
        // 알러지 정보는 이미 존재
        allergies: [String],
    },
    ingredients: [IngredientSubSchema],
    recipeRatings: {
        type: Map,
        of: String, // 'like' or 'dislike'
    },
    // '알림 설정' 필드 추가
    notificationSettings: {
        allowNotifications: { type: Boolean, default: true },
        // 추후 더 상세한 설정 추가 가능 (예: 특정 재료 알림 끄기)
    },
});

module.exports = mongoose.model('User', UserSchema);
