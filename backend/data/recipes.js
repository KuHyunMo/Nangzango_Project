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
  // ... (다른 레시피 데이터는 동일)
];

const ingredientMasterData = [
    // 1. 채소 및 버섯류
    {
        name: "대파",
        storageTips: "흙이 묻은 채로 신문지에 싸서 서늘한 곳에 보관하거나, 용도에 맞게 썰어 밀폐용기에 담아 냉동 보관하면 편리합니다.",
        spoilageInfo: "잎이 노랗게 변하거나 진물이 나오면 상하기 시작한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 5, fridge: 14, freezer: 90 },
            opened: { room_temp: 1, fridge: 7, freezer: 30 }
        }
    },
    {
        name: "양파",
        storageTips: "껍질째 망에 담아 통풍이 잘되는 서늘한 곳에 보관하세요. 깐 양파는 밀폐용기에 담아 냉장 보관해야 합니다.",
        spoilageInfo: "물러지거나 곰팡이가 피었을 때, 또는 시큼한 냄새가 날 때 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 30, fridge: 21, freezer: 180 },
            opened: { room_temp: 1, fridge: 7, freezer: 180 }
        }
    },
    {
        name: "마늘",
        storageTips: "통마늘은 서늘한 곳에, 깐 마늘은 밀폐용기에, 다진 마늘은 얼음 틀에 얼려 냉동 보관하는 것이 좋습니다.",
        spoilageInfo: "마늘이 녹색으로 변하는 것은 효소 작용으로 정상이나, 물러지거나 곰팡이가 피면 폐기해야 합니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 30, fridge: 60, freezer: 180 },
            opened: { room_temp: 1, fridge: 3, freezer: 90 }
        }
    },
    {
        name: "생강",
        storageTips: "흙을 털어내고 신문지에 싸서 서늘한 곳에 두거나, 껍질을 벗겨 편으로 썰거나 다져서 냉동 보관합니다.",
        spoilageInfo: "물렁해지거나 곰팡이가 피면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 14, fridge: 30, freezer: 180 },
            opened: { room_temp: 0, fridge: 7, freezer: 90 }
        }
    },
    {
        name: "배추",
        storageTips: "신문지로 감싸 밑동이 아래로 가도록 세워서 서늘한 곳이나 냉장고에 보관하세요.",
        spoilageInfo: "잎이 마르거나 검은 반점이 생기고, 물러지면서 냄새가 나면 변질된 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 3, fridge: 14, freezer: 0 },
            opened: { room_temp: 0, fridge: 5, freezer: 0 }
        }
    },
    {
        name: "무",
        storageTips: "잎과 뿌리를 잘라내고 신문지에 싸서 서늘한 곳이나 냉장고에 보관하세요.",
        spoilageInfo: "바람이 든 것처럼 속이 비거나, 물러지고 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 7, fridge: 14, freezer: 0 },
            opened: { room_temp: 0, fridge: 5, freezer: 0 }
        }
    },
    {
        name: "감자",
        storageTips: "햇빛이 들지 않는 서늘하고 통풍이 잘되는 곳에 보관하세요. **생감자를 냉동하면 해동 시 식감이 크게 손상되므로 권장하지 않습니다.**",
        spoilageInfo: "싹이 나거나 껍질이 녹색으로 변한 부분은 독성(솔라닌)이 있으므로 반드시 도려내고 사용해야 합니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 30, fridge: 0, freezer: 0 },
            opened: { room_temp: 0, fridge: 2, freezer: 0 }
        }
    },
    {
        name: "고구마",
        storageTips: "냉장 보관 시 맛이 떨어지므로, 신문지로 감싸 서늘하고 어두운 곳에 보관하는 것이 가장 좋습니다.",
        spoilageInfo: "물러지거나 곰팡이가 피었을 때 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 14, fridge: 0, freezer: 0 },
            opened: { room_temp: 0, fridge: 3, freezer: 60 }
        }
    },
    {
        name: "당근",
        storageTips: "흙을 씻어내고 물기를 제거한 뒤, 키친타월이나 랩으로 감싸 냉장 보관하세요.",
        spoilageInfo: "물러지거나 검은 반점이 생기고, 탄력이 없으면 신선도가 떨어진 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 7, fridge: 21, freezer: 0 },
            opened: { room_temp: 0, fridge: 4, freezer: 0 }
        }
    },
    {
        name: "애호박",
        storageTips: "꼭지를 자르지 않은 상태로 신문지에 싸서 서늘한 곳이나 냉장고 채소칸에 보관하세요.",
        spoilageInfo: "표면이 물러지거나 곰팡이가 피고, 색이 변하면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 5, fridge: 10, freezer: 0 },
            opened: { room_temp: 0, fridge: 3, freezer: 0 }
        }
    },
    {
        name: "오이",
        storageTips: "키친타월로 감싸 꼭지가 위로 가도록 세워서 냉장 보관하면 무르는 것을 방지할 수 있습니다.",
        spoilageInfo: "물러지거나 끝 부분이 노랗게 변하고, 쓴맛이 강해지면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 3, fridge: 7, freezer: 0 },
            opened: { room_temp: 0, fridge: 3, freezer: 0 }
        }
    },
    {
        name: "깻잎",
        storageTips: "물기를 제거하고 키친타월로 감싼 뒤, 밀폐용기에 담아 꼭지가 아래로 가도록 세워서 냉장 보관하세요.",
        spoilageInfo: "잎이 검게 변하거나 흐물흐물해지면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 7, freezer: 0 },
            opened: { room_temp: 0, fridge: 3, freezer: 0 }
        }
    },
    {
        name: "상추",
        storageTips: "물기를 제거하고 밀폐용기 바닥에 키친타월을 깐 뒤, 잎이 위로 가도록 보관하세요.",
        spoilageInfo: "잎 끝이 붉게 변하거나 물러지고, 쓴맛이 강해지면 신선도가 떨어진 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 7, freezer: 0 },
            opened: { room_temp: 0, fridge: 3, freezer: 0 }
        }
    },
    {
        name: "시금치",
        storageTips: "흙이 묻은 채로 키친타월이나 신문지에 싸서 뿌리가 아래로 향하게 하여 냉장 보관하세요.",
        spoilageInfo: "잎이 축 늘어지거나 검게 변하며 물러지면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 1, fridge: 7, freezer: 0 },
            opened: { room_temp: 0, fridge: 3, freezer: 30 }
        }
    },
    {
        name: "콩나물",
        storageTips: "밀폐용기에 담아 빛을 차단하여 냉장 보관하고, 물이 고이지 않도록 주의해야 합니다.",
        spoilageInfo: "콩나물 대가리가 갈색으로 변하거나, 줄기가 물러지고 비린내가 나면 상한 것입니다.",
        allergyInfo: "대두 알러지",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 7, freezer: 0 },
            opened: { room_temp: 0, fridge: 2, freezer: 0 }
        }
    },
    {
        name: "양배추",
        storageTips: "통째로 신문지에 싸서 서늘한 곳이나 냉장고에 보관하고, 자른 단면은 랩으로 감싸주세요.",
        spoilageInfo: "자른 단면이 검게 변하고, 물러지면서 불쾌한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 7, fridge: 21, freezer: 0 },
            opened: { room_temp: 0, fridge: 7, freezer: 0 }
        }
    },
    {
        name: "청양고추",
        storageTips: "물기를 제거하고 밀폐용기에 담아 냉장 보관하거나, 꼭지를 제거하고 썰어서 냉동 보관합니다.",
        spoilageInfo: "끝이 마르거나 물러지고, 표면에 검은 반점이 생기면 상하기 시작한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 14, freezer: 180 },
            opened: { room_temp: 0, fridge: 7, freezer: 180 }
        }
    },
    {
        name: "파프리카",
        storageTips: "랩으로 하나씩 감싸거나 밀폐용기에 담아 냉장 보관하세요.",
        spoilageInfo: "꼭지 부분에 곰팡이가 피거나, 표면이 쭈글쭈글해지고 물러지면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 14, freezer: 0 },
            opened: { room_temp: 0, fridge: 5, freezer: 0 }
        }
    },
    {
        name: "표고버섯",
        storageTips: "키친타월로 감싸 밀폐용기에 담아 냉장 보관하고, 기둥을 제거하고 썰어서 냉동 보관할 수 있습니다.",
        spoilageInfo: "갓 뒷면이 검게 변하거나, 표면이 미끈거리고 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 7, freezer: 30 },
            opened: { room_temp: 0, fridge: 3, freezer: 30 }
        }
    },
    {
        name: "팽이버섯",
        storageTips: "포장을 뜯지 않은 상태로 냉장 보관하고, 밑동을 잘라낸 후에는 밀폐용기에 담아 보관하세요. 냉동 시에는 잘게 찢어 보관합니다.",
        spoilageInfo: "색이 누렇게 변하거나 표면이 미끈거리며 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 1, fridge: 7, freezer: 30 },
            opened: { room_temp: 0, fridge: 2, freezer: 30 }
        }
    },
    {
        name: "새송이버섯",
        storageTips: "신문지나 키친타월에 싸서 밀폐용기에 담아 냉장 보관하세요.",
        spoilageInfo: "표면이 미끈거리거나 노란색으로 변하면 상하기 시작한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 10, freezer: 0 },
            opened: { room_temp: 0, fridge: 5, freezer: 0 }
        }
    },
    // 2. 육류 및 가공식품
    {
        name: "돼지고기",
        storageTips: "한 번 먹을 만큼 소분하여 밀봉한 뒤, 냉장실 가장 안쪽이나 김치냉장고에 보관하세요. 육류는 실온 보관을 절대 권장하지 않습니다.",
        spoilageInfo: "표면이 미끈거리고, 색이 회색이나 녹색으로 변하며, 시큼하거나 불쾌한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 3, freezer: 90 },
            opened: { room_temp: 0, fridge: 1, freezer: 30 }
        }
    },
    {
        name: "소고기",
        storageTips: "키친타월로 핏물을 제거한 후 랩으로 감싸 밀폐용기에 담아 보관하세요. 육류는 실온 보관을 절대 권장하지 않습니다.",
        spoilageInfo: "돼지고기와 마찬가지로 냄새와 색, 점성을 확인해야 합니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 3, freezer: 180 },
            opened: { room_temp: 0, fridge: 1, freezer: 60 }
        }
    },
    {
        name: "닭고기",
        storageTips: "깨끗이 씻어 물기를 제거한 후 밀폐하여 냉장/냉동 보관하세요. 육류는 실온 보관을 절대 권장하지 않습니다.",
        spoilageInfo: "닭고기 특유의 비린내가 심해지거나, 표면이 미끈거리고 색이 변하면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 2, freezer: 365 },
            opened: { room_temp: 0, fridge: 1, freezer: 90 }
        }
    },
    {
        name: "오리고기",
        storageTips: "닭고기와 마찬가지로 소분하여 밀봉 후 냉장/냉동 보관합니다.",
        spoilageInfo: "냄새와 색, 점성을 확인해야 하며, 특히 기름 부분에서 산패한 냄새가 나면 변질된 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 3, freezer: 180 },
            opened: { room_temp: 0, fridge: 1, freezer: 60 }
        }
    },
    {
        name: "베이컨",
        storageTips: "개봉 후에는 키친타월로 감싸 밀폐용기에 담아 냉장 보관하세요.",
        spoilageInfo: "색이 변하거나 가장자리가 마르고, 미끈거리며 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 14, freezer: 60 },
            opened: { room_temp: 0, fridge: 7, freezer: 30 }
        }
    },
    {
        name: "두부",
        storageTips: "개봉 후 남은 두부는 물에 담가 밀폐용기에 넣어 냉장 보관하고, 물은 매일 갈아주는 것이 좋습니다. **냉동 시 식감이 변할 수 있습니다.**",
        spoilageInfo: "표면이 미끈거리고 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "대두 알러지",
        shelfLife: {
            unopened: { room_temp: 1, fridge: 7, freezer: 90 },
            opened: { room_temp: 0, fridge: 2, freezer: 90 }
        }
    },
    {
        name: "계란",
        storageTips: "뾰족한 부분이 아래로 향하게 하여 냉장고 문 쪽이 아닌 안쪽에 보관하는 것이 좋습니다. **껍질째 냉동하면 터질 수 있어 불가합니다.**",
        spoilageInfo: "물에 넣었을 때 뜨거나, 흔들었을 때 내용물이 출렁이는 소리가 나면 상한 계란일 가능성이 높습니다.",
        allergyInfo: "계란(난류) 알러지",
        shelfLife: {
            unopened: { room_temp: 7, fridge: 30, freezer: 0 },
            opened: { room_temp: 1, fridge: 3, freezer: 0 }
        }
    },
    {
        name: "김치",
        storageTips: "공기가 통하지 않도록 꾹꾹 눌러 김치통에 담아 냉장 보관하는 것이 가장 좋습니다.",
        spoilageInfo: "표면에 흰색 곰팡이(골마지)는 걷어내도 괜찮으나, 검은색/푸른색 곰팡이가 피거나, 역한 냄새가 나면 폐기해야 합니다.",
        allergyInfo: "젓갈류 알러지",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 180, freezer: 365 },
            opened: { room_temp: 0, fridge: 90, freezer: 180 }
        }
    },
    {
        name: "어묵",
        storageTips: "개봉 후에는 밀폐용기에 담아 냉장 또는 냉동 보관하세요.",
        spoilageInfo: "표면이 끈적이거나 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "대두, 밀 알러지",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 10, freezer: 90 },
            opened: { room_temp: 0, fridge: 3, freezer: 60 }
        }
    },
    {
        name: "우유",
        storageTips: "개봉 후에는 반드시 냉장 보관하세요. **냉동 시 지방이 분리되어 식감이 변할 수 있으므로, 해동 후에는 잘 흔들어 드세요.**",
        spoilageInfo: "덩어리가 생기거나, 시큼한 맛과 냄새가 나면 변질된 것입니다.",
        allergyInfo: "유제품(우유) 알러지",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 10, freezer: 30 },
            opened: { room_temp: 0, fridge: 3, freezer: 14 }
        }
    },
    {
        name: "치즈",
        storageTips: "슬라이스 치즈는 랩으로 감싸고, 모차렐라 치즈는 밀폐용기에 담아 냉장 보관하세요.",
        spoilageInfo: "곰팡이가 피거나, 마르고 딱딱해지거나, 시큼한 냄새가 나면 변질된 것입니다.",
        allergyInfo: "유제품(우유) 알러지",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 90, freezer: 180 },
            opened: { room_temp: 0, fridge: 14, freezer: 90 }
        }
    },
    // 3. 해산물
    {
        name: "오징어",
        storageTips: "내장과 뼈를 제거하고 깨끗이 씻어 용도에 맞게 손질한 후 냉동 보관하는 것이 좋습니다.",
        spoilageInfo: "살이 투명함을 잃고 흰색으로 변하며, 탄력이 없고 불쾌한 냄새가 나면 상한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 2, freezer: 180 },
            opened: { room_temp: 0, fridge: 1, freezer: 90 }
        }
    },
    {
        name: "새우",
        storageTips: "머리와 껍질, 내장을 제거한 후 물기를 제거하고 밀봉하여 냉동 보관하세요.",
        spoilageInfo: "머리나 꼬리가 검게 변하거나, 껍질과 살이 분리되고, 암모니아 냄새가 나면 상한 것입니다.",
        allergyInfo: "갑각류(새우) 알러지",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 2, freezer: 180 },
            opened: { room_temp: 0, fridge: 1, freezer: 90 }
        }
    },
    {
        name: "고등어",
        storageTips: "내장을 제거하고 깨끗이 씻어 물기를 제거한 후, 소금을 살짝 뿌려 밀폐하여 냉동 보관하세요. 해산물은 실온 보관을 절대 권장하지 않습니다.",
        spoilageInfo: "살을 눌렀을 때 탄력이 없고, 눈이 혼탁하며, 비린내가 심하게 나면 신선도가 떨어진 것입니다.",
        allergyInfo: "고등어 알러지",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 1, freezer: 90 },
            opened: { room_temp: 0, fridge: 1, freezer: 60 }
        }
    },
    {
        name: "멸치",
        storageTips: "습기와 직사광선을 피해 밀폐하여 서늘한 곳이나 냉장/냉동 보관하세요.",
        spoilageInfo: "색이 노랗게 변하거나 눅눅해지고, 기름 쩐내가 나면 산패한 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 90, fridge: 180, freezer: 365 },
            opened: { room_temp: 30, fridge: 90, freezer: 365 }
        }
    },
    {
        name: "조개",
        storageTips: "소금물에 담가 해감한 뒤, 밀봉하여 냉장 보관하고 최대한 빨리 섭취하세요. 살만 발라내어 냉동 보관할 수 있습니다.",
        spoilageInfo: "입을 벌리고 있거나, 만졌을 때 입을 다물지 않거나, 악취가 나면 상한 것입니다.",
        allergyInfo: "조개류 알러지",
        shelfLife: {
            unopened: { room_temp: 0, fridge: 2, freezer: 0 },
            opened: { room_temp: 0, fridge: 1, freezer: 30 }
        }
    },
    {
        name: "참치캔",
        storageTips: "서늘하고 건조한 곳에 보관하세요. 개봉 후 남은 참치는 반드시 다른 밀폐용기에 옮겨 담아 냉장 보관해야 합니다.",
        spoilageInfo: "캔이 부풀어 오르거나 찌그러졌을 경우, 또는 개봉 시 녹슨 부분이 있거나 역한 냄새가 나면 폐기해야 합니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 1800, fridge: 1800, freezer: 1800 },
            opened: { room_temp: 0, fridge: 1, freezer: 0 }
        }
    },
    // 4. 양념 및 조미료
    {
        name: "소금",
        storageTips: "습기가 없는 서늘한 곳에 밀폐하여 보관하세요.",
        spoilageInfo: "-",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: null, fridge: null, freezer: null },
            opened: { room_temp: null, fridge: null, freezer: null }
        }
    },
    {
        name: "설탕",
        storageTips: "습기가 없는 서늘한 곳에 밀폐하여 보관하세요.",
        spoilageInfo: "굳는 것은 정상이나, 이물질이 들어가거나 냄새가 변하면 사용하지 마세요.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: null, fridge: null, freezer: null },
            opened: { room_temp: null, fridge: null, freezer: null }
        }
    },
    {
        name: "간장",
        storageTips: "직사광선을 피해 서늘한 곳에 보관하고, 개봉 후에는 냉장 보관하는 것이 좋습니다.",
        spoilageInfo: "표면에 곰팡이가 피거나, 맛과 향이 변했을 때 변질된 것입니다.",
        allergyInfo: "대두, 밀 알러지",
        shelfLife: {
            unopened: { room_temp: 730, fridge: 730, freezer: 730 },
            opened: { room_temp: 30, fridge: 180, freezer: 180 }
        }
    },
    {
        name: "된장",
        storageTips: "반드시 냉장 보관하고, 덜어낼 때는 깨끗한 수저를 사용하세요.",
        spoilageInfo: "색이 검게 변하는 것은 정상이지만, 다른 색의 곰팡이가 피거나 역한 냄새가 나면 상한 것입니다.",
        allergyInfo: "대두 알러지",
        shelfLife: {
            unopened: { room_temp: 365, fridge: 365, freezer: 365 },
            opened: { room_temp: 0, fridge: 180, freezer: 365 }
        }
    },
    {
        name: "고추장",
        storageTips: "된장과 마찬가지로 냉장 보관하고, 깨끗한 수저를 사용하세요.",
        spoilageInfo: "된장과 동일하게 다른 색의 곰팡이나 이상한 냄새를 확인합니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 540, fridge: 540, freezer: 540 },
            opened: { room_temp: 0, fridge: 180, freezer: 365 }
        }
    },
    {
        name: "고춧가루",
        storageTips: "습기와 햇빛에 약하므로, 밀폐하여 냉장 또는 냉동 보관하는 것이 가장 좋습니다.",
        spoilageInfo: "덩어리가 지고 눅눅해지거나, 검은색 곰팡이가 피면 변질된 것입니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 180, fridge: 365, freezer: 730 },
            opened: { room_temp: 90, fridge: 180, freezer: 365 }
        }
    },
    {
        name: "참기름",
        storageTips: "빛과 열에 약하므로, 어둡고 서늘한 곳에 보관하세요. 냉장 보관 시 굳을 수 있습니다.",
        spoilageInfo: "기름에 절은 듯한 쩐내가 나면 산패한 것입니다.",
        allergyInfo: "참깨 알러지",
        shelfLife: {
            unopened: { room_temp: 365, fridge: 365, freezer: 365 },
            opened: { room_temp: 90, fridge: 90, freezer: 90 }
        }
    },
    {
        name: "식초",
        storageTips: "직사광선을 피해 서늘한 곳에 보관하세요.",
        spoilageInfo: "침전물이 생기는 것은 자연스러운 현상일 수 있으나, 맛과 향이 변했다면 사용하지 마세요.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 730, fridge: 730, freezer: 730 },
            opened: { room_temp: 365, fridge: 365, freezer: 365 }
        }
    },
    {
        name: "후추",
        storageTips: "습기를 피해 밀폐하여 서늘하고 건조한 곳에 보관하세요.",
        spoilageInfo: "향이 약해지면 품질이 떨어진 것이며, 눅눅해지거나 곰팡이가 피면 폐기해야 합니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 1095, fridge: 1095, freezer: 1095 },
            opened: { room_temp: 365, fridge: 365, freezer: 365 }
        }
    },
    {
        name: "깨",
        storageTips: "밀폐하여 서늘하고 건조한 곳이나 냉장 보관하세요.",
        spoilageInfo: "눅눅해지고 기름 쩐내가 나면 산패한 것입니다.",
        allergyInfo: "참깨 알러지",
        shelfLife: {
            unopened: { room_temp: 180, fridge: 365, freezer: 365 },
            opened: { room_temp: 90, fridge: 180, freezer: 180 }
        }
    },
    // 5. 곡류 및 기타
    {
        name: "쌀",
        storageTips: "습기와 벌레를 피해 밀폐된 용기에 담아 서늘하고 건조한 곳에 보관하세요. 냉장/냉동 보관 시 쌀벌레 예방에 효과적입니다.",
        spoilageInfo: "쌀벌레가 생기거나, 쌀알이 변색되고 곰팡이가 피거나 냄새가 나면 폐기해야 합니다.",
        allergyInfo: "",
        shelfLife: {
            unopened: { room_temp: 365, fridge: 365, freezer: 365 },
            opened: { room_temp: 90, fridge: 180, freezer: 180 }
        }
    },
    {
        name: "밀가루",
        storageTips: "쌀과 마찬가지로 습기를 피해 밀폐용기에 담아 서늘한 곳에 보관하세요.",
        spoilageInfo: "덩어리가 지고 곰팡이가 피거나, 시큼한 냄새가 나면 상한 것입니다.",
        allergyInfo: "밀 알러지",
        shelfLife: {
            unopened: { room_temp: 365, fridge: 365, freezer: 365 },
            opened: { room_temp: 180, fridge: 365, freezer: 365 }
        }
    }
];

module.exports = { recipes, ingredientMasterData };
