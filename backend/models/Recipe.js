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
    // 'shelfLife' 필드를 개봉 여부에 따라 이중 구조로 변경
    shelfLife: {
        unopened: { // 미개봉 상태의 소비기한
            room_temp: Number,
            fridge: Number,
            freezer: Number,
        },
        opened: { // 개봉 후 상태의 소비기한
            room_temp: Number,
            fridge: Number,
            freezer: Number,
        }
    },
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
const IngredientMaster = mongoose.model('IngredientMaster', IngredientMasterSchema);

module.exports = { Recipe, IngredientMaster };
