const User = require('../models/User');
const { IngredientMaster } = require('../models/Recipe');

const getIngredients = async (userId) => {
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }

    const masterData = await IngredientMaster.find({});
    const masterDataMap = new Map(masterData.map(item => [item.name, item]));

    const ingredientsWithDaysLeft = user.ingredients.map(ing => {
        const masterInfo = masterDataMap.get(ing.name);
        let shelfLife = 7; // 기본값

        if (masterInfo && masterInfo.shelfLife) {
            // isOpened 상태에 따라 사용할 소비기한 객체를 선택
            const shelfLifeGroup = ing.isOpened ? masterInfo.shelfLife.opened : masterInfo.shelfLife.unopened;

            if (shelfLifeGroup) {
                switch (ing.storageMethod) {
                    case '실온':
                        shelfLife = shelfLifeGroup.room_temp || 7;
                        break;
                    case '냉장':
                        shelfLife = shelfLifeGroup.fridge || 14;
                        break;
                    case '냉동':
                        shelfLife = shelfLifeGroup.freezer || 90;
                        break;
                    default:
                        shelfLife = shelfLifeGroup.fridge || 14;
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

// addIngredient, updateIngredient, deleteIngredient 함수는 이전과 동일하므로 생략...
const addIngredient = async (userId, ingredientData) => {
    const user = await User.findOne({ userId });
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

const updateIngredient = async (userId, ingredientId, updateData) => {
    const user = await User.findOne({ userId });
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");
    const ingredient = user.ingredients.id(ingredientId);
    if (!ingredient) throw new Error("재료를 찾을 수 없습니다.");
    Object.keys(updateData).forEach(key => {
        ingredient[key] = updateData[key];
    });
    await user.save();
    return ingredient;
};

const deleteIngredient = async (userId, ingredientId) => {
    const user = await User.findOne({ userId });
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
