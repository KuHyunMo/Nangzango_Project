// 사용자의 정보와 현재 냉장고 상태를 시뮬레이션합니다.
const users = {
  "user01": {
    // ❌ 수정 전: username, password 필드가 없었음
    // ✅ 수정 후: 테스트용 username과 password 추가
    username: "testuser",
    password: "password123", // 실제로는 seed.js에서 암호화되므로 아무 값이나 괜찮습니다.
    profile: {
      name: "김코딩",
      skillLevel: 2,
      allergies: ["갑각류"],
    },
    ingredients: [
      { name: "돼지고기", purchaseDate: "2025-07-08", quantity: "있음", storageMethod: "냉장", isOpened: true },
      { name: "김치", purchaseDate: "2025-06-15", quantity: "있음", storageMethod: "냉장", isOpened: true },
      { name: "양파", purchaseDate: "2025-07-01", quantity: "자투리", storageMethod: "실온", isOpened: false },
      { name: "대파", purchaseDate: "2025-07-09", quantity: "있음", storageMethod: "냉장", isOpened: false },
      { name: "계란", purchaseDate: "2025-06-25", quantity: "있음", storageMethod: "냉장", isOpened: false },
    ],
    recipeRatings: {
      "recipe001": "like",
      "recipe003": "dislike",
    },
    notificationSettings: {
      allowNotifications: true,
    }
  }
};

module.exports = users;
