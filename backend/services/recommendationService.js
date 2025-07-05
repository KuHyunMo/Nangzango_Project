const { recipes, ingredientShelfLife } = require('../data/recipes');
const users = require('../data/users');

// 오늘 날짜 (시뮬레이션)
const TODAY = new Date('2025-07-04');

/**
 * 날짜 문자열을 Date 객체로 변환하는 헬퍼 함수
 * @param {string} dateString - "YYYY-MM-DD"
 * @returns {Date}
 */
const parseDate = (dateString) => new Date(dateString);

/**
 * 두 날짜 사이의 일수 차이를 계산하는 헬퍼 함수
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {number}
 */
const daysBetween = (date1, date2) => {
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.round((date2 - date1) / oneDay);
};

/**
 * 레시피 추천 로직을 수행하는 메인 서비스 함수
 * @param {string} userId - 사용자 ID
 * @param {number} availableTime - 사용자의 가용 조리 시간 (분)
 * @param {string[]} tempExcludeIngredients - 임시로 제외할 재료명 배열
 * @returns {object[]} 추천 레시피 목록
 */
const getRecommendations = (userId, availableTime, tempExcludeIngredients = []) => {
    const user = users[userId];
    if (!user) {
        throw new Error("User not found");
    }

    // --- 1단계: 유통기한 임박 재료 선정 ---
    const ingredientsWithExpiry = user.ingredients.map(ing => {
        const shelfLife = ingredientShelfLife[ing.name] || 7; // DB에 없으면 기본값 7일
        const purchaseDate = parseDate(ing.purchaseDate);
        const expiryDate = new Date(purchaseDate);
        expiryDate.setDate(purchaseDate.getDate() + shelfLife);
        const daysLeft = daysBetween(TODAY, expiryDate);
        return { ...ing, daysLeft };
    });

    const expiringSoonIngredients = ingredientsWithExpiry
        .filter(ing => ing.daysLeft <= 3 && !tempExcludeIngredients.includes(ing.name))
        .sort((a, b) => a.daysLeft - b.daysLeft);
    
    // 유통기한 임박 재료가 없으면 가장 오래된 재료 2개를 선택
    const coreIngredients = expiringSoonIngredients.length > 0 
        ? expiringSoonIngredients.slice(0, 2)
        : ingredientsWithExpiry.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 2);

    console.log("🎯 핵심 재료:", coreIngredients.map(i => i.name));

    // --- 2단계: 레시피 필터링 ---
    const filteredRecipes = recipes.filter(recipe => {
        // 2-1. 조리 시간 필터링
        if (recipe.cookTime > availableTime) return false;

        // 2-2. 알러지 재료 필터링
        if (recipe.ingredients.some(ing => user.profile.allergies.includes(ing))) return false;
        
        // 2-3. 임시 제외 재료 필터링
        if (recipe.ingredients.some(ing => tempExcludeIngredients.includes(ing))) return false;

        // 2-4. 핵심 재료 포함 여부 필터링 (가지고 있는 재료로 만들 수 있는지)
        const userIngredientNames = user.ingredients.map(i => i.name);
        // 레시피의 모든 필수재료를 사용자가 가지고 있는지 확인 (밥, 고추장 등은 일단 있다고 가정)
        const requiredCoreIngredients = recipe.ingredients.filter(ing => ingredientShelfLife[ing]);
        const hasAllIngredients = requiredCoreIngredients.every(ing => userIngredientNames.includes(ing));

        return hasAllIngredients && requiredCoreIngredients.length > 0;
    });

    // --- 3단계: 레시피 랭킹 및 최종 선택 ---
    const scoredRecipes = filteredRecipes.map(recipe => {
        let score = 0;
        // 3-1. 사용자 선호도 점수
        if (user.recipeRatings[recipe.id] === 'like') score += 20;
        if (user.recipeRatings[recipe.id] === 'dislike') score -= 50;

        // 3-2. 핵심 재료 사용 점수
        if (recipe.ingredients.some(ing => coreIngredients.map(ci => ci.name).includes(ing))) {
            score += 15;
        }

        // 3-3. 난이도 점수 (사용자 수준과 맞을수록 높은 점수)
        score += 5 - Math.abs(recipe.difficulty - user.profile.skillLevel);

        return { ...recipe, score };
    }).sort((a, b) => b.score - a.score);

    // --- 4단계: 최종 결과 조합 (다양성 확보) ---
    let finalRecommendations = [];
    const recommendedIds = new Set();

    // 4-1. 점수 상위 레시피 추가
    for (const recipe of scoredRecipes) {
        if (finalRecommendations.length < 2 && !recommendedIds.has(recipe.id)) {
            finalRecommendations.push(recipe);
            recommendedIds.add(recipe.id);
        }
    }
    
    // 4-2. 새로운 경험을 위한 '평가 없는' 레시피 추가
    const newExperienceRecipe = scoredRecipes.find(
        r => !user.recipeRatings[r.id] && !recommendedIds.has(r.id)
    );
    if (newExperienceRecipe) {
        finalRecommendations.push(newExperienceRecipe);
        recommendedIds.add(newExperienceRecipe.id);
    }

    // 4-3. 부족하면 다른 레시피로 채우기
    while (finalRecommendations.length < 3 && scoredRecipes.length > recommendedIds.size) {
        const nextRecipe = scoredRecipes.find(r => !recommendedIds.has(r.id));
        if (nextRecipe) {
            finalRecommendations.push(nextRecipe);
            recommendedIds.add(nextRecipe.id);
        } else {
            break; // 더 이상 추가할 레시피가 없음
        }
    }

    return finalRecommendations.slice(0, 4); // 최대 4개까지 추천
};


module.exports = { getRecommendations };