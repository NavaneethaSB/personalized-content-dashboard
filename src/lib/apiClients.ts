import { ContentItem, ContentCategory } from "@/types";
import { initialMockContent } from "./mockData";

// Fetch News (TVMaze/HackerNews/Reddit or Fallback)
export async function fetchNewsItems(category: ContentCategory = "all", apiKey?: string): Promise<ContentItem[]> {
  try {
    // If user provided a NewsAPI key
    if (apiKey) {
      const catParam = category === "all" ? "general" : category;
      const res = await fetch(`https://newsapi.org/v2/top-headlines?category=${catParam}&language=en&pageSize=10&apiKey=${apiKey}`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          return data.articles.map((art: any, index: number) => ({
            id: `news-api-${index}-${Date.now()}`,
            type: "news" as const,
            mediaType: "article" as const,
            category: category === "all" ? "technology" : category,
            title: art.title || "Headline",
            description: art.description || art.content || "Read the full coverage for more details.",
            fullContent: art.content || art.description || "",
            imageUrl: art.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
            source: {
              name: art.source?.name || "News Source",
              handle: `@${(art.source?.name || "news").toLowerCase().replace(/\s+/g, "")}`,
              verified: true,
            },
            url: art.url,
            publishedAt: art.publishedAt || new Date().toISOString(),
            readTime: "4 min read",
            tags: [category, "Breaking", "World"],
            metrics: {
              likes: Math.floor(Math.random() * 2000) + 150,
              comments: Math.floor(Math.random() * 300) + 20,
              views: Math.floor(Math.random() * 25000) + 2000,
            },
          }));
        }
      }
    }

    // Try fetching live public HackerNews / Tech / Science headlines
    const hnRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
      signal: AbortSignal.timeout(4000),
    });
    if (hnRes.ok) {
      const storyIds: number[] = await hnRes.json();
      const topIds = storyIds.slice(0, 5);
      const stories = await Promise.all(
        topIds.map(async (id) => {
          const sRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
            signal: AbortSignal.timeout(3000),
          });
          return sRes.ok ? sRes.json() : null;
        })
      );

      const liveNews: ContentItem[] = stories
        .filter((s) => s && s.title && s.url)
        .map((s, idx) => ({
          id: `hn-${s.id}`,
          type: "news" as const,
          mediaType: "article" as const,
          category: idx % 2 === 0 ? "technology" : "science",
          title: s.title,
          description: `Trending discussion on Hacker News with score of ${s.score || 100} and ${s.descendants || 0} active comments from software engineers and founders.`,
          fullContent: `Original story posted by ${s.by}. Read more at the source URL or participate in the live community discussion.`,
          imageUrl: [
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
          ][idx % 5],
          source: {
            name: "Hacker News",
            handle: `@${s.by || "hn_user"}`,
            verified: true,
          },
          url: s.url,
          publishedAt: new Date(s.time * 1000).toISOString(),
          readTime: "3 min read",
          tags: ["HN", "Engineering", "Technology"],
          metrics: {
            likes: s.score || 150,
            comments: s.descendants || 45,
            shares: Math.floor((s.score || 150) * 0.3),
            views: (s.score || 150) * 40,
          },
        }));

      if (liveNews.length > 0) {
        return liveNews;
      }
    }
  } catch (error) {
    console.warn("Live news fetch fallback triggered:", error);
  }

  // Resilient fallback to curated mock news
  return initialMockContent.filter((item) => item.type === "news");
}

// Fetch Recommendations (TVMaze public API / TMDB)
export async function fetchRecommendationsItems(category: ContentCategory = "all"): Promise<ContentItem[]> {
  try {
    // TVMaze public API is reliable, high quality, and requires no API key!
    const tvRes = await fetch("https://api.tvmaze.com/shows?page=1", {
      signal: AbortSignal.timeout(4000),
    });
    if (tvRes.ok) {
      const shows = await tvRes.json();
      if (Array.isArray(shows) && shows.length > 0) {
        return shows.slice(0, 6).map((show: any) => ({
          id: `show-${show.id}`,
          type: "recommendation" as const,
          mediaType: "show" as const,
          category: (show.genres?.includes("Science-Fiction") ? "technology" : "entertainment") as ContentCategory,
          title: `${show.name} (${show.premiered?.split("-")[0] || "2024"})`,
          description: show.summary ? show.summary.replace(/<[^>]*>/g, "").slice(0, 220) + "..." : "A gripping top-rated television recommendation.",
          fullContent: `${show.summary ? show.summary.replace(/<[^>]*>/g, "") : ""}\n\nLanguage: ${show.language} | Status: ${show.status} | Network: ${show.network?.name || "Streaming"} | Average Runtime: ${show.averageRuntime || 60}m`,
          imageUrl: show.image?.original || show.image?.medium || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
          source: {
            name: "TV & Cinema Hub",
            handle: "@tvhub",
            verified: true,
          },
          url: show.officialSite || show.url || "https://tvmaze.com",
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          rating: show.rating?.average || 8.5,
          tags: show.genres || ["Drama", "Popular"],
          metrics: {
            likes: Math.floor((show.weight || 80) * 90),
            comments: Math.floor((show.weight || 80) * 12),
            score: Math.round((show.rating?.average || 8.5) * 10),
            views: Math.floor((show.weight || 80) * 1200),
          },
        }));
      }
    }
  } catch (error) {
    console.warn("Live TVMaze recommendations fallback triggered:", error);
  }

  return initialMockContent.filter((item) => item.type === "recommendation");
}

// Fetch Social Posts (Reddit public JSON / Mastodon or Fallback)
export async function fetchSocialItems(category: ContentCategory = "all"): Promise<ContentItem[]> {
  try {
    const subreddit = category === "technology" ? "technology" : category === "science" ? "science" : "popular";
    const redditRes = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=8`, {
      signal: AbortSignal.timeout(4000),
      headers: {
        "User-Agent": "PersonalizedDashboard/1.0",
      },
    });

    if (redditRes.ok) {
      const data = await redditRes.json();
      const posts = data.data?.children;
      if (Array.isArray(posts) && posts.length > 0) {
        return posts
          .filter((p: any) => !p.data.stickied && p.data.title)
          .slice(0, 5)
          .map((p: any) => {
            const d = p.data;
            const img =
              d.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") ||
              d.thumbnail?.startsWith("http")
                ? d.thumbnail
                : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80";

            return {
              id: `social-rd-${d.id}`,
              type: "social" as const,
              mediaType: "post" as const,
              category: (category === "all" ? "technology" : category) as ContentCategory,
              title: d.title,
              description: d.selftext ? d.selftext.slice(0, 200) + "..." : `Top trending discussion in r/${d.subreddit} with ${d.ups} upvotes.`,
              fullContent: d.selftext || `Community conversation started by u/${d.author} in r/${d.subreddit}. Upvote ratio: ${(d.upvote_ratio * 100).toFixed(0)}%.`,
              imageUrl: img,
              source: {
                name: `r/${d.subreddit}`,
                handle: `@${d.author}`,
                avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${d.author}`,
                verified: d.ups > 1000,
              },
              url: `https://reddit.com${d.permalink}`,
              publishedAt: new Date(d.created_utc * 1000).toISOString(),
              tags: [d.subreddit, "Community", "Hot"],
              metrics: {
                likes: d.ups || 450,
                comments: d.num_comments || 80,
                shares: Math.floor((d.ups || 450) * 0.15),
                views: (d.ups || 450) * 35,
              },
            };
          });
      }
    }
  } catch (error) {
    console.warn("Live social media fallback triggered:", error);
  }

  return initialMockContent.filter((item) => item.type === "social");
}
