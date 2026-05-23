import type { WebSearchResult } from "@/lib/agent";

type SerperPayload = {
  organic?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
  }>;
};

export function isWebSearchEnabled() {
  return process.env.LEARN_WEB_SEARCH_ENABLED === "true" && Boolean(process.env.SERPER_API_KEY);
}

export async function searchWeb(query: string, limit = 4): Promise<WebSearchResult[]> {
  if (!isWebSearchEnabled()) {
    return [];
  }

  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.SERPER_API_KEY as string,
    },
    body: JSON.stringify({
      q: query,
      num: Math.min(Math.max(limit, 1), 5),
      gl: "cn",
      hl: "zh-cn",
    }),
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as SerperPayload;

  return (payload.organic ?? [])
    .map((item) => ({
      title: item.title?.trim() ?? "",
      url: item.link?.trim() ?? "",
      snippet: item.snippet?.trim() ?? "",
      source: "Serper",
    }))
    .filter((item) => item.title && item.url && item.snippet)
    .slice(0, limit);
}
