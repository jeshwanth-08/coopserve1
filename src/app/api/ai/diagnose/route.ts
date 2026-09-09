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
    const { samplePresetId, userNotes, imageBase64, fileName } = body;

    const diagnosis = await diagnoseProblemFromImage({
      samplePresetId,
      userNotes,
      imageBase64,
      fileName,
    });

    return NextResponse.json({
      success: true,
      diagnosis,
    });
  } catch (error: any) {
    console.error("AI Diagnosis API error:", error);
    return NextResponse.json(
      { error: "Failed to process visual diagnosis" },
      { status: 500 }
    );
  }
}
