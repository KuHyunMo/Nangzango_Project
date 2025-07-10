const mongoose = require('mongoose');

// --- 레시피 마스터 데이터 스키마 ---
const RecipeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    // '구성 식재료'는 이미 존재
    ingredients: [String],
    cookTime: Number,
    difficulty: Number,
    // '영양 정보'와 '레시피(조리법)' 필드 추가
    nutritionInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
    },
    instructions: {
        type: String, // 긴 글이 될 수 있으므로 String으로 저장
        required: true,
    },
});

// --- 식재료 마스터 데이터 스키마 (기존 IngredientShelfLife 대체 및 확장) ---
const IngredientMasterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // 식재료 이름 (소분류)
    // '적절한 보관 방법', '상한 상태 정보', '알러지 정보' 필드 추가
    storageTips: String, 
    spoilageInfo: String,
    allergyInfo: String, // 예: "갑각류 알러지 유발 가능"
    // '보관 방식에 따른 평균 소비 기한' 필드 추가
    shelfLife: {
        room_temp: Number, // 실온 보관 시 소비기한
        fridge: Number,    // 냉장 보관 시 소비기한
        freezer: Number,   // 냉동 보관 시 소비기한
    },
});


const Recipe = mongoose.model('Recipe', RecipeSchema);
// 기존 IngredientShelfLife 대신 IngredientMaster 모델을 사용
const IngredientMaster = mongoose.model('IngredientMaster', IngredientMasterSchema);

// 두 모델을 함께 export
module.exports = { Recipe, IngredientMaster };
