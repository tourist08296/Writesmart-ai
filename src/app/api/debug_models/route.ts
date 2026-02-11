import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "No API Key found" }, { status: 500 });
    }

    try {
        // 直接调用 Google REST API 列出可用模型
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        return NextResponse.json({
            status: "ok",
            key_configured: "yes",
            models: data
        });
    } catch (error: any) {
        return NextResponse.json({
            error: "Failed to list models",
            details: error.message
        }, { status: 500 });
    }
}
