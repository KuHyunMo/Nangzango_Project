// 1. 모듈 가져오기 (Imports)
const express = require('express');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// node-fetch는 ESM이므로 비동기로 import
let fetch;
import('node-fetch').then(mod => {
    fetch = mod.default;
}).catch(err => {
    console.error('node-fetch 모듈 로드 실패:', err);
});

// ingredientService 모듈 가져오기
const ingredientService = require('../services/ingredientService'); // ✅ 추가: ingredientService 가져오기
const auth = require('../middleware/auth'); // ✅ 추가: auth 미들웨어 가져오기

// -----------------------------------------------------------
// ✅ Express Router 인스턴스 생성
const router = express.Router();
// -----------------------------------------------------------


// 3. 헬퍼 함수 정의 (Helper Functions)
function isFuzzyMatch(name1, name2) {
    const normalizedName1 = name1.toLowerCase().replace(/\s/g, '');
    const normalizedName2 = name2.toLowerCase().replace(/\s/g, '');
    return normalizedName1.includes(normalizedName2) || normalizedName2.includes(normalizedName1);
}

// Gemini API를 사용하여 식재료 상세 정보를 가져오는 함수
async function getIngredientDetailsFromAI(ingredientName) {
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const prompt = `
        "${ingredientName}" 식재료에 대한 상세 보관 정보를 JSON 객체 형태로 제공해주세요. 다음 필드를 포함해야 합니다:
        - "name": 식재료 이름 (예: "대파")
        - "defaultStoreMethod": 기본 권장 보관 방법 (예: "냉장", "실온", "냉동")
        - "storageTips": 보관 팁 (문자열)
        - "spoilageInfo": 상함 신호 (문자열)
        - "allergyInfo": 알레르기 정보 (문자열, 없으면 빈 문자열 "")
        - "shelfLife": 보관 기간 정보 (JSON 객체)
            - "unopened": 개봉 전 보관 기간 (JSON 객체)
                - "room_temp": 실온 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
                - "fridge": 냉장 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
                - "freezer": 냉동 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
            - "opened": 개봉 후 보관 기간 (JSON 객체)
                - "room_temp": 실온 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
                - "fridge": 냉장 보관 시 최대 소비기한 (일, 숫자, 없으면 null)
                - "freezer": 냉동 보관 시 최대 소비기한 (일, 숫자, 없으면 null)

        예시:
        \`\`\`json
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
        }
        \`\`\`
        다른 부가적인 설명은 절대 추가하지 마세요. 오직 JSON 객체만 반환해야 합니다.
    `;

    try {
        const response = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API 오류 응답 (식재료 상세) - 원본 텍스트:', errorText);
            if (errorText.startsWith('<!DOCTYPE') || errorText.startsWith('<html')) {
                throw new Error(`Gemini API (식재료 상세) 호출 중 HTML 오류 응답 수신. 상태 코드: ${response.status}. API 키를 확인하거나, 네트워크/프록시 설정을 확인하거나, 나중에 다시 시도하세요. 응답: ${errorText.substring(0, 200)}...`);
            }
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(`Gemini API (식재료 상세) 호출 실패: ${errorData.error ? errorData.error.message : '알 수 없는 오류'}`);
            } catch (jsonParseError) {
                throw new Error(`Gemini API (식재료 상세) 호출 실패: ${response.statusText}. 예상치 못한 응답 형식. 응답: ${errorText.substring(0, 200)}...`);
            }
        }

        const data = await response.json();
        let jsonString = data.candidates[0]?.content?.parts[0]?.text;

        const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
        }

        const ingredientDetails = JSON.parse(jsonString);
        return ingredientDetails;

    } catch (error) {
        console.error(`Gemini를 통한 '${ingredientName}' 식재료 상세 정보 가져오기 실패:`, error);
        return null;
    }
}


// Multer 설정 (이미지 파일 업로드를 위해 사용)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 4. API 라우트 정의 (API Routes)

