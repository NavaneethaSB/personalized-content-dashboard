import { NextResponse } from "next/server";
import { fetchNewsItems } from "@/lib/apiClients";
import { ContentCategory } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") || "all") as ContentCategory;
  const apiKey = searchParams.get("apiKey") || undefined;

  try {
    const items = await fetchNewsItems(category, apiKey);
    return NextResponse.json({ success: true, items, count: items.length });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch news" },
      { status: 500 }
    );
  }
}
