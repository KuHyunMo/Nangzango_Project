const mongoose = require('mongoose');

const IngredientSubSchema = new mongoose.Schema({
    name: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    quantity: { 
        type: String, 
        enum: ['있음', '자투리', '없음', 'invisible'], 
        required: true 
    },
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
    // email 필드를 username으로 변경
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        name: { type: String, required: true },
        skillLevel: Number,
        allergies: [String],
    },
    ingredients: [IngredientSubSchema],
    recipeRatings: {
        type: Map,
        of: String,
    },
    notificationSettings: {
        allowNotifications: { type: Boolean, default: true },
    },
});

module.exports = mongoose.model('User', UserSchema);
