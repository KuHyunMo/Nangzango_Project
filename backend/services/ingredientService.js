const User = require('../models/User');
const { IngredientMaster } = require('../models/Recipe');

// (getIngredients, addIngredient, updateIngredient, deleteIngredient 함수는 이전과 동일)
const getIngredients = async (userId) => {
    const user = await User.findById(userId);
    if (!user) { throw new Error("사용자를 찾을 수 없습니다."); }
    const masterData = await IngredientMaster.find({});
    const masterDataMap = new Map(masterData.map(item => [item.name, item]));
    const ingredientsWithDaysLeft = user.ingredients.map(ing => {
        try {
            const masterInfo = masterDataMap.get(ing.name);
            let finalShelfLife = 7;
            if (masterInfo && masterInfo.shelfLife) {
                const shelfLifeGroup = ing.isOpened ? masterInfo.shelfLife.opened : masterInfo.shelfLife.unopened;
                if (shelfLifeGroup) {
                    let period;
                    if (ing.storageMethod === '실온') period = shelfLifeGroup.room_temp;
                    else if (ing.storageMethod === '냉장') period = shelfLifeGroup.fridge;
                    else if (ing.storageMethod === '냉동') period = shelfLifeGroup.freezer;
                    if (typeof period === 'number') {
                        finalShelfLife = period;
                    } else {
                        const defaultMethod = masterInfo.defaultStoreMethod;
                        let defaultPeriod;
                        if (defaultMethod === '실온') defaultPeriod = shelfLifeGroup.room_temp;
                        else if (defaultMethod === '냉장') defaultPeriod = shelfLifeGroup.fridge;
                        else if (defaultMethod === '냉동') defaultPeriod = shelfLifeGroup.freezer;
                        if (typeof defaultPeriod === 'number') {
                            finalShelfLife = defaultPeriod;
                        }
                    }
                }
            }
            const purchaseDate = ing.purchaseDate ? new Date(ing.purchaseDate) : new Date();
            const expiryDate = new Date(purchaseDate);
            if (typeof finalShelfLife === 'number') {
                expiryDate.setDate(expiryDate.getDate() + finalShelfLife);
            }
            const daysLeft = Math.round((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
            return { ...ing.toObject(), daysLeft: isNaN(daysLeft) ? null : daysLeft };
        } catch (e) {
            console.error(`Error processing ingredient ${ing.name}:`, e);
            return { ...ing.toObject(), daysLeft: null };
        }
    });
    return ingredientsWithDaysLeft.sort((a, b) => (a.daysLeft ?? 9999) - (b.daysLeft ?? 9999));
};
const addIngredient = async (userId, ingredientData) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");
    let storageMethod = ingredientData.storageMethod;
    if (!storageMethod) {
        const masterInfo = await IngredientMaster.findOne({ name: ingredientData.name });
        storageMethod = masterInfo ? masterInfo.defaultStoreMethod : '냉장';
    }
    const newIngredient = {
        name: ingredientData.name,
        quantity: ingredientData.quantity,
        storageMethod: storageMethod,
        isOpened: ingredientData.isOpened || false,
        purchaseDate: new Date(),
    };
    user.ingredients.push(newIngredient);
    await user.save();
    return user.ingredients[user.ingredients.length - 1];
};
const updateIngredient = async (userId, ingredientId, updateData) => {
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
const deleteIngredient = async (userId, ingredientId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");
    const ingredient = user.ingredients.id(ingredientId);
    if (!ingredient) throw new Error("재료를 찾을 수 없습니다.");
    user.ingredients.pull({ _id: ingredientId });
    await user.save();
};

// ✅ 핵심 수정: '없음' 상태를 삭제 로직으로 처리합니다.
const batchUpdateIngredients = async (userId, updates) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.');
    }

    for (const update of updates) {
        const { ingredientId, name, newQuantity, isNewLeftover } = update;

        if (isNewLeftover) {
            user.ingredients.push({
                name: name,
                quantity: '자투리',
                isOpened: true, 
                storageMethod: '냉장',
                purchaseDate: new Date()
            });
        } else if (newQuantity === '없음') {
            // '없음'으로 변경되면 해당 재료를 배열에서 제거(삭제)합니다.
            user.ingredients.pull({ _id: ingredientId });
        } else {
            // '있음' 또는 '자투리'로 변경되면 기존 재료를 수정합니다.
            const ingredientToUpdate = user.ingredients.id(ingredientId);
            if (ingredientToUpdate) {
                ingredientToUpdate.quantity = newQuantity;
                if (newQuantity === '자투리') {
                    ingredientToUpdate.isOpened = true;
                }
            }
        }
    }

    await user.save();
};

module.exports = {
    getIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    batchUpdateIngredients,
};
