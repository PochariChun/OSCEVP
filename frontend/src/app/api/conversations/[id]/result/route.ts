import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

// 從資料庫獲取對話評分結果
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 驗證用戶令牌
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權訪問' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: '無效的令牌' },
        { status: 401 }
      );
    }

    // 從資料庫獲取對話評分結果
    // 實際項目中應該從資料庫獲取數據
    // const result = await prisma.conversationResult.findUnique({
    //   where: { id: params.id },
    //   include: { categories: true, items: true }
    // });
    
    // 如果找不到結果，返回404
    // if (!result) {
    //   return NextResponse.json(
    //     { error: '找不到評分結果' },
    //     { status: 404 }
    //   );
    // }

    // 模擬數據
    const mockResult = {
      id: params.id,
      patientName: '張三 - 發熱腹瀉',
      date: '2023-05-15',
      duration: '15分鐘',
      totalScore: 78,
      maxScore: 100,
      categories: [
        {
          類別: '病人辨識',
          總分: 6,
          滿分: 8,
          項目: [
            {
              項目: '確認床號',
              配分: 2,
              得分: 2,
              完成: true
            },
            {
              項目: '詢問病人姓名',
              配分: 2,
              得分: 2,
              完成: true
            },
            {
              項目: '核對病人手圈或腳圈',
              配分: 2,
              得分: 0,
              完成: false
            },
            {
              項目: '自我介紹與說明角色與目的',
              配分: 2,
              得分: 2,
              完成: true
            }
          ]
        },
        {
          類別: '病人情況',
          總分: 32,
          滿分: 42,
          項目: [
            {
              項目: '開始不舒服的時間',
              配分: 4,
              得分: 4,
              完成: true
            },
            {
              項目: '大便情況',
              配分: 10,
              得分: 8,
              完成: true,
              細項: ['次數', '性狀', '量', '有無血絲']
            },
            {
              項目: '嘔吐情況',
              配分: 10,
              得分: 6,
              完成: true,
              細項: ['次數', '內容', '顏色', '量']
            },
            {
              項目: '食慾',
              配分: 6,
              得分: 4,
              完成: true,
              細項: ['減少', '吃什麼', '量']
            },
            {
              項目: '進食與症狀的關聯',
              配分: 4,
              得分: 2,
              完成: true
            },
            {
              項目: '發燒史評估',
              配分: 8,
              得分: 8,
              完成: true,
              細項: ['開始時間', '最高體溫', '處置方式', '退燒情形']
            }
          ]
        },
        {
          類別: '評估檢查',
          總分: 7,
          滿分: 9,
          項目: [
            {
              項目: '一般護理評估',
              配分: 2,
              得分: 2,
              完成: true
            },
            {
              項目: '測量生命徵象（量心尖脈）',
              配分: 2,
              得分: 2,
              完成: true
            },
            {
              項目: '腹部評估（視、聽、扣、觸）',
              配分: 2,
              得分: 2,
              完成: true
            },
            {
              項目: '腹痛評估（使用量表）',
              配分: 3,
              得分: 1,
              完成: false
            }
          ]
        },
        {
          類別: '護理指導',
          總分: 8,
          滿分: 10,
          項目: [
            {
              項目: '腹瀉護理指導',
              配分: 10,
              得分: 8,
              完成: true,
              細項: ['記錄顏色', '性質', '必要時禁食', '皮膚護理', '飲食選擇BART']
            }
          ]
        },
        {
          類別: '記錄',
          總分: 12,
          滿分: 15,
          項目: [
            {
              項目: '發燒',
              配分: 4,
              得分: 4,
              完成: true,
              細項: ['開始時間', '最高溫度', '處理', '處理結果']
            },
            {
              項目: '腹瀉',
              配分: 6,
              得分: 4,
              完成: true,
              細項: ['開始時間', '頻率', '量', '性狀', '顏色', '有無血絲']
            },
            {
              項目: '嘔吐',
              配分: 5,
              得分: 4,
              完成: true,
              細項: ['開始時間', '頻率', '量', '性狀', '顏色']
            }
          ]
        },
        {
          類別: '綜合性表現',
          總分: 6,
          滿分: 6,
          項目: [
            {
              項目: '護理評估流暢度',
              配分: 2,
              得分: 2,
              完成: true
            },
            {
              項目: '關心病童及家屬反應',
              配分: 2,
              得分: 2,
              完成: true
            },
            {
              項目: '態度及語調親切',
              配分: 2,
              得分: 2,
              完成: true
            }
          ]
        }
      ]
    };

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('獲取評分結果時出錯:', error);
    return NextResponse.json(
      { error: '獲取評分結果時出錯' },
      { status: 500 }
    );
  }
} 