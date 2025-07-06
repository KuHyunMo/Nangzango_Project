// 이 파일은 backend/services 폴더에 새로 만들어주세요.
const users = require('../data/users');
const { ingredientShelfLife } = require('../data/recipes');
const { v4: uuidv4 } = require('uuid'); // 고유 ID 생성을 위한 라이브러리

// --- 데이터베이스 역할을 하는 임시 데이터 ---
// 실제 프로젝트에서는 이 부분을 DB와 연동해야 합니다.
let inMemoryUsers = JSON.parse(JSON.stringify(users)); // 원본 데이터 수정을 방지하기 위해 깊은 복사

// npm install uuid
// 백엔드 폴더의 터미널에서 위 명령어를 실행해주세요.

/**
 * 특정 유저의 모든 식재료를 반환
 */
const getIngredients = (userId) => {
    if (!inMemoryUsers[userId]) {
        throw new Error("User not found");
    }
    // 유통기한 계산 로직 추가
    return inMemoryUsers[userId].ingredients.map(ing => {
        const shelfLife = ingredientShelfLife[ing.name] || 7;
        const purchaseDate = new Date(ing.purchaseDate);
        const expiryDate = new Date(purchaseDate);
        expiryDate.setDate(purchaseDate.getDate() + shelfLife);
        const daysLeft = Math.round((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        return { ...ing, daysLeft };
    }).sort((a,b) => a.daysLeft - b.daysLeft); // 유통기한 임박 순으로 정렬
};

/**
 * 새로운 식재료 추가
 */
const addIngredient = (userId, { name, quantity }) => {
    if (!inMemoryUsers[userId]) {
        throw new Error("User not found");
    }
    const newIngredient = {
        id: uuidv4(), // 고유 ID 생성
        name,
        purchaseDate: new Date().toISOString().split('T')[0], // 오늘 날짜
        quantity,
    };
    inMemoryUsers[userId].ingredients.push(newIngredient);
    return newIngredient;
};

/**
 * 식재료 정보 수정 (여기서는 수량만)
 */
const updateIngredient = (userId, ingredientId, { quantity }) => {
    if (!inMemoryUsers[userId]) {
        throw new Error("User not found");
    }
    const ingredientIndex = inMemoryUsers[userId].ingredients.findIndex(ing => ing.id === ingredientId);
    if (ingredientIndex === -1) {
        throw new Error("Ingredient not found");
    }
    inMemoryUsers[userId].ingredients[ingredientIndex].quantity = quantity;
    return inMemoryUsers[userId].ingredients[ingredientIndex];
};

/**
 * 식재료 삭제
 */
const deleteIngredient = (userId, ingredientId) => {
    if (!inMemoryUsers[userId]) {
        throw new Error("User not found");
    }
    const initialLength = inMemoryUsers[userId].ingredients.length;
    inMemoryUsers[userId].ingredients = inMemoryUsers[userId].ingredients.filter(ing => ing.id !== ingredientId);
    if (inMemoryUsers[userId].ingredients.length === initialLength) {
        throw new Error("Ingredient not found");
    }
};


module.exports = {
    getIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
};