// --- 통합 엔드포인트: 이미지에서 원본 제품명을 추출하고 바로 요약하여 반환 ---
router.post('/extract-and-summarize', upload.single('receiptImage'), async (req, res) => {
    try {
        if (!fetch) {
            return res.status(503).json({ msg: '서버가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.' });
        }

        if (!req.file) {
            return res.status(400).json({ msg: '이미지 파일이 업로드되지 않았습니다. "receiptImage" 필드를 확인해주세요.' });
        }

        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString('base64');
        const mimeType = req.file.mimetype;

        const extractPrompt = `
            이 이미지는 영수증 또는 온라인 쇼핑몰 구매 내역입니다.
            이미지에서 구매 일자(가장 명확한 날짜, YYYY-MM-DD 형식)와 식재료(음식, 요리 재료, 식료품)에 해당하는 항목의 전체 이름(브랜드명, 상세 설명 포함)을 정확하게 추출하여 JSON 객체 형태로 반환해주세요.
            **다른 종류의 상품은 절대 포함하지 마세요.**

            **구매 일자 필드는 'receiptDate'로, 찾을 수 없다면 null로 반환해주세요.**
            **식재료명 목록 필드는 'productNames'로, 각 상품명은 숫자와 함께 표시될 수 있으므로, 숫자와 함께 붙어 있는 상품명은 통째로 인식하여 반환해야 합니다. 예를 들어 '990 꼬마새송이'와 같이 숫자와 상품명이 붙어 있으면 '990 꼬마새송이' 전체를 식재료로 인식해주세요.**

            **반드시 제외해야 하는 항목의 예시 (온라인 쇼핑몰 UI 및 비식품 관련 문구 포함):**
            - 상점 이름, 회사 이름 (예: 다이소, 이마트, CU, 로켓배송)
            - 순수한 가격, 할인 정보, 균일가, 세일, 할인가, 행사, 증정, 상품권, 금액 관련 문구 (예: 1+1, 50% 할인, 총액, 부가세, 거스름돈, 합계, 금액, 원, GAP)
            - 결제 방식 (예: 현금, 카드, 삼성페이, 카카오페이)
            - 상점 슬로건, 안내 문구 (예: 행복을 드리는, 감사합니다, 구매금액, 영수증 번호)
            - 일상용품, 생활용품, 비식품류 (예: 샴푸, 세제, 휴지, 전구, 의류, 화장품, 문구류, 장난감)
            - 시간 정보 및 온라인 쇼핑몰 UI 요소 (예: 배송완료, N/N(요일) 도착, 교환, 반품 신청, 배송 조회, 장바구니 담기, 문의하기, 구매 후기 쓰기, 카테고리, 검색, 쿠팡홈, 마이쿠팡, 장바구니)

            예시 출력 형식:
            \`\`\`json
            {
                "receiptDate": "2023-10-26",
                "productNames": [
                    "삼진어묵 깐깐한 모둠 어묵",
                    "작아도 맛있는 양배추",
                    "미트엔조이 호주산 모듬 다짐육 (냉장)",
                    "990 꼬마새송이"
                ]
            }
            \`\`\`
            구매 일자를 찾을 수 없다면 "receiptDate": null로 반환해주세요. 식재료가 하나도 없다면 "productNames": []로 반환해주세요.
            다른 부가적인 설명은 절대 추가하지 마세요. 오직 JSON 객체만 반환해야 합니다.
        `;

        const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const extractGeminiResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: extractPrompt },
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64Image
                                }
                            }
                        ]
                    }
                ]
            })
        });

        if (!extractGeminiResponse.ok) {
            const errorText = await extractGeminiResponse.text();
            console.error('Gemini API 오류 응답 (추출) - 원본 텍스트:', errorText);
            if (errorText.startsWith('<!DOCTYPE') || errorText.startsWith('<html')) {
                return res.status(extractGeminiResponse.status).json({ msg: `Gemini API (추출) 호출 중 HTML 오류 응답 수신. 상태 코드: ${extractGeminiResponse.status}. API 키를 확인하거나, 네트워크/프록시 설정을 확인하거나, 나중에 다시 시도하세요.` });
            }
            try {
                const errorData = JSON.parse(errorText);
                return res.status(extractGeminiResponse.status).json({ msg: `Gemini API (추출) 호출 실패: ${errorData.error ? errorData.error.message : '알 수 없는 오류'}` });
            } catch (jsonParseError) {
                return res.status(extractGeminiResponse.status).json({ msg: `Gemini API (추출) 호출 실패: ${extractGeminiResponse.statusText}. 예상치 못한 응답 형식.` });
            }
        }

        const extractGeminiData = await extractGeminiResponse.json();
        let extractedContent = extractGeminiData.candidates[0]?.content?.parts[0]?.text;
        console.log("Gemini 원본 응답 텍스트 (Extract Content):", extractedContent);

        let extractedFromAI = { receiptDate: null, productNames: [] };
        try {
            const jsonMatch = extractedContent.match(/```json\s*([\s\S]*?)\s*```/);
            let jsonString = jsonMatch ? jsonMatch[1] : extractedContent;
            extractedFromAI = JSON.parse(jsonString);

            if (!('receiptDate' in extractedFromAI) || !('productNames' in extractedFromAI) || !Array.isArray(extractedFromAI.productNames)) {
                throw new Error('Gemini가 올바른 JSON 객체(receiptDate, productNames)를 반환하지 않았습니다.');
            }
            extractedFromAI.productNames = extractedFromAI.productNames.filter(item => typeof item === 'string' && item.trim().length > 0);
        } catch (parseError) {
            console.error('JSON 파싱 오류 발생 (Extract Content):', parseError.message);
            console.error('파싱 실패한 원본 텍스트:', extractedContent);
            extractedFromAI.productNames = extractedContent.split('\n')
                .map(line => line.replace(/^- |^\* |^\d+\.\s*|\[|\]/g, '').trim())
                .filter(line => line.length > 1 && !line.includes('예시:') && line.split(' ').length < 10);
            extractedFromAI.receiptDate = null;
        }

        let finalReceiptDate = extractedFromAI.receiptDate;
        if (!finalReceiptDate || !/^\d{4}-\d{2}-\d{2}$/.test(finalReceiptDate)) {
            const today = new Date();
            finalReceiptDate = today.toISOString().split('T')[0];
        }

        const namesToSummarize = extractedFromAI.productNames;

        if (namesToSummarize.length === 0) {
            return res.json({ summarizedProducts: [], receiptDate: finalReceiptDate });
        }

        const namesString = namesToSummarize.map(name => `- ${name}`).join('\n');
        const summarizePrompt = `
            다음은 식재료의 이름 목록입니다. 각 이름에 대해 **원본 제품명과 핵심만 남긴 간결한 요약 제품명을 함께 JSON 배열 형태로 반환해주세요.**
            요약 제품명은 브랜드명, 크기, 원산지, 부가 설명 등 불필요한 정보는 제거하고, 식재료의 핵심 이름을 **5단어 이하의 간결한 형태**로 요약해야 합니다.

            결과는 JSON 배열 형태로 반환하며, 각 요소는 다음과 같은 구조를 가져야 합니다:
            \`\`\`json
            [
              {"originalName": "원본 제품명", "summarizedName": "요약된 제품명"},
              {"originalName": "원본 제품명", "summarizedName": "요약된 제품명"},
              ...
            ]
            \`\`\`

            **상품명 요약 예시:**
            - "삼진어묵 깐깐한 모둠 어묵" -> {"originalName": "삼진어묵 깐깐한 모둠 어묵", "summarizedName": "모둠 어묵"}
            - "작아도 맛있는 양배추" -> {"originalName": "작아도 맛있는 양배추", "summarizedName": "양배추"}
            - "미트엔조이 호주산 모듬 다짐육 (냉장)" -> {"originalName": "미트엔조이 호주산 모듬 다짐육 (냉장)", "summarizedName": "다짐육"}
            - "990 꼬마새송이" -> {"originalName": "990 꼬마새송이", "summarizedName": "꼬마새송이"}
            - "오뚜기 옛날 사골곰탕 (냉동)" -> {"originalName": "오뚜기 옛날 사골곰탕 (냉동)", "summarizedName": "사골곰탕"}
            - "풀무원 국산콩 두부 (부침용)" -> {"originalName": "풀무원 국산콩 두부 (부침용)", "summarizedName": "두부"}

            **요약 대상 목록:**
            ${namesString}

            다른 부가적인 설명은 절대 추가하지 마세요. 오직 JSON 배열만 반환해야 합니다.
            만약 요약할 식재료가 하나도 없다면 빈 배열 '[]'을 반환해주세요.
        `;

        const summarizeGeminiResponse = await fetch(geminiApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: summarizePrompt }
                        ]
                    }
                ]
            })
        });

        if (!summarizeGeminiResponse.ok) {
            const errorText = await summarizeGeminiResponse.text();
            console.error('Gemini API 오류 응답 (요약) - 원본 텍스트:', errorText);
            if (errorText.startsWith('<!DOCTYPE') || errorText.startsWith('<html')) {
                return res.status(summarizeGeminiResponse.status).json({ msg: `Gemini API (요약) 호출 중 HTML 오류 응답 수신. 상태 코드: ${summarizeGeminiResponse.status}. API 키를 확인하거나, 네트워크/프록시 설정을 확인하거나, 나중에 다시 시도하세요.` });
            }
            try {
                const errorData = JSON.parse(errorText);
                return res.status(summarizeGeminiResponse.status).json({ msg: `Gemini API (요약) 호출 실패: ${errorData.error ? errorData.error.message : '알 수 없는 오류'}` });
            } catch (jsonParseError) {
                return res.status(summarizeGeminiResponse.status).json({ msg: `Gemini API (요약) 호출 실패: ${summarizeGeminiResponse.statusText}. 예상치 못한 응답 형식.` });
            }
        }

        const summarizeGeminiData = await summarizeGeminiResponse.json();
        let summarizedText = summarizeGeminiData.candidates[0]?.content?.parts[0]?.text;
        console.log("Gemini 원본 응답 텍스트 (Summarized):", summarizedText);

        let summarizedProducts = [];
        try {
            const jsonMatch = summarizedText.match(/```json\s*([\s\S]*?)\s*```/);
            let jsonString = jsonMatch ? jsonMatch[1] : summarizedText;
            summarizedProducts = JSON.parse(jsonString);

            if (!Array.isArray(summarizedProducts) ||
                !summarizedProducts.every(item => typeof item === 'object' && item !== null && 'originalName' in item && 'summarizedName' in item)) {
                throw new Error('Gemini가 JSON 배열(객체)이 아닌 다른 형식으로 응답했습니다.');
            }
            summarizedProducts = summarizedProducts.filter(item => item.originalName.trim().length > 0 && item.summarizedName.trim().length > 0);
        } catch (parseError) {
            console.error('JSON 파싱 오류 발생 (Summarize):', parseError.message);
            console.error('파싱 실패한 원본 텍스트:', summarizedText);
            summarizedProducts = namesToSummarize.map(name => ({ originalName: name, summarizedName: name }));
        }

        res.json({ summarizedProducts: summarizedProducts, receiptDate: finalReceiptDate });

    } catch (error) {
        console.error('백엔드 서버 내부 오류 (extract-and-summarize):', error);
        res.status(500).json({ msg: `서버 내부 오류: ${error.message}` });
    }
});

