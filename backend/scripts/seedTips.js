const mongoose = require('mongoose');
const connectDB = require('../config/db'); // connectDB 함수를 불러옵니다.
const Tip = require('../models/Tip');

// 데이터 파일을 불러옵니다. (이전 답변에서 생성한 파일)
const { tipsData } = require('../data/tips');

async function seed() {
  await connectDB(); // connectDB 함수를 호출하여 데이터베이스에 연결합니다.

  try {
    console.log('tip 데이터를 삭제합니다...');
    await Tip.deleteMany({});
    console.log('새로운 tip 데이터를 추가합니다...');
    await Tip.insertMany(tipsData);
    console.log('✅ tip 데이터 초기화 성공!');
  } catch (error) {
    console.error('❌ tip 데이터 초기화 실패:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();