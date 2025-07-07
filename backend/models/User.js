const mongoose = require('mongoose');

const IngredientSubSchema = new mongoose.Schema({
    // _id는 MongoDB가 자동으로 생성
    name: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
    quantity: { type: String, enum: ['있음', '자투리', '없음'], required: true },
});

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    profile: {
        name: String,
        skillLevel: Number,
        allergies: [String],
    },
    ingredients: [IngredientSubSchema],
    recipeRatings: {
        type: Map,
        of: String, // 'like' or 'dislike'
    },
});

module.exports = mongoose.model('User', UserSchema);