// --- 최종 데이터를 저장하는 API 엔드포인트 (name, date, quantity, storageMethod, isOpened 저장) ---
router.post('/save-products', auth, async (req, res) => { // ✅ auth 미들웨어 추가
    // 사용자 ID를 req.user.id에서 가져옵니다. (auth 미들웨어를 사용하므로 항상 유효한 ID가 제공됩니다.)
    const userId = req.user.id; // ✅ 'defaultUserId' 폴백 제거

    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ msg: '저장할 제품 정보가 제공되지 않았습니다.' });
    }

    try {
        const itemsToSaveToUser = [];
        const newTempIngredientMasters = [];

        for (const product of products) {
            const summarizedName = product.name;
            const productDate = product.date;

            const dateObj = new Date(productDate);
            let formattedPurchaseDate = productDate;

            if (!isNaN(dateObj.getTime())) {
                formattedPurchaseDate = dateObj.toISOString().split('T')[0];
            } else {
                console.warn(`유효하지 않은 날짜 형식 감지: ${productDate}. 원본 문자열을 그대로 사용하거나 추가 검토가 필요합니다.`);
            }

            // IngredientMaster 및 TempIngredientMaster에서 식재료 정보 조회
            let masterInfo = await ingredientService.getIngredientMasterByName(summarizedName);
            if (!masterInfo) {
                masterInfo = await ingredientService.getTempIngredientMasterByName(summarizedName);
            }

            let determinedStorageMethod = '냉장'; // 기본값 설정

            if (masterInfo && masterInfo.defaultStoreMethod) {
                determinedStorageMethod = masterInfo.defaultStoreMethod;
            }

            itemsToSaveToUser.push({
                name: summarizedName,
                purchaseDate: formattedPurchaseDate,
                quantity: product.quantity || '있음',
                storageMethod: determinedStorageMethod, // 마스터 데이터에서 결정된 보관 방법 사용
                isOpened: product.isOpened !== undefined ? product.isOpened : false,
            });

            // IngredientMaster와 TempIngredientMaster에 없는 새로운 식재료인 경우 Gemini API 호출
            if (!masterInfo) {
                console.log(`새로운 식재료 타입 발견: ${summarizedName}. Gemini로부터 상세 정보 가져오는 중...`);
                const details = await getIngredientDetailsFromAI(summarizedName);
                if (details) {
                    newTempIngredientMasters.push(details);
                }
            }
        }

        // 사용자 식재료 저장 (User 모델에 추가)
        const savedCount = await ingredientService.addMultipleIngredientsToUser(userId, itemsToSaveToUser);
        console.log(`사용자 식재료 업데이트 완료. ${savedCount}개 항목 저장됨.`);


        // 새로운 TempIngredientMaster 항목 저장
        let newIngredientTypesAddedCount = 0;
        if (newTempIngredientMasters.length > 0) {
            newIngredientTypesAddedCount = await ingredientService.addMultipleTempIngredientMasters(newTempIngredientMasters);
            console.log(`TempIngredientMaster 업데이트 완료. 새로운 식재료 타입: ${newIngredientTypesAddedCount}개`);
        } else {
            console.log('TempIngredientMaster에 새로운 식재료 타입이 추가되지 않았습니다.');
        }

        res.json({
            message: '식재료 정보가 성공적으로 저장되었습니다.',
            savedCount: savedCount,
            newIngredientTypesAdded: newIngredientTypesAddedCount
        });

    } catch (error) {
        console.error('데이터베이스 저장 중 오류 발생:', error);
        res.status(500).json({ msg: `식재료 정보 저장 중 오류 발생: ${error.message}` });
    }
});

// 이 파일은 라우터 인스턴스를 내보냅니다.
module.exports = router;