// 레시피 및 식재료 마스터 데이터를 시뮬레이션합니다.
// 이 파일은 `node scripts/seed.js` 실행 시 MongoDB에 초기 데이터를 삽입하는 데 사용됩니다.

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
    // 1. 채소 및 버섯류
    {
        name: "깻잎",
        defaultStoreMethod: "냉장",
        storageTips: "잎자루를 물에 적신 키친타월로 감싸거나 세워서 냉장 보관하세요. 냉동은 향과 식감을 파괴하므로 권장하지 않습니다.",
        spoilageInfo: "잎이 검게 변하거나 흐물흐물해지고, 풋내가 아닌 썩은 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 1, fridge: 21, freezer: null },
            opened: { room_temp: null, fridge: 3, freezer: null }
        }
    },
    {
        name: "당근",
        defaultStoreMethod: "냉장",
        storageTips: "흙을 씻어내고 물기를 제거한 뒤, 키친타월이나 랩으로 감싸 냉장 보관하세요. 잘라서 냉동하면 장기 보관이 가능합니다.",
        spoilageInfo: "표면이 물러지거나 검은 반점이 생기고, 탄력이 없으며 쉽게 휘어지면 신선도가 떨어진 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 7, fridge: 14, freezer: 60 },
            opened: { room_temp: null, fridge: 4, freezer: 60 }
        }
    },
    {
        name: "대파",
        defaultStoreMethod: "냉장",
        storageTips: "밀폐 용기에 키친타월과 함께 보관하면 2-3주 신선도가 유지됩니다. 용도에 맞게 잘라서 냉동하면 장기 보관이 가능합니다.",
        spoilageInfo: "잎 부분이 노랗게 변하거나 진물이 나오고, 미끈거리며 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 3, fridge: 21, freezer: 60 },
            opened: { room_temp: null, fridge: 5, freezer: 60 }
        }
    },
    {
        name: "마늘",
        defaultStoreMethod: "실온",
        storageTips: "통마늘은 껍질째로 망에 담아 서늘하고 통풍이 잘 되는 곳에 보관하세요. 다진 마늘은 냉동 보관하는 것이 좋습니다.",
        spoilageInfo: "마늘 알이 물렁해지거나, 싹이 나고, 푸른색 또는 검은색 곰팡이가 피면 사용하지 마세요.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 180, fridge: 180, freezer: 90 },
            opened: { room_temp: 1, fridge: 5, freezer: 90 }
        }
    },
    {
        name: "무",
        defaultStoreMethod: "냉장",
        storageTips: "잎을 자르고 신문지에 싸서 냉장 보관하세요. 겨울철에는 얼지 않게 베란다에 보관할 수 있습니다.",
        spoilageInfo: "표면이 물렁해지고 색이 변하며, 속이 비거나 바람이 든 느낌이 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 7, fridge: 14, freezer: 60 },
            opened: { room_temp: null, fridge: 4, freezer: 60 }
        }
    },
    {
        name: "배추",
        defaultStoreMethod: "냉장",
        storageTips: "신문지로 감싸 냉장 보관하고, 소분하여 냉동하면 장기 보관이 가능합니다.",
        spoilageInfo: "잎 끝이 검게 변하거나 물러지고, 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 3, fridge: 14, freezer: 90 },
            opened: { room_temp: null, fridge: 3, freezer: 90 }
        }
    },
    {
        name: "상추",
        defaultStoreMethod: "냉장",
        storageTips: "세척 후 물기를 완전히 제거하고, 밀폐 용기에 키친타월과 함께 세워서 냉장 보관하세요.",
        spoilageInfo: "잎이 흐물흐물해지거나 가장자리가 붉게 변하고, 썩은 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 1, fridge: 7, freezer: null },
            opened: { room_temp: null, fridge: 3, freezer: null }
        }
    },
    {
        name: "양파",
        defaultStoreMethod: "실온",
        storageTips: "통풍이 잘 되는 서늘하고 건조한 곳에 보관하세요. 껍질을 깐 경우 밀폐하여 냉장 보관하세요.",
        spoilageInfo: "물러지거나 곰팡이가 피고, 속에서 싹이 자라나오거나 불쾌한 냄새가 나면 품질이 저하된 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 90, fridge: 90, freezer: 60 },
            opened: { room_temp: 1, fridge: 7, freezer: 60 }
        }
    },
    {
        name: "오이",
        defaultStoreMethod: "냉장",
        storageTips: "물기를 제거하고 키친타월이나 신문지로 감싸 세워서 냉장 보관하면 1주일 이상 갑니다.",
        spoilageInfo: "표면이 미끈거리거나 물러지고, 쓴맛이 강해지며, 색이 누렇게 변하면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 2, fridge: 7, freezer: 30 },
            opened: { room_temp: null, fridge: 3, freezer: 30 }
        }
    },
    {
        name: "닭고기 (생)",
        defaultStoreMethod: "냉동",
        storageTips: "구입 후 즉시 냉장 또는 냉동 보관하세요. 냉동 시 최대 12개월까지 보관 가능하나, 최상의 품질을 위해 6개월 내 섭취를 권장합니다.",
        spoilageInfo: "표면이 미끈거리고 색이 변하며(회색/녹색), 시큼하거나 불쾌한 냄새가 나면 절대 섭취하지 마세요.",
        allergyInfo: "닭고기",
        shelfLife: {
            unopened: { room_temp: null, fridge: 2, freezer: 180 },
            opened: { room_temp: null, fridge: 3, freezer: 90 }
        }
    },
    {
        name: "돼지고기 (생)",
        defaultStoreMethod: "냉동",
        storageTips: "핏물을 제거하고 랩으로 감싸 냉장 보관하고, 장기 보관은 냉동이 필수입니다.",
        spoilageInfo: "색이 검붉게 변하고 표면이 미끈거리며, 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "돼지고기",
        shelfLife: {
            unopened: { room_temp: null, fridge: 2, freezer: 90 },
            opened: { room_temp: null, fridge: 3, freezer: 60 }
        }
    },
    {
        name: "베이컨",
        defaultStoreMethod: "냉장",
        storageTips: "미개봉 상태로 냉장 보관하세요. 개봉 후에는 밀폐하여 냉장 보관하고, 소분하여 냉동 보관할 수 있습니다.",
        spoilageInfo: "색이 탁해지거나 녹색 빛을 띠고, 시큼한 냄새나 미끈거리는 점액질이 생기면 상한 것입니다.",
        allergyInfo: "돼지고기",
        shelfLife: {
            unopened: { room_temp: null, fridge: 30, freezer: 90 },
            opened: { room_temp: null, fridge: 7, freezer: 90 }
        }
    },
    {
        name: "소고기 (생)",
        defaultStoreMethod: "냉동",
        storageTips: "핏물을 제거하고 랩으로 감싸 냉장 보관하고, 장기 보관 시 용도별로 소분하여 냉동하세요.",
        spoilageInfo: "표면이 미끈거리고, 색이 갈색이나 녹색으로 변하며, 암모니아 같은 냄새가 나면 상한 것입니다.",
        allergyInfo: "쇠고기",
        shelfLife: {
            unopened: { room_temp: null, fridge: 3, freezer: 180 },
            opened: { room_temp: null, fridge: 4, freezer: 90 }
        }
    },
    {
        name: "계란",
        defaultStoreMethod: "냉장",
        storageTips: "뾰족한 부분이 아래로 향하게 하여 냉장 보관하세요. 껍질째 냉동은 파열 위험이 있어 금지입니다.",
        spoilageInfo: "물에 넣었을 때 뜨거나, 깨뜨렸을 때 노른자가 쉽게 터지고 흰자가 묽으면 오래된 계란입니다. 썩은 냄새가 나면 상한 것입니다.",
        allergyInfo: "계란(난류)",
        shelfLife: {
            unopened: { room_temp: 21, fridge: 35, freezer: null },
            opened: { room_temp: null, fridge: 2, freezer: null }
        }
    },
    {
        name: "두부",
        defaultStoreMethod: "냉장",
        storageTips: "개봉 후에는 용기에 두부가 잠길 만큼의 물과 함께 담아 밀폐하여 냉장 보관하고, 가급적 1-3일 내에 섭취하세요.",
        spoilageInfo: "표면이 미끈거리고 시큼한 냄새가 나며, 포장 용기 안의 물이 탁해지면 상한 것입니다.",
        allergyInfo: "대두",
        shelfLife: {
            unopened: { room_temp: 1, fridge: 7, freezer: 60 },
            opened: { room_temp: null, fridge: 2, freezer: 60 }
        }
    },
    {
        name: "우유",
        defaultStoreMethod: "냉장",
        storageTips: "미개봉 상태로 냉장 보관하세요. 개봉 후에는 즉시 냉장 보관하고, 냉장고 문 쪽보다는 안쪽에 보관하는 것이 좋습니다.",
        spoilageInfo: "덩어리가 생기거나, 시큼한 맛과 냄새가 나면 상한 것입니다.",
        allergyInfo: "우유",
        shelfLife: {
            unopened: { room_temp: null, fridge: 10, freezer: 30 },
            opened: { room_temp: null, fridge: 4, freezer: 30 }
        }
    },
    {
        name: "치즈",
        defaultStoreMethod: "냉장",
        storageTips: "냉동 시 맛과 풍미가 저하되고 질감이 푸석해지므로 가급적 냉장 보관을 권장합니다. 피자 토핑 등 녹여 먹는 용도로는 냉동 가능합니다.",
        spoilageInfo: "푸른색이나 검은색 곰팡이가 피거나, 암모니아 냄새가 나고, 표면이 마르거나 딱딱해지면 변질된 것입니다. (일부 치즈의 푸른곰팡이 제외)",
        allergyInfo: "우유",
        shelfLife: {
            unopened: { room_temp: null, fridge: 30, freezer: 60 },
            opened: { room_temp: null, fridge: 14, freezer: 60 }
        }
    },
    {
        name: "고등어",
        defaultStoreMethod: "냉동",
        storageTips: "손질 후 수분을 제거하고 소금을 뿌려 즉시 냉장 또는 냉동 보관하세요.",
        spoilageInfo: "살에 탄력이 없고, 눈이 혼탁하며, 비린내가 심하고 아가미 색이 검붉으면 신선하지 않은 것입니다.",
        allergyInfo: "고등어",
        shelfLife: {
            unopened: { room_temp: null, fridge: 2, freezer: 90 },
            opened: { room_temp: null, fridge: 1, freezer: 30 }
        }
    },
    {
        name: "마른 멸치",
        defaultStoreMethod: "냉동",
        storageTips: "지방 산패 방지를 위해 밀폐하여 냉동 보관하는 것이 가장 좋습니다.",
        spoilageInfo: "색이 붉게 변하거나 기름 쩐내가 나고, 눅눅해지면 산패된 것입니다.",
        allergyInfo: "새우, 게 등 다른 갑각류가 혼입될 수 있음",
        shelfLife: {
            unopened: { room_temp: 30, fridge: 90, freezer: 365 },
            opened: { room_temp: 15, fridge: 90, freezer: 365 }
        }
    },
    {
        name: "오징어",
        defaultStoreMethod: "냉동",
        storageTips: "손질 후 즉시 사용하거나 위생팩에 넣어 용도에 맞게 잘라 냉동 보관하세요.",
        spoilageInfo: "살이 투명하지 않고 흰색으로 변하며, 탄력이 없고 불쾌한 냄새가 나면 상한 것입니다.",
        allergyInfo: "오징어",
        shelfLife: {
            unopened: { room_temp: null, fridge: 2, freezer: 180 },
            opened: { room_temp: null, fridge: 1, freezer: 30 }
        }
    },
    {
        name: "김치",
        defaultStoreMethod: "냉장",
        storageTips: "김치냉장고에 보관하는 것이 가장 좋으며, 공기 접촉을 최소화하여 보관하세요.",
        spoilageInfo: "표면에 흰색 막(골마지)이 아닌 검은색/푸른색 곰팡이가 피거나, 물러지고 불쾌한 냄새가 나면 상한 것입니다.",
        allergyInfo: "새우",
        shelfLife: {
            unopened: { room_temp: 7, fridge: 120, freezer: 180 },
            opened: { room_temp: 7, fridge: 120, freezer: 180 }
        }
    },
    {
        name: "어묵",
        defaultStoreMethod: "냉장",
        storageTips: "미개봉 상태로 냉장 보관하세요. 개봉 후에는 밀폐하여 냉장 보관하고, 가급적 1-2일 내에 섭취하는 것이 안전합니다.",
        spoilageInfo: "포장이 팽팽해지거나, 표면이 미끈거리고 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "밀, 대두, 생선",
        shelfLife: {
            unopened: { room_temp: null, fridge: 7, freezer: 60 },
            opened: { room_temp: null, fridge: 2, freezer: 60 }
        }
    },
    {
        name: "참치캔",
        defaultStoreMethod: "실온",
        storageTips: "개봉 전에는 서늘하고 건조한 곳에 보관하세요. 개봉 후 남은 참치는 반드시 유리나 플라스틱 밀폐 용기에 옮겨 담아 냉장 보관하고, 1-2일 내에 섭취해야 합니다.",
        spoilageInfo: "캔이 팽창하거나 찌그러져 있고, 개봉 시 내용물 색이 변했거나 이상한 냄새가 나면 폐기하세요.",
        allergyInfo: "대두, 쇠고기(일부 제품)",
        shelfLife: {
            unopened: { room_temp: 730, fridge: 730, freezer: null },
            opened: { room_temp: null, fridge: 2, freezer: null }
        }
    },
    {
        name: "생강",
        defaultStoreMethod: "냉장",
        storageTips: "흙을 털어내고 신문지에 싸서 서늘한 곳에 두거나, 껍질을 벗겨 편으로 썰거나 다져서 냉동 보관합니다.",
        spoilageInfo: "물렁해지거나 곰팡이가 피면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 14, fridge: 30, freezer: 180 },
            opened: { room_temp: null, fridge: 7, freezer: 90 }
        }
    },
    {
        name: "감자",
        defaultStoreMethod: "실온",
        storageTips: "햇빛이 들지 않는 서늘하고 통풍이 잘되는 곳에 보관하세요. 냉장 보관은 전분을 당으로 변화시켜 맛을 떨어뜨립니다.",
        spoilageInfo: "싹이 나거나 껍질이 녹색으로 변한 부분은 독성(솔라닌)이 있으므로 반드시 도려내고 사용해야 합니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 30, fridge: null, freezer: null },
            opened: { room_temp: null, fridge: 2, freezer: null }
        }
    },
    {
        name: "고구마",
        defaultStoreMethod: "실온",
        storageTips: "냉장 보관 시 맛이 떨어지므로, 신문지로 감싸 서늘하고 어두운 곳에 보관하는 것이 가장 좋습니다.",
        spoilageInfo: "물러지거나 검은 반점이 생기고 곰팡이가 피었을 때 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 14, fridge: null, freezer: 60 },
            opened: { room_temp: null, fridge: 3, freezer: 60 }
        }
    },
    {
        name: "애호박",
        defaultStoreMethod: "냉장",
        storageTips: "물기를 제거하고 신문지에 싸서 서늘한 곳이나 냉장고 채소칸에 보관하세요. 잘라서 냉동하면 찌개나 볶음용으로 활용 가능합니다.",
        spoilageInfo: "표면이 물러지거나 곰팡이가 피고, 색이 변하면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 5, fridge: 10, freezer: 90 },
            opened: { room_temp: null, fridge: 3, freezer: 90 }
        }
    },
    {
        name: "시금치",
        defaultStoreMethod: "냉장",
        storageTips: "씻지 않은 상태로 젖은 키친타월로 감싼 후 비닐봉지에 담아 뿌리가 아래로 가도록 세워서 냉장 보관하세요.",
        spoilageInfo: "잎이 축 늘어지거나 검게 변하며 물러지면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 1, fridge: 7, freezer: 180 },
            opened: { room_temp: null, fridge: 3, freezer: 180 }
        }
    },
    {
        name: "콩나물",
        defaultStoreMethod: "냉장",
        storageTips: "밀폐용기에 콩나물이 잠길 만큼의 물을 붓고 냉장 보관하며 매일 물을 갈아주면 신선함을 더 오래 유지할 수 있습니다.",
        spoilageInfo: "콩나물 대가리가 갈색으로 변하거나, 줄기가 물러지고 비린내가 나면 상한 것입니다.",
        allergyInfo: "대두",
        shelfLife: {
            unopened: { room_temp: null, fridge: 3, freezer: 90 },
            opened: { room_temp: null, fridge: 2, freezer: 90 }
        }
    },
    {
        name: "양배추",
        defaultStoreMethod: "냉장",
        storageTips: "통째로 신문지에 싸서 서늘한 곳이나 냉장고에 보관하고, 자른 단면은 랩으로 감싸주세요.",
        spoilageInfo: "자른 단면이 검게 변하고, 물러지면서 불쾌한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 7, fridge: 30, freezer: null },
            opened: { room_temp: null, fridge: 7, freezer: null }
        }
    },
    {
        name: "청양고추",
        defaultStoreMethod: "냉장",
        storageTips: "물기를 제거하고 밀폐용기에 담아 냉장 보관하거나, 꼭지를 제거하고 썰어서 냉동 보관합니다.",
        spoilageInfo: "끝이 마르거나 물러지고, 표면에 검은 반점이 생기면 상하기 시작한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: null, fridge: 14, freezer: 180 },
            opened: { room_temp: null, fridge: 7, freezer: 180 }
        }
    },
    {
        name: "파프리카",
        defaultStoreMethod: "냉장",
        storageTips: "물기를 제거하고 랩으로 하나씩 감싸거나 밀폐용기에 담아 냉장 보관하세요. 잘라서 냉동하면 조리용으로 활용 가능합니다.",
        spoilageInfo: "꼭지 부분에 곰팡이가 피거나, 표면이 쭈글쭈글해지고 물러지면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: null, fridge: 14, freezer: 180 },
            opened: { room_temp: null, fridge: 5, freezer: 180 }
        }
    },
    {
        name: "표고버섯",
        defaultStoreMethod: "냉장",
        storageTips: "키친타월로 감싸 밀폐용기에 담아 냉장 보관하고, 기둥을 제거하고 썰어서 냉동 보관할 수 있습니다.",
        spoilageInfo: "갓 뒷면이 검게 변하거나, 표면이 미끈거리고 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: null, fridge: 7, freezer: 180 },
            opened: { room_temp: null, fridge: 3, freezer: 180 }
        }
    },
    {
        name: "팽이버섯",
        defaultStoreMethod: "냉장",
        storageTips: "포장을 뜯지 않은 상태로 밑동만 잘라내고 냉장 보관하세요. 물에 닿으면 쉽게 상하므로 조리 직전에 씻는 것이 좋습니다.",
        spoilageInfo: "색이 누렇게 변하거나 표면이 미끈거리며 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 1, fridge: 7, freezer: 30 },
            opened: { room_temp: null, fridge: 2, freezer: 30 }
        }
    },
    {
        name: "새송이버섯",
        defaultStoreMethod: "냉장",
        storageTips: "신문지나 키친타월에 싸서 세워서 냉장 보관하면 수분이 덜 생깁니다. 잘라서 냉동 보관도 가능합니다.",
        spoilageInfo: "표면이 미끈거리거나 노란색으로 변하면 상하기 시작한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: null, fridge: 10, freezer: 180 },
            opened: { room_temp: null, fridge: 5, freezer: 180 }
        }
    },
    {
        name: "오리고기",
        defaultStoreMethod: "냉동",
        storageTips: "구입 후 즉시 냉장 보관하거나, 1회분씩 소분하여 공기를 최대한 빼고 밀봉 후 냉동 보관하는 것이 좋습니다.",
        spoilageInfo: "냄새와 색, 점성을 확인해야 하며, 특히 기름 부분에서 산패한 냄새가 나면 변질된 것입니다.",
        allergyInfo: "오리고기",
        shelfLife: {
            unopened: { room_temp: null, fridge: 2, freezer: 180 },
            opened: { room_temp: null, fridge: 1, freezer: 60 }
        }
    },
    {
        name: "새우",
        defaultStoreMethod: "냉동",
        storageTips: "머리와 껍질, 내장을 제거한 후 물기를 제거하고 밀봉하여 냉동 보관하세요.",
        spoilageInfo: "머리나 꼬리가 검게 변하거나, 껍질과 살이 분리되고, 암모니아 냄새가 나면 상한 것입니다.",
        allergyInfo: "갑각류(새우)",
        shelfLife: {
            unopened: { room_temp: null, fridge: 2, freezer: 180 },
            opened: { room_temp: null, fridge: 1, freezer: 90 }
        }
    },
    {
        name: "멸치",
        defaultStoreMethod: "냉동",
        storageTips: "지방 산패 방지를 위해 밀폐하여 냉동 보관하는 것이 가장 좋습니다. 사용 전 마른 팬에 볶아 수분을 날리면 비린내가 줄어듭니다.",
        spoilageInfo: "색이 노랗거나 붉게 변하고, 눅눅해지며 기름 쩐내가 나면 산패한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 90, fridge: 180, freezer: 365 },
            opened: { room_temp: 30, fridge: 90, freezer: 365 }
        }
    },
    {
        name: "조개",
        defaultStoreMethod: "냉장",
        storageTips: "소금물에 담가 해감한 뒤, 밀봉하여 냉장 보관하고 최대한 빨리 섭취하세요. 살만 발라내어 냉동 보관할 수 있습니다.",
        spoilageInfo: "입을 벌리고 있거나, 만졌을 때 입을 다물지 않거나, 악취가 나면 상한 것입니다.",
        allergyInfo: "조개류",
        shelfLife: {
            unopened: { room_temp: null, fridge: 2, freezer: null },
            opened: { room_temp: null, fridge: 1, freezer: 30 }
        }
    },
    {
        name: "된장",
        defaultStoreMethod: "냉장",
        storageTips: "반드시 냉장 보관하고, 덜어낼 때는 깨끗한 수저를 사용하세요. 표면에 비닐을 덮어두면 좋습니다.",
        spoilageInfo: "색이 검게 변하는 것은 정상이지만, 다른 색의 곰팡이가 피거나 역한 냄새가 나면 상한 것입니다.",
        allergyInfo: "대두",
        shelfLife: {
            unopened: { room_temp: 365, fridge: 365, freezer: null },
            opened: { room_temp: null, fridge: 180, freezer: null }
        }
    },
    {
        name: "고추장",
        defaultStoreMethod: "냉장",
        storageTips: "된장과 마찬가지로 냉장 보관하고, 깨끗한 수저를 사용하세요.",
        spoilageInfo: "색이 검게 변할 수 있으나 자연스러운 현상입니다. 다른 색의 곰팡이나 이상한 냄새를 확인합니다.",
        allergyInfo: "대두, 밀",
        shelfLife: {
            unopened: { room_temp: 540, fridge: 540, freezer: null },
            opened: { room_temp: null, fridge: 180, freezer: null }
        }
    },
    {
        name: "고춧가루",
        defaultStoreMethod: "냉동",
        storageTips: "습기와 햇빛에 약하므로, 밀폐하여 냉장 또는 냉동 보관하는 것이 가장 좋습니다.",
        spoilageInfo: "덩어리가 지고 눅눅해지거나, 검은색 곰팡이가 피면 변질된 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 180, fridge: 365, freezer: 730 },
            opened: { room_temp: 90, fridge: 180, freezer: 365 }
        }
    },
    {
        name: "식초",
        defaultStoreMethod: "실온",
        storageTips: "직사광선을 피해 서늘한 곳에 보관하세요. 스스로 보존되는 성질이 있어 유통기한이 거의 없습니다.",
        spoilageInfo: "침전물이 생기는 것은 자연스러운 현상일 수 있으나, 맛과 향이 변했다면 사용하지 마세요.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: null, fridge: null, freezer: null },
            opened: { room_temp: null, fridge: null, freezer: null }
        }
    },
    {
        name: "깨",
        defaultStoreMethod: "냉장",
        storageTips: "볶은 깨는 산패되기 쉬우므로 밀폐하여 냉장 또는 냉동 보관하는 것이 좋습니다.",
        spoilageInfo: "눅눅해지고 기름 쩐내가 나면 산패한 것입니다.",
        allergyInfo: "참깨",
        shelfLife: {
            unopened: { room_temp: 180, fridge: 365, freezer: 365 },
            opened: { room_temp: 90, fridge: 180, freezer: 180 }
        }
    },
    {
        name: "쌀",
        defaultStoreMethod: "실온",
        storageTips: "쌀벌레 방지를 위해 밀폐 용기에 담아 서늘하고 건조한 곳에 보관하세요. 페트병에 소분하여 냉장 보관하면 가장 좋습니다.",
        spoilageInfo: "쌀벌레가 생기거나, 쌀알이 변색되고 곰팡이가 피거나 냄새가 나면 폐기해야 합니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 365, fridge: 365, freezer: 365 },
            opened: { room_temp: 90, fridge: 180, freezer: 180 }
        }
    },
    {
        name: "밀가루",
        defaultStoreMethod: "실온",
        storageTips: "냄새와 습기를 잘 흡수하므로 반드시 밀폐 용기에 담아 건조하고 서늘한 곳에 보관하세요. 장기 보관 시 냉장 또는 냉동 보관하면 좋습니다.",
        spoilageInfo: "덩어리가 지고 곰팡이가 피거나, 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "밀",
        shelfLife: {
            unopened: { room_temp: 365, fridge: 365, freezer: 365 },
            opened: { room_temp: 180, fridge: 365, freezer: 365 }
        }
    }
];

module.exports = { recipes, ingredientMasterData };
