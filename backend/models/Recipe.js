const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ingredients: [String],
    cookTime: Number,
    difficulty: Number,
    nutritionType: String,
});

const IngredientShelfLifeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    shelfLife: { type: Number, required: true }, // 평균 소비기한 (일)
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
const IngredientShelfLife = mongoose.model('IngredientShelfLife', IngredientShelfLifeSchema);

module.exports = { Recipe, IngredientShelfLife };
