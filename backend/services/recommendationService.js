const User = require('../models/User');
const { Recipe, IngredientMaster } = require('../models/Recipe');

const TODAY = new Date();

const daysBetween = (date1, date2) => {
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.round((date2 - date1) / oneDay);
};

const getRecommendations = async (userId, availableTime, tempExcludeIngredients = []) => {
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }
    const allRecipes = await Recipe.find({});
    const masterIngredients = await IngredientMaster.find({});
    const masterIngredientMap = new Map(masterIngredients.map(item => [item.name, item]));

    const ingredientsWithExpiry = user.ingredients
      .filter(ing => ing.quantity !== '없음' && ing.quantity !== 'invisible')
      .map(ing => {
        const masterInfo = masterIngredientMap.get(ing.name);
        let shelfLife = 7;

        if (masterInfo && masterInfo.shelfLife) {
            // isOpened 상태에 따라 사용할 소비기한 객체를 선택
            const shelfLifeGroup = ing.isOpened ? masterInfo.shelfLife.opened : masterInfo.shelfLife.unopened;
            
            if (shelfLifeGroup) {
                switch (ing.storageMethod) {
                    case '실온': shelfLife = shelfLifeGroup.room_temp || 7; break;
                    case '냉장': shelfLife = shelfLifeGroup.fridge || 14; break;
                    case '냉동': shelfLife = shelfLifeGroup.freezer || 90; break;
                    default: shelfLife = shelfLifeGroup.fridge || 14;
                }
            }
        }
        
        const expiryDate = new Date(ing.purchaseDate);
        expiryDate.setDate(expiryDate.getDate() + shelfLife);
        const daysLeft = daysBetween(TODAY, expiryDate);
        return { ...ing.toObject(), daysLeft };
    });

    // ... (이하 추천 필터링 및 랭킹 로직은 이전과 동일하므로 생략) ...
    const expiringSoonIngredients = ingredientsWithExpiry
        .filter(ing => ing.daysLeft <= 3 && !tempExcludeIngredients.includes(ing.name))
        .sort((a, b) => a.daysLeft - b.daysLeft);
    
    const coreIngredients = expiringSoonIngredients.length > 0 
        ? expiringSoonIngredients.slice(0, 2)
        : ingredientsWithExpiry.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 2);

    console.log("🎯 핵심 재료:", coreIngredients.map(i => i.name));

    const filteredRecipes = allRecipes.filter(recipe => {
        if (recipe.cookTime > availableTime) return false;
        if (recipe.ingredients.some(ing => user.profile.allergies.includes(ing))) return false;
        if (recipe.ingredients.some(ing => tempExcludeIngredients.includes(ing))) return false;
        const userIngredientNames = user.ingredients.map(i => i.name);
        const hasAllIngredients = recipe.ingredients.every(ing => userIngredientNames.includes(ing));
        return hasAllIngredients && recipe.ingredients.length > 0;
    });

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
