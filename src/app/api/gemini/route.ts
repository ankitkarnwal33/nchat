import { NextRequest, NextResponse } from "next/server";
import { getGeminiResponse } from "@/src/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { type, message, commentOrDm } = await req.json();

    let prompt = "";

    if (type === "improve") {
      prompt = `Improve this ${commentOrDm}. Make it more professional, engaging and human:\n\n"${message}"`;
    }

    if (type === "generate") {
      prompt = `Write a short, engaging ${commentOrDm} for business outreach. Keep it friendly and natural.`;
    }

    const aiText = await getGeminiResponse(prompt);

    return NextResponse.json({ success: true, data: aiText });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
