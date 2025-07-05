// 사용자의 정보와 현재 냉장고 상태를 시뮬레이션합니다.
const users = {
  "user01": {
    profile: {
      name: "김코딩",
      skillLevel: 2, // 1:초보, 2:중급, 3:고급
      allergies: ["갑각류"],
    },
    ingredients: [
      { id: "ing001", name: "돼지고기", purchaseDate: "2025-07-01", quantity: "있음" },
      { id: "ing002", name: "김치", purchaseDate: "2025-06-15", quantity: "있음" },
      { id: "ing003", name: "양파", purchaseDate: "2025-06-25", quantity: "자투리" },
      { id: "ing004", name: "대파", purchaseDate: "2025-07-02", quantity: "있음" },
      { id: "ing005", name: "계란", purchaseDate: "2025-06-20", quantity: "있음" },
    ],
    recipeRatings: {
      "recipe001": "like",
      "recipe003": "dislike",
    }
  }
};

module.exports = users;