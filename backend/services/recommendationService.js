const User = require('../models/User');
// IngredientMaster 모델을 함께 불러옵니다.
const { Recipe, IngredientMaster } = require('../models/Recipe');

// 실제 오늘 날짜를 사용하도록 변경
const TODAY = new Date();

/**
 * 두 날짜 사이의 일수 차이를 계산하는 헬퍼 함수
 */
const daysBetween = (date1, date2) => {
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.round((date2 - date1) / oneDay);
};

/**
 * 레시피 추천 로직을 수행하는 메인 서비스 함수 (MongoDB 연동 최종 버전)
 */
const getRecommendations = async (userId, availableTime, tempExcludeIngredients = []) => {
    // --- 1단계: DB에서 필요한 모든 정보 가져오기 ---
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }
    const allRecipes = await Recipe.find({});
    const masterIngredients = await IngredientMaster.find({});
    const masterIngredientMap = new Map(masterIngredients.map(item => [item.name, item]));


    // --- 2단계: 유통기한 임박 재료 선정 ---
    const ingredientsWithExpiry = user.ingredients
      .filter(ing => ing.quantity !== '없음' && ing.quantity !== 'invisible') // 없는 재료, 숨김 재료 제외
      .map(ing => {
        const masterInfo = masterIngredientMap.get(ing.name);
        let shelfLife = 7;

        if (masterInfo && masterInfo.shelfLife) {
            switch (ing.storageMethod) {
                case '실온': shelfLife = masterInfo.shelfLife.room_temp || 7; break;
                case '냉장': shelfLife = masterInfo.shelfLife.fridge || 14; break;
                case '냉동': shelfLife = masterInfo.shelfLife.freezer || 90; break;
                default: shelfLife = masterInfo.shelfLife.fridge || 14;
            }
        }
        
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
        // 레시피의 필수재료를 사용자가 가지고 있는지 확인
        const hasAllIngredients = recipe.ingredients.every(ing => userIngredientNames.includes(ing));

        return hasAllIngredients && recipe.ingredients.length > 0;
    });

    // --- 4단계: 레시피 랭킹 및 최종 선택 ---
    const scoredRecipes = filteredRecipes.map(recipe => {
        let score = 0;
        // Mongoose Map은 .get()으로 값을 가져옵니다.
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
    
    // Mongoose Map은 .has()로 키 존재 여부를 확인합니다.
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
