const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// IngredientMaster와 TempIngredientMaster가 공유할 스키마를 먼저 정의합니다.
const IngredientMasterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    defaultStoreMethod: {
        type: String,
        enum: ['냉장', '냉동', '실온'],
        default: '냉장',
    },
    storageTips: String,
    spoilageInfo: String,
    allergyInfo: String,
    shelfLife: {
        unopened: {
            room_temp: Number, // 일 단위
            fridge: Number,
            freezer: Number,
        },
        opened: {
            room_temp: Number,
            fridge: Number,
            freezer: Number,
        },
    },
});

// 기존 IngredientMaster 모델을 정의하고 내보냅니다.
const IngredientMaster = mongoose.model('IngredientMaster', IngredientMasterSchema);

// 요청하신 TempIngredientMaster 모델을 정의합니다.
// IngredientMasterSchema를 재사용하여 양식을 동일하게 만듭니다.
const TempIngredientMaster = mongoose.model('TempIngredientMaster', IngredientMasterSchema);

// 두 모델을 모두 내보내도록 수정합니다.
module.exports = {
    IngredientMaster,
    TempIngredientMaster,
};