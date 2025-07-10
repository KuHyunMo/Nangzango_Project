// 레시피 및 식재료 마스터 데이터를 시뮬레이션합니다.

const recipes = [
  { 
    id: "recipe001",
    name: "김치찌개",
    ingredients: ["돼지고기", "김치", "대파", "양파", "두부"],
    cookTime: 30,
    difficulty: 2.5,
    nutritionInfo: { calories: 450, protein: 25, carbs: 15, fat: 30 },
    instructions: "1. 돼지고기와 김치를 볶는다.\n2. 물을 넣고 끓인다.\n3. 대파, 양파, 두부를 넣고 더 끓인다."
  },
  { 
    id: "recipe002",
    name: "제육볶음",
    ingredients: ["돼지고기", "양파", "대파", "고추장"],
    cookTime: 25,
    difficulty: 3.0,
    nutritionInfo: { calories: 600, protein: 35, carbs: 30, fat: 38 },
    instructions: "1. 양념장을 만든다.\n2. 돼지고기와 야채를 양념장에 버무린다.\n3. 팬에 넣고 볶는다."
  },
  { 
    id: "recipe003",
    name: "계란찜",
    ingredients: ["계란", "대파", "소금"],
    cookTime: 15,
    difficulty: 1.5,
    nutritionInfo: { calories: 150, protein: 12, carbs: 3, fat: 9 },
    instructions: "1. 계란을 풀고 물과 섞는다.\n2. 대파와 소금을 넣는다.\n3. 뚝배기에 넣고 약불에서 익힌다."
  },
];

const ingredientMasterData = [
  {
    name: "돼지고기",
    storageTips: "밀봉하여 김치냉장고 또는 냉장실 가장 안쪽에 보관하세요.",
    spoilageInfo: "색이 검게 변하거나 시큼한 냄새가 나면 상한 것입니다.",
    allergyInfo: "돼지고기 알러지가 있는 경우 주의하세요.",
    shelfLife: { room_temp: 0, fridge: 3, freezer: 90 }
  },
  {
    name: "김치",
    storageTips: "공기가 통하지 않도록 꾹꾹 눌러 냉장 보관하세요.",
    spoilageInfo: "표면에 흰색 곰팡이(골마지)가 생길 수 있으나, 걷어내고 드셔도 괜찮습니다. 시큼한 냄새가 너무 심하면 상한 것입니다.",
    allergyInfo: "젓갈류에 알러지가 있는 경우 성분을 확인하세요.",
    shelfLife: { room_temp: 3, fridge: 180, freezer: 365 }
  },
  {
    name: "양파",
    storageTips: "껍질을 까지 않은 채로 서늘하고 건조한 곳에 보관하세요. 깐 양파는 밀폐용기에 담아 냉장 보관하세요.",
    spoilageInfo: "물러지거나 곰팡이가 피면 상한 것입니다.",
    allergyInfo: "",
    shelfLife: { room_temp: 30, fridge: 14, freezer: 180 }
  },
  {
    name: "대파",
    storageTips: "뿌리 부분을 잘라내고 키친타월에 싸서 냉장 보관하면 더 오래 갑니다. 썰어서 냉동 보관하면 사용이 편리합니다.",
    spoilageInfo: "잎이 마르거나 진물이 나오면 상하기 시작한 것입니다.",
    allergyInfo: "",
    shelfLife: { room_temp: 5, fridge: 14, freezer: 30 }
  },
  {
    name: "계란",
    storageTips: "뾰족한 부분이 아래로 향하게 하여 냉장고 안쪽에 보관하세요. 문 쪽은 온도 변화가 심해 좋지 않습니다.",
    spoilageInfo: "물에 넣었을 때 뜨거나, 흔들었을 때 내용물이 출렁이는 느낌이 들면 상한 계란입니다.",
    allergyInfo: "계란 알러지가 있는 경우 주의하세요.",
    shelfLife: { room_temp: 7, fridge: 30, freezer: 0 }
  }
];

module.exports = { recipes, ingredientMasterData };
