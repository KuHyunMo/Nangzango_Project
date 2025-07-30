const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const auth = require('../middleware/auth');
const User = require('../models/User');

const BASIC_INGREDIENTS = ['물', '소금', '설탕', '식용유', '후추', '간장', '참기름', '깨'];

router.post('/generate', auth, async (req, res) => {
    try {
        const { availableTime, servings } = req.body;
        if (!availableTime || !servings) {
            return res.status(400).json({ msg: '조리 시간과 인원 수는 필수입니다.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: '사용자를 찾을 수 없습니다.' });
        }
        if (user.ingredients.length === 0) {
            return res.status(400).json({ msg: '추천을 위한 재료가 없습니다.' });
        }

        const userIngredientsWithQuantity = user.ingredients
            .filter(ing => ing.quantity !== '없음')
            .map(ing => `${ing.name}(${ing.quantity})`);
        
        // ✅ 핵심 수정: 프롬프트의 명확성을 위해 사용 가능한 모든 재료를 하나의 목록으로 합칩니다.
        const allAvailableIngredients = [...new Set([...user.ingredients.map(ing => ing.name), ...BASIC_INGREDIENTS])];
        const availableIngredientsString = allAvailableIngredients.join(', ');

        // ✅ 핵심 수정: LLM이 스스로 결과를 검증하도록 프롬프트를 강화합니다.
        const prompt = `
            당신은 냉장고 속 재료로만 요리를 추천해주는, 규칙을 매우 엄격하게 준수하는 AI 요리사입니다.

            아래 목록에 있는 재료들만을 사용하여, 주어진 '최대 조리 시간' 안에 만들 수 있는, 서로 다른 요리 3가지를 추천해주세요.
            - 사용 가능한 전체 재료 목록: ${availableIngredientsString}
            - 사용자가 보유한 재료 (수량 정보 참고용): ${userIngredientsWithQuantity.join(', ')}
            - 최대 조리 시간: ${availableTime}분
            - 만들 인원 수: ${servings}인분

            결과는 반드시 다음의 JSON 형식에 맞는 배열(array)로만 응답해야 합니다. 다른 부가적인 설명은 절대 추가하지 마세요:
            [
              {
                "recipeName": "요리 이름",
                "description": "요리에 대한 간단하고 흥미로운 설명 (2-3문장)",
                "cookTime": "요리의 실제 총 조리 시간(숫자만)",
                "ingredients": ["돼지고기 200g", "양파 1/2개", "간장 2스푼"],
                "instructions": "단계별 조리법. 각 단계는 '\\n'으로 구분해주세요."
              }
            ]
            
            **가장 중요한 최종 규칙:**
            1. (가장 우선되는 규칙) 응답을 생성하기 전에, 오직 '사용 가능한 전체 재료 목록'에 있는 재료들만 사용하여 만들 수 있는 요리 아이디어를 먼저 떠올려야 합니다.
            2. 응답을 생성한 후, 'recipeName', 'description', 'ingredients', 'instructions'에 언급된 모든 식재료 단어가 '사용 가능한 전체 재료 목록'에 있는지 반드시 다시 한번 검증해야 합니다.
            3. 만약 목록에 없는 재료(예: 김치, 계란, 치즈 등)가 조금이라도 포함되었다면, 그 레시피는 규칙 위반이므로 절대 추천해서는 안 되며, 규칙을 100% 만족하는 다른 레시피로 즉시 대체해야 합니다.
            4. 추천하는 모든 요리의 "cookTime"은 위에 명시된 '최대 조리 시간'을 절대 넘어서는 안 됩니다.
            5. 'ingredients' 배열의 각 항목에는 반드시 '만들 인원 수'에 맞는 양을 함께 표기해야 합니다 (예: "돼지고기 200g").
            6. 사용자가 보유한 재료의 수량이 '(자투리)'인 경우, 해당 재료는 요리의 주재료가 될 수 없으며, 소량만 사용해야 합니다.
            7. "instructions"의 각 단계는 매우 구체적이어야 합니다. 특히 '볶기', '끓이기', '삶기' 등의 과정에는 반드시 '중불에서 5분간' 또는 '물이 끓어오를 때까지'와 같이 명확한 시간이나 상태 변화에 대한 설명을 포함해야 합니다.
        `;
        
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Gemini API Error:', errorData);
            throw new Error('AI 레시피 생성에 실패했습니다. API 키 또는 사용량을 확인해주세요.');
        }

        const geminiData = await geminiResponse.json();

        if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content || !geminiData.candidates[0].content.parts[0]) {
            throw new Error('Gemini API로부터 유효하지 않은 형식의 응답을 받았습니다.');
        }
        
        const recipeText = geminiData.candidates[0].content.parts[0].text;
        
        let jsonString = recipeText;
        const jsonMatch = recipeText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            jsonString = jsonMatch[1];
        } else {
            const firstBracket = recipeText.indexOf('[');
            const lastBracket = recipeText.lastIndexOf(']');
            if (firstBracket !== -1 && lastBracket !== -1) {
                jsonString = recipeText.substring(firstBracket, lastBracket + 1);
            }
        }

        const recipeArray = JSON.parse(jsonString);
        res.json(recipeArray);

    } catch (error) {
        console.error('레시피 생성 최종 오류:', error);
        res.status(500).json({ msg: `서버 내부 오류: ${error.message}` });
    }
});

module.exports = router;
