import { NextResponse } from "next/server";
import { fetchSocialItems } from "@/lib/apiClients";
import { ContentCategory } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") || "all") as ContentCategory;

  try {
    const items = await fetchSocialItems(category);
    return NextResponse.json({ success: true, items, count: items.length });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch social posts" },
      { status: 500 }
    );
  }
}
