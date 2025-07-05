// 백엔드 서버 주소 (실행 환경에 맞게 수정 필요)
// Expo Go 앱으로 테스트 시, 컴퓨터의 IP 주소를 사용해야 합니다.
const API_URL = 'http://192.168.219.104:8081/api/recommend'; // << 본인 PC의 IP 주소로 변경!

export const fetchRecommendations = async (availableTime) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // userId는 로그인 기능 구현 후 동적으로 변경해야 합니다.
      body: JSON.stringify({
        userId: 'user01', 
        availableTime: availableTime,
        tempExcludeIngredients: [], // 임시 제외 기능은 UI에서 추가 구현
      }),
    });

    if (!response.ok) {
      throw new Error('서버에서 응답을 받지 못했습니다.');
    }

    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    // 실제 앱에서는 사용자에게 오류를 알리는 UI를 보여줘야 합니다.
    return []; 
  }
};