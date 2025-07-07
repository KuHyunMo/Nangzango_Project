const User = require('../models/User');
const { Recipe, IngredientShelfLife } = require('../models/Recipe');

// 오늘 날짜 (시뮬레이션)
const TODAY = new Date(); // 실제 오늘 날짜를 사용하도록 변경

/**
 * 두 날짜 사이의 일수 차이를 계산하는 헬퍼 함수
 */
const daysBetween = (date1, date2) => {
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.round((date2 - date1) / oneDay);
};

/**
 * 레시피 추천 로직을 수행하는 메인 서비스 함수 (MongoDB 연동 버전)
 */
const getRecommendations = async (userId, availableTime, tempExcludeIngredients = []) => {
    // --- 1단계: DB에서 사용자 및 레시피 정보 가져오기 ---
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error("User not found");
    }
    const allRecipes = await Recipe.find({});
    const shelfLives = await IngredientShelfLife.find({});
    const shelfLifeMap = new Map(shelfLives.map(item => [item.name, item.shelfLife]));


    // --- 2단계: 유통기한 임박 재료 선정 ---
    const ingredientsWithExpiry = user.ingredients.map(ing => {
        const shelfLife = shelfLifeMap.get(ing.name) || 7;
        const expiryDate = new Date(ing.purchaseDate);
        expiryDate.setDate(expiryDate.getDate() + shelfLife);
        const daysLeft = daysBetween(TODAY, expiryDate);
        return { ...ing.toObject(), daysLeft };
    });

    const expiringSoonIngredients = ingredientsWithExpiry
        .filter(ing => ing.daysLeft <= 3 && !tempExcludeIngredients.includes(ing.name))
        .sort((a, b) => a.daysLeft - b.daysLeft);
    
    const coreIngredients = expiringSoonIngredients.length > 0 
        ? expiringSoonIngredients.slice(0, 2)
        : ingredientsWithExpiry.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 2);

    console.log("🎯 핵심 재료:", coreIngredients.map(i => i.name));

    // --- 3단계: 레시피 필터링 ---
    const filteredRecipes = allRecipes.filter(recipe => {
        if (recipe.cookTime > availableTime) return false;
        if (recipe.ingredients.some(ing => user.profile.allergies.includes(ing))) return false;
        if (recipe.ingredients.some(ing => tempExcludeIngredients.includes(ing))) return false;

        const userIngredientNames = user.ingredients.map(i => i.name);
        const requiredCoreIngredients = recipe.ingredients.filter(ing => shelfLifeMap.has(ing));
        const hasAllIngredients = requiredCoreIngredients.every(ing => userIngredientNames.includes(ing));

        return hasAllIngredients && requiredCoreIngredients.length > 0;
    });

    // --- 4단계: 레시피 랭킹 및 최종 선택 ---
    const scoredRecipes = filteredRecipes.map(recipe => {
        let score = 0;
        if (user.recipeRatings.get(recipe.id) === 'like') score += 20;
        if (user.recipeRatings.get(recipe.id) === 'dislike') score -= 50;

        if (recipe.ingredients.some(ing => coreIngredients.map(ci => ci.name).includes(ing))) {
            score += 15;
        }
        score += 5 - Math.abs(recipe.difficulty - user.profile.skillLevel);

        return { ...recipe.toObject(), score };
    }).sort((a, b) => b.score - a.score);

    // --- 5단계: 최종 결과 조합 (다양성 확보) ---
    let finalRecommendations = [];
    const recommendedIds = new Set();

    for (const recipe of scoredRecipes) {
        if (finalRecommendations.length < 2 && !recommendedIds.has(recipe.id)) {
            finalRecommendations.push(recipe);
            recommendedIds.add(recipe.id);
        }
    }
    
    const newExperienceRecipe = scoredRecipes.find(
        r => !user.recipeRatings.has(r.id) && !recommendedIds.has(r.id)
    );
    if (newExperienceRecipe) {
        finalRecommendations.push(newExperienceRecipe);
        recommendedIds.add(newExperienceRecipe.id);
    }

    while (finalRecommendations.length < 3 && scoredRecipes.length > recommendedIds.size) {
        const nextRecipe = scoredRecipes.find(r => !recommendedIds.has(r.id));
        if (nextRecipe) {
            finalRecommendations.push(nextRecipe);
            recommendedIds.add(nextRecipe.id);
        } else {
            break;
        }
    }

    return finalRecommendations.slice(0, 4);
};

module.exports = { getRecommendations };
