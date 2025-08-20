const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
// IngredientMaster를 함께 불러오도록 수정
const { IngredientMaster } = require('../models/Ingredients');

// 업데이트된 데이터 파일을 불러옴
const usersData = require('../data/users');
const { ingredientMasterData } = require('../data/ingredients');

const seedDatabase = async () => {
    await connectDB();

    try {
        console.log('기존 식재료 데이터를 삭제합니다...');
        await User.deleteMany({});
        // IngredientShelfLife 대신 IngredientMaster의 데이터를 삭제
        await IngredientMaster.deleteMany({});

        console.log('새로운 식재료 데이터를 추가합니다...');
        
        // 사용자 데이터 추가
        const userArray = Object.keys(usersData).map(key => ({
            userId: key,
            ...usersData[key]
        }));
        await User.insertMany(userArray);

        // 식재료 마스터 데이터 추가
        await IngredientMaster.insertMany(ingredientMasterData);

        console.log('✅ 식재료 데이터베이스 초기화 성공!');
    } catch (error) {
        console.error('❌ 식재료 데이터베이스 초기화 실패:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
