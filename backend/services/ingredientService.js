const User = require('../models/User');
const { IngredientMaster, TempIngredientMaster } = require('../models/Ingredients');

// (getIngredients, addIngredient, updateIngredient, deleteIngredient 함수는 이전과 동일)
const getIngredients = async (userId) => {
    const user = await User.findById(userId);
    if (!user) { throw new Error("사용자를 찾을 수 없습니다."); }

    // IngredientMaster와 TempIngredientMaster 데이터를 모두 가져와 합칩니다.
    const masterData = await IngredientMaster.find({});
    const tempMasterData = await TempIngredientMaster.find({});
    const masterDataMap = new Map(masterData.map(item => [item.name, item]));
    tempMasterData.forEach(item => masterDataMap.set(item.name, item));

    const ingredientsWithDaysLeft = user.ingredients.map(ing => {
        try {
            const masterInfo = masterDataMap.get(ing.name);
            let finalShelfLife = 7; // 기본값

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
        // IngredientMaster 먼저 확인, 없으면 TempIngredientMaster 확인
        let masterInfo = await IngredientMaster.findOne({ name: ingredientData.name });
        if (!masterInfo) {
            masterInfo = await TempIngredientMaster.findOne({ name: ingredientData.name });
        }
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
            user.ingredients.pull({ _id: ingredientId });
        } else {
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

// IngredientMaster에서 이름으로 식재료 정보 조회
const getIngredientMasterByName = async (name) => {
    const masterItem = await IngredientMaster.findOne({ name: { $regex: new RegExp(name, 'i') } });
    return masterItem;
};

// TempIngredientMaster에서 이름으로 식재료 정보 조회 (추가)
const getTempIngredientMasterByName = async (name) => {
    const tempMasterItem = await TempIngredientMaster.findOne({ name: { $regex: new RegExp(name, 'i') } });
    return tempMasterItem;
};

// 사용자에게 여러 식재료를 일괄 추가하는 함수
const addMultipleIngredientsToUser = async (userId, ingredientsArray) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    let savedCount = 0;
    for (const ingData of ingredientsArray) {
        const existingIngredient = user.ingredients.find(
            (ing) => ing.name === ingData.name && ing.purchaseDate.toISOString().split('T')[0] === ingData.purchaseDate
        );
        if (!existingIngredient) {
            user.ingredients.push(ingData);
            savedCount++;
        } else {
            console.log(`중복된 식재료 '${ingData.name}' (${ingData.purchaseDate})는 추가하지 않습니다.`);
        }
    }
    await user.save();
    return savedCount;
};

// IngredientMaster에 여러 식재료 마스터 정보를 추가하는 함수
const addMultipleIngredientMasters = async (masterDataArray) => {
    let newAddCount = 0;
    for (const masterData of masterDataArray) {
        const existingMaster = await IngredientMaster.findOne({ name: masterData.name });
        if (!existingMaster) {
            const newMaster = new IngredientMaster(masterData);
            await newMaster.save();
            newAddCount++;
        } else {
            console.log(`IngredientMaster에 이미 '${masterData.name}'이(가) 존재합니다.`);
        }
    }
    return newAddCount;
};

// TempIngredientMaster에 여러 식재료 마스터 정보를 추가하는 함수 (추가)
const addMultipleTempIngredientMasters = async (masterDataArray) => {
    let newAddCount = 0;
    for (const masterData of masterDataArray) {
        const existingMaster = await TempIngredientMaster.findOne({ name: masterData.name });
        if (!existingMaster) {
            const newMaster = new TempIngredientMaster(masterData);
            await newMaster.save();
            newAddCount++;
        } else {
            console.log(`TempIngredientMaster에 이미 '${masterData.name}'이(가) 존재합니다.`);
        }
    }
    return newAddCount;
};

module.exports = {
    getIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    batchUpdateIngredients,
    getIngredientMasterByName,
    getTempIngredientMasterByName, // ✅ 추가
    addMultipleIngredientsToUser,
    addMultipleIngredientMasters,
    addMultipleTempIngredientMasters, // ✅ 추가
};