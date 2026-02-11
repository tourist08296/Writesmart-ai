import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
// 使用最稳定的 gemini-pro 作为基础模型
const textModel = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: {
        responseMimeType: "application/json",
    }
});

// 图片模型尝试使用 gemini-1.5-flash，如果失败则回退到 gemini-pro-vision (但在 Vercel 可能超时)
const visionModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    }
});

// 设置 Vercel 函数最大执行时间为 60 秒 (Hobby 计划上限)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const type = formData.get("type") as string;
        const content = formData.get("content");

        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            return NextResponse.json({ error: "未配置 Gemini API Key" }, { status: 500 });
        }

        const systemPrompt = `你是一位专业的语文老师和写作教练。你的任务是分析学生提交的作文并提供评分和反馈。
    评分维度包括：结构、内容、语言和语法（均为100分制）。
    反馈必须具体、易懂、可执行，避免使用过于深奥的术语。
    你还需要推荐 2-3 个好句或名言，并提供 1-2 条具体的修改方案。
    
    请务必返回 JSON 格式结果，格式如下：
    {
      "score": {
        "total": 数字,
        "dimensions": [
          { "label": "结构", "score": 数字, "comment": "简短评价" },
          { "label": "内容", "score": 数字, "comment": "简短评价" },
          { "label": "语言", "score": 数字, "comment": "简短评价" },
          { "label": "语法", "score": 数字, "comment": "简短评价" }
        ]
      },
      "feedback": "整体总结性反馈",
      "suggestions": ["修改建议1", "修改建议2"],
      "quotes": [{ "text": "名言内容", "author": "作者" }]
    }`;

        let promptParts: any[] = [systemPrompt];
        let currentModel = textModel;

        if (type === "text") {
            promptParts.push(`这是学生的作文内容：\n\n${content}`);
            currentModel = textModel; // 纯文本使用 gemini-pro
        } else if (type === "image" && content instanceof File) {
            const buffer = await content.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            promptParts.push("请先识别这张图片中的文字，然后根据识别出的文字内容进行作文分析和评分。");
            promptParts.push({
                inlineData: {
                    data: base64,
                    mimeType: content.type
                }
            });
            currentModel = visionModel; // 图片使用 flash
        } else {
            return NextResponse.json({ error: "无效的提交内容" }, { status: 400 });
        }

        const result = await currentModel.generateContent(promptParts);
        const responseText = result.response.text();

        try {
            const jsonResult = JSON.parse(responseText);
            return NextResponse.json(jsonResult);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, responseText);
            // 尝试修复 JSON
            const fixedJsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (fixedJsonMatch) {
                try {
                    return NextResponse.json(JSON.parse(fixedJsonMatch[0]));
                } catch (e) {
                    return NextResponse.json({ error: "AI 返回内容格式错误，请重试" }, { status: 500 });
                }
            }
            return NextResponse.json({ error: "AI 返回格式错误" }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Gemini Analysis Error:", error);
        // 返回更详细的错误信息
        return NextResponse.json({
            error: (error.message || "AI 分析失败，请稍后重试") + " (v3.0 PRO/FLASH)",
            details: JSON.stringify(error)
        }, { status: 500 });
    }
}
