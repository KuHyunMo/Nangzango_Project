const User = require('../models/User');
const { IngredientMaster, TempIngredientMaster } = require('../models/Ingredients');
const fetch = require('node-fetch');

/**
 * Gemini API를 호출하여 식재료의 상세 정보를 가져옵니다.
 * @param {string} ingredientName - 정보를 조회할 식재료 이름
 * @returns {Promise<object|null>} 생성된 식재료 상세 정보 객체 또는 실패 시 null
 */
async function getIngredientDetailsFromAI(ingredientName) {
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `
        "${ingredientName}" 식재료에 대한 상세 보관 정보를 JSON 객체 형태로 제공해주세요. 다음 필드를 포함해야 합니다:
        - "name": 식재료 이름 (예: "대파")
        - "defaultStoreMethod": 기본 권장 보관 방법 (예: "냉장", "실온", "냉동")
        - "storageTips": 보관 팁 (문자열)
        - "spoilageInfo": 상함 신호 (문자열)
        - "allergyInfo": 알레르기 정보 (문자열, 없으면 빈 문자열 "")
        - "shelfLife": 보관 기간 정보 (JSON 객체)
            - "unopened": 개봉 전 보관 기간 (JSON 객체)
                - "room_temp": 실온 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
                - "fridge": 냉장 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
                - "freezer": 냉동 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
            - "opened": 개봉 후 보관 기간 (JSON 객체)
                - "room_temp": 실온 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
                - "fridge": 냉장 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
                - "freezer": 냉동 보관 시 최대 소비기한 (일, 숫자, 없으면 null)

        예시:
        \`\`\`json
        {
            "name": "두부",
            "defaultStoreMethod": "냉장",
            "storageTips": "개봉 후에는 용기에 두부가 잠길 만큼의 물과 함께 담아 밀폐하여 냉장 보관하고, 가급적 1-3일 내에 섭취하세요.",
            "spoilageInfo": "표면이 미끈거리고 시큼한 냄새가 나며, 포장 용기 안의 물이 탁해지면 상한 것입니다.",
            "allergyInfo": "대두",
            "shelfLife": {
                "unopened": { "room_temp": 1, "fridge": 7, "freezer": 60 },
                "opened": { "room_temp": null, "fridge": 2, "freezer": 60 }
            }
        }
        \`\`\`
        다른 부가적인 설명은 절대 추가하지 마세요. 오직 JSON 객체만 반환해야 합니다.
    `;

    try {
        const response = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API 오류 응답 (식재료 상세) - 원본 텍스트:', errorText);
            throw new Error(`Gemini API (식재료 상세) 호출 실패: ${response.statusText}`);
        }

        const data = await response.json();
        let jsonString = data.candidates[0]?.content?.parts[0]?.text;

        const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
        }

        const ingredientDetails = JSON.parse(jsonString);
        return ingredientDetails;

    } catch (error) {
        console.error(`Gemini를 통한 '${ingredientName}' 식재료 상세 정보 가져오기 실패:`, error);
        return null;
    }
}


// (기존 getIngredients, addIngredient 등 함수들은 변경 없음)
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
const getIngredientMasterByName = async (name) => {
    const normalizedName = name.toLowerCase().replace(/\s/g, '');
    const masterItem = await IngredientMaster.findOne({
        name: { $regex: new RegExp(`^${normalizedName}$`, 'i') } 
    });
    if (!masterItem) {
        const tempMasterItem=await TempIngredientMaster.findOne({ name: { $regex: new RegExp(`^${normalizedName}$`, 'i') } });
        return tempMasterItem;
    }
    return masterItem;
};

// TempIngredientMaster에서 이름으로 식재료 정보 조회 (추가)
const getTempIngredientMasterByName = async (name) => {
    const tempMasterItem = await TempIngredientMaster.findOne({ name: { $regex: new RegExp(name, 'i') } });
    return tempMasterItem;
};
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
const updateIngredientPreference = async (userId, ingredientId, preference) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");
    const ingredient = user.ingredients.id(ingredientId);
    if (!ingredient) throw new Error("재료를 찾을 수 없습니다.");

    const allowedPreferences = ['none', 'must-use', 'must-not-use'];
    if (!allowedPreferences.includes(preference)) {
        throw new Error("유효하지 않은 선호도 값입니다.");
    }

    ingredient.preference = preference;
    await user.save();
    return ingredient;
};

// ✅ [추가] 마스터 식재료를 찾거나 생성하는 함수
const findOrCreateMasterIngredient = async (name) => {
    // 1. 기존 데이터 확인
    const existingMaster = await getIngredientMasterByName(name);
    if (existingMaster) {
        console.log(`기존 마스터 데이터 사용: ${name}`);
        return existingMaster;
    }

    // 2. 없으면 Gemini API로 생성
    console.log(`새로운 식재료: '${name}'. Gemini API로 정보 생성 중...`);
    const details = await getIngredientDetailsFromAI(name);
    if (!details) {
        return null; // 생성 실패
    }

    // 3. 데이터베이스에 저장
    const newMaster = new TempIngredientMaster(details);
    await newMaster.save();
    console.log(`새로운 마스터 데이터 저장 완료: ${name}`);
    return newMaster;
};


module.exports = {
    getIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    batchUpdateIngredients,
    getIngredientMasterByName,
    getTempIngredientMasterByName,
    addMultipleIngredientsToUser,
    addMultipleIngredientMasters,
    updateIngredientPreference,
    findOrCreateMasterIngredient, // ✅ 추가
    addMultipleTempIngredientMasters,
};
