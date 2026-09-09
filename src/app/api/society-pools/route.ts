import { NextResponse } from "next/server";
import {
  getActiveSocietyPools,
  getPoolByCode,
  validatePoolJoining,
} from "@/lib/societyPoolService";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const society = searchParams.get("society") || undefined;
    const category = searchParams.get("category") || undefined;
    const locality = searchParams.get("locality") || undefined;

    if (code) {
      const pool = await getPoolByCode(code);
      if (!pool) {
        return NextResponse.json(
          { error: "Invalid group pool code: " + code + ". No active pool found." },
          { status: 404 }
        );
      }

      // If user supplied context, validate compatibility
      let validation = { eligible: true };
      if (society || category) {
        validation = validatePoolJoining(pool, {
          societyName: society || "",
          category: category || "",
          locality,
        });
      }

      return NextResponse.json({
        pool,
        validation,
      });
    }

    const pools = await getActiveSocietyPools({ society, category, locality });
    return NextResponse.json({ pools });
  } catch (error) {
    console.error("GET /api/society-pools error:", error);
    return NextResponse.json({ error: "Failed to fetch society pools" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, societyName, category, locality } = body;

    if (!code) {
      return NextResponse.json({ error: "Group code is required" }, { status: 400 });
    }

    const pool = await getPoolByCode(code);
    if (!pool) {
      return NextResponse.json({ error: "Pool not found for code: " + code }, { status: 404 });
    }

    const validation = validatePoolJoining(pool, {
      societyName: societyName || "",
      category: category || "",
      locality,
    });

    if (!validation.eligible) {
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully verified society pool " + pool.code,
      pool,
    });
  } catch (error) {
    console.error("POST /api/society-pools error:", error);
    return NextResponse.json({ error: "Failed to process society pool" }, { status: 500 });
  }
}
