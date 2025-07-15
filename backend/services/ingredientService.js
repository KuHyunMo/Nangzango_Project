const User = require('../models/User');
const { IngredientMaster } = require('../models/Recipe');

/**
 * 특정 유저의 모든 식재료를 반환합니다.
 */
const getIngredients = async (userId) => {
    // ❌ 수정 전: const user = await User.findOne({ userId });
    // ✅ 수정 후: MongoDB의 고유 ID(_id)로 사용자를 찾습니다.
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }

    const masterData = await IngredientMaster.find({});
    const masterDataMap = new Map(masterData.map(item => [item.name, item]));

    const ingredientsWithDaysLeft = user.ingredients.map(ing => {
        const masterInfo = masterDataMap.get(ing.name);
        let shelfLife = 7;

        if (masterInfo && masterInfo.shelfLife) {
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
        const daysLeft = Math.round((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        
        return { ...ing.toObject(), daysLeft };
    });

    return ingredientsWithDaysLeft.sort((a, b) => a.daysLeft - b.daysLeft);
};

/**
 * 새로운 식재료를 추가합니다.
 */
const addIngredient = async (userId, ingredientData) => {
    // ✅ 여기도 _id로 사용자를 찾도록 수정합니다.
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }
    const newIngredient = {
        name: ingredientData.name,
        quantity: ingredientData.quantity,
        storageMethod: ingredientData.storageMethod || '냉장',
        isOpened: ingredientData.isOpened || false,
        purchaseDate: new Date(),
    };
    user.ingredients.push(newIngredient);
    await user.save();
    return user.ingredients[user.ingredients.length - 1];
};

/**
 * 식재료 정보를 수정합니다.
 */
const updateIngredient = async (userId, ingredientId, updateData) => {
    // ✅ 여기도 _id로 사용자를 찾도록 수정합니다.
    const user = await User.findById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    const ingredient = user.ingredients.id(ingredientId);
    if (!ingredient) throw new Error("재료를 찾을 수 없습니다.");

    Object.keys(updateData).forEach(key => {
        ingredient[key] = updateData[key];
    });
    
    await user.save();
    return ingredient;
};

/**
 * 식재료를 삭제합니다.
 */
const deleteIngredient = async (userId, ingredientId) => {
    // ✅ 여기도 _id로 사용자를 찾도록 수정합니다.
    const user = await User.findById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    const ingredient = user.ingredients.id(ingredientId);
    if (!ingredient) throw new Error("재료를 찾을 수 없습니다.");

    user.ingredients.pull({ _id: ingredientId });
    await user.save();
};

module.exports = {
    getIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
};
