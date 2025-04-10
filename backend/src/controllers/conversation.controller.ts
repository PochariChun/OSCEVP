import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// 讀取評分標準
const scoringCriteria = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../scoring_criteria_gi.json'),
    'utf-8'
  )
);

// 計算對話評分
export const scoreConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 獲取對話記錄
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { 
        patient: true,
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: '找不到對話記錄' });
    }

    if (conversation.userId !== userId) {
      return res.status(403).json({ error: '無權訪問此對話記錄' });
    }

    // 評分邏輯
    const scoreResult = calculateScore(conversation.messages, scoringCriteria);
    
    // 更新對話記錄的評分
    const updatedConversation = await prisma.conversation.update({
      where: { id },
      data: {
        totalScore: scoreResult.totalScore,
        maxScore: scoreResult.maxScore,
        status: 'completed',
        endTime: new Date(),
        categories: {
          create: scoreResult.categories.map(category => ({
            name: category.類別,
            totalScore: category.總分,
            maxScore: category.滿分,
            items: {
              create: category.項目.map(item => ({
                name: item.項目,
                score: item.得分 || 0,
                maxScore: item.配分,
                completed: item.完成 || false,
                subItems: item.細項 ? JSON.stringify(item.細項) : null
              }))
            }
          }))
        }
      }
    });

    res.json({
      id: conversation.id,
      patientName: conversation.patient.name,
      date: conversation.startTime.toISOString().split('T')[0],
      duration: formatDuration(
        (conversation.endTime || new Date()).getTime() - conversation.startTime.getTime()
      ),
      totalScore: scoreResult.totalScore,
      maxScore: scoreResult.maxScore,
      categories: scoreResult.categories
    });
  } catch (error) {
    console.error('評分對話時出錯:', error);
    res.status(500).json({ error: '評分對話時出錯' });
  }
};

// 獲取對話評分結果
export const getConversationResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 獲取對話記錄及其評分
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        patient: true,
        categories: {
          include: {
            items: true
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: '找不到對話記錄' });
    }

    if (conversation.userId !== userId) {
      return res.status(403).json({ error: '無權訪問此對話記錄' });
    }

    // 格式化評分結果
    const result = {
      id: conversation.id,
      patientName: conversation.patient.name,
      date: conversation.startTime.toISOString().split('T')[0],
      duration: formatDuration(
        (conversation.endTime || new Date()).getTime() - conversation.startTime.getTime()
      ),
      totalScore: conversation.totalScore || 0,
      maxScore: conversation.maxScore || 100,
      categories: conversation.categories.map(category => ({
        類別: category.name,
        總分: category.totalScore,
        滿分: category.maxScore,
        項目: category.items.map(item => ({
          項目: item.name,
          配分: item.maxScore,
          得分: item.score,
          完成: item.completed,
          細項: item.subItems ? JSON.parse(item.subItems) : undefined
        }))
      }))
    };

    res.json(result);
  } catch (error) {
    console.error('獲取評分結果時出錯:', error);
    res.status(500).json({ error: '獲取評分結果時出錯' });
  }
};

// 輔助函數：計算評分
function calculateScore(messages, criteria) {
  // 實現評分邏輯
  // 這裡需要根據對話內容和評分標準進行評分
  // 返回評分結果
}

// 輔助函數：格式化時間
function formatDuration(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  return `${minutes}分鐘`;
} 