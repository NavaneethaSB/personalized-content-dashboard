import { NextResponse } from "next/server";
import { fetchNewsItems, fetchRecommendationsItems, fetchSocialItems } from "@/lib/apiClients";
import { ContentCategory } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") || "all") as ContentCategory;

  try {
    const [news, recs, social] = await Promise.all([
      fetchNewsItems(category),
      fetchRecommendationsItems(category),
      fetchSocialItems(category),
    ]);

    const allItems = [...news, ...recs, ...social];
    // Sort by metric score / likes descending
    const trending = allItems.sort((a, b) => {
      const scoreA = (a.metrics?.likes || 0) + (a.metrics?.views || 0) * 0.1;
      const scoreB = (b.metrics?.likes || 0) + (b.metrics?.views || 0) * 0.1;
      return scoreB - scoreA;
    });

    return NextResponse.json({
      success: true,
      items: trending,
      topNews: trending.filter((i) => i.type === "news").slice(0, 4),
      topRecommendations: trending.filter((i) => i.type === "recommendation").slice(0, 4),
      topSocial: trending.filter((i) => i.type === "social").slice(0, 4),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch trending items" },
      { status: 500 }
    );
  }
}
