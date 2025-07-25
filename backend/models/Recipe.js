const mongoose = require('mongoose');

// --- 레시피 마스터 데이터 스키마 ---
const RecipeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ingredients: [String],
    cookTime: Number,
    difficulty: Number,
    nutritionInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
    },
    instructions: {
        type: String,
        required: true,
    },
});

// --- 식재료 마스터 데이터 스키마 (수정) ---
const IngredientMasterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    storageTips: String,
    spoilageInfo: String,
    allergyInfo: String,
    // ✅ 핵심 수정: defaultStorePeriod를 제거하고, defaultStoreMethod를 추가합니다.
    defaultStoreMethod: {
        type: String,
        enum: ['실온', '냉장', '냉동'],
        default: '냉장',
    },
    shelfLife: {
        unopened: {
            room_temp: { type: Number, default: null },
            fridge: { type: Number, default: null },
            freezer: { type: Number, default: null },
        },
        opened: {
            room_temp: { type: Number, default: null },
            fridge: { type: Number, default: null },
            freezer: { type: Number, default: null },
        }
    },
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
const IngredientMaster = mongoose.model('IngredientMaster', IngredientMasterSchema);

module.exports = { Recipe, IngredientMaster };
