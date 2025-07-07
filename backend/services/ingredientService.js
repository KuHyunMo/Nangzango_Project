const User = require('../models/User');
const { IngredientShelfLife } = require('../models/Recipe');

/**
 * 특정 유저의 모든 식재료를 반환
 */
const getIngredients = async (userId) => {
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error("User not found");
    }

    // 각 재료의 유통기한 계산을 위해 모든 shelfLife 정보를 가져옴
    const shelfLives = await IngredientShelfLife.find({});
    const shelfLifeMap = new Map(shelfLives.map(item => [item.name, item.shelfLife]));

    const ingredientsWithDaysLeft = user.ingredients.map(ing => {
        const shelfLife = shelfLifeMap.get(ing.name) || 7; // DB에 없으면 기본 7일
        const expiryDate = new Date(ing.purchaseDate);
        expiryDate.setDate(expiryDate.getDate() + shelfLife);
        const daysLeft = Math.round((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        // Mongoose Subdocument는 일반 객체가 아니므로 toObject()로 변환 후 속성 추가
        return { ...ing.toObject(), daysLeft };
    });

    return ingredientsWithDaysLeft.sort((a, b) => a.daysLeft - b.daysLeft);
};

/**
 * 새로운 식재료 추가
 */
const addIngredient = async (userId, { name, quantity }) => {
    const user = await User.findOne({ userId });
    if (!user) {
        throw new Error("User not found");
    }
    const newIngredient = {
        name,
        quantity,
        purchaseDate: new Date(),
    };
    user.ingredients.push(newIngredient);
    await user.save();
    // 마지막에 추가된 재료를 반환
    return user.ingredients[user.ingredients.length - 1];
};

/**
 * 식재료 정보 수정 (수량)
 */
const updateIngredient = async (userId, ingredientId, { quantity }) => {
    const user = await User.findOne({ userId });
    if (!user) throw new Error("User not found");

    // Mongoose Subdocument는 .id() 메소드로 찾을 수 있습니다.
    const ingredient = user.ingredients.id(ingredientId);
    if (!ingredient) throw new Error("Ingredient not found");

    ingredient.quantity = quantity;
    await user.save();
    return ingredient;
};

/**
 * 식재료 삭제
 */
const deleteIngredient = async (userId, ingredientId) => {
    const user = await User.findOne({ userId });
    if (!user) throw new Error("User not found");

    const ingredient = user.ingredients.id(ingredientId);
    if (!ingredient) throw new Error("Ingredient not found");

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
