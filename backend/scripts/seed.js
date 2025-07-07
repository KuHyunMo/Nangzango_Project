const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const { Recipe, IngredientShelfLife } = require('../models/Recipe');

// 로컬 예제 데이터를 불러옵니다.
const usersData = require('../data/users');
const { recipes: recipesData, ingredientShelfLife: shelfLifeData } = require('../data/recipes');

const seedDatabase = async () => {
    // 1. 데이터베이스에 연결합니다.
    await connectDB();

    try {
        // 2. 기존에 있던 모든 데이터를 삭제하여 깨끗한 상태로 만듭니다.
        console.log('기존 데이터를 삭제합니다...');
        await User.deleteMany({});
        await Recipe.deleteMany({});
        await IngredientShelfLife.deleteMany({});

        // 3. 불러온 예제 데이터를 MongoDB 스키마에 맞게 가공하여 삽입합니다.
        console.log('새로운 데이터를 추가합니다...');
        
        // 사용자 데이터 추가
        const userArray = Object.keys(usersData).map(key => ({
            userId: key,
            ...usersData[key]
        }));
        await User.insertMany(userArray);

        // 레시피 데이터 추가
        await Recipe.insertMany(recipesData);

        // 소비기한 데이터 추가
        const shelfLifeArray = Object.keys(shelfLifeData).map(name => ({
            name: name,
            shelfLife: shelfLifeData[name]
        }));
        await IngredientShelfLife.insertMany(shelfLifeArray);

        console.log('✅ 데이터베이스 초기화 성공!');

    } catch (error) {
        console.error('❌ 데이터베이스 초기화 실패:', error);
    } finally {
        // 4. 작업이 끝나면 데이터베이스 연결을 종료합니다.
        mongoose.connection.close();
    }
};

// 스크립트를 실행합니다.
seedDatabase();
