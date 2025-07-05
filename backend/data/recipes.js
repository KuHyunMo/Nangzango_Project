// 레시피 마스터 데이터를 시뮬레이션합니다.
const recipes = [
  { 
    id: "recipe001",
    name: "김치찌개",
    ingredients: ["돼지고기", "김치", "대파", "양파"],
    cookTime: 30, // 분
    difficulty: 2, // 1-5점
    nutritionType: "balance" // 영양 균형 타입
  },
  { 
    id: "recipe002",
    name: "제육볶음",
    ingredients: ["돼지고기", "양파", "대파", "고추장"],
    cookTime: 25,
    difficulty: 3,
    nutritionType: "protein_focus"
  },
  { 
    id: "recipe003",
    name: "계란찜",
    ingredients: ["계란", "대파"],
    cookTime: 15,
    difficulty: 1,
    nutritionType: "balance"
  },
  { 
    id: "recipe004",
    name: "양파덮밥",
    ingredients: ["양파", "계란", "간장"],
    cookTime: 20,
    difficulty: 2,
    nutritionType: "carb_focus"
  },
  { 
    id: "recipe005",
    name: "파기름 계란볶음밥",
    ingredients: ["계란", "대파", "밥"],
    cookTime: 15,
    difficulty: 1,
    nutritionType: "carb_focus"
  }
];

// 식재료별 평균 소비기한 (일)
const ingredientShelfLife = {
  "돼지고기": 3,
  "김치": 60,
  "양파": 14,
  "대파": 7,
  "계란": 21
};

module.exports = { recipes, ingredientShelfLife };