import { NextResponse } from "next/server";
import {
  diagnoseProblemFromImage,
  SAMPLE_ISSUE_PRESETS,
} from "@/lib/aiProblemDetector";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    presets: SAMPLE_ISSUE_PRESETS.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      thumbnail: p.thumbnail,
      description: p.description,
    })),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { samplePresetId, userNotes, imageBase64, fileName, apiKey } = body;

    const result = await diagnoseProblemFromImage({
      samplePresetId,
      userNotes,
      imageBase64,
      fileName,
      apiKey: apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Diagnosis API error:", error);
    return NextResponse.json(
      {
        success: false,
        isHouseholdDefect: false,
        error: "API_ERROR",
        message: "Failed to process visual diagnosis. Please try again or test a sample issue.",
      },
      { status: 500 }
    );
  }
}
