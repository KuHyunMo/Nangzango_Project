const User = require('../models/User');
// Recipe 모델 대신 IngredientMaster 모델을 불러옵니다.
const { IngredientMaster } = require('../models/Recipe');

/**
 * 특정 유저의 모든 식재료를 반환합니다.
 * 보관 방식에 따라 유통기한을 다르게 계산합니다.
 */
const getIngredients = async (userId) => {
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }

    // 모든 식재료 마스터 정보를 한번에 가져와서 Map으로 만들어 성능을 최적화합니다.
    const masterData = await IngredientMaster.find({});
    const masterDataMap = new Map(masterData.map(item => [item.name, item.shelfLife]));

    const ingredientsWithDaysLeft = user.ingredients.map(ing => {
        const shelfLifeData = masterDataMap.get(ing.name);
        let shelfLife = 7; // 기본값 7일

        if (shelfLifeData) {
            switch (ing.storageMethod) {
                case '실온':
                    shelfLife = shelfLifeData.room_temp || 7;
                    break;
                case '냉장':
                    shelfLife = shelfLifeData.fridge || 14;
                    break;
                case '냉동':
                    shelfLife = shelfLifeData.freezer || 90;
                    break;
                default:
                    shelfLife = shelfLifeData.fridge || 14;
            }
        }
        
        const expiryDate = new Date(ing.purchaseDate);
        expiryDate.setDate(expiryDate.getDate() + shelfLife);
        const daysLeft = Math.round((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        
        // Mongoose Subdocument는 일반 객체가 아니므로 toObject()로 변환 후 속성 추가
        return { ...ing.toObject(), daysLeft };
    });

    // 유통기한 임박 순으로 정렬하여 반환
    return ingredientsWithDaysLeft.sort((a, b) => a.daysLeft - b.daysLeft);
};

/**
 * 새로운 식재료를 추가합니다.
 */
const addIngredient = async (userId, ingredientData) => {
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다.");
    }
    // isOpened, storageMethod 등 추가된 필드도 함께 받습니다.
    const newIngredient = {
        name: ingredientData.name,
        quantity: ingredientData.quantity,
        storageMethod: ingredientData.storageMethod || '냉장',
        isOpened: ingredientData.isOpened || false,
        purchaseDate: new Date(),
    };
    user.ingredients.push(newIngredient);
    await user.save();
    // 마지막에 추가된 재료를 반환
    return user.ingredients[user.ingredients.length - 1];
};

/**
 * 식재료 정보를 수정합니다. (수량, 보관방식 등)
 */
const updateIngredient = async (userId, ingredientId, updateData) => {
    const user = await User.findOne({ userId });
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    // Mongoose Subdocument는 .id() 메소드로 찾을 수 있습니다.
    const ingredient = user.ingredients.id(ingredientId);
    if (!ingredient) throw new Error("재료를 찾을 수 없습니다.");

    // 전달된 모든 필드를 업데이트합니다.
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
    const user = await User.findOne({ userId });
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    const ingredient = user.ingredients.id(ingredientId);
    if (!ingredient) throw new Error("재료를 찾을 수 없습니다.");

    // Mongoose 8.x 버전부터는 .remove() 대신 pull()을 사용합니다.
    user.ingredients.pull({ _id: ingredientId });
    await user.save();
};

module.exports = {
    getIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
};
