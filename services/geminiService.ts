
import { GoogleGenAI, Type } from "@google/genai";

// Always use the process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getMotivationalQuote(tasks: string[]): Promise<string> {
  try {
    const prompt = tasks.length > 0 
      ? `این لیست کارهای من برای این هفته است: ${tasks.join(', ')}. بر اساس این کارها، یک جمله انگیزشی کوتاه و الهام‌بخش به زبان فارسی بنویس که به من انرژی بدهد.`
      : "یک جمله انگیزشی کوتاه و الهام‌بخش به زبان فارسی برای شروع هفته بنویس.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and inspiring life coach who speaks Persian. Keep quotes under 20 words.",
      },
    });

    return response.text?.trim() || "تلاش امروز، موفقیت فرداست.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "هر روز یک فرصت تازه است.";
  }
}
