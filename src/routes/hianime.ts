import { Hono } from "hono";
import { HiAnime } from "aniwatch";
import { cache } from "../config/cache.js";
import type { ServerContext } from "../config/context.js";

const hianime = new HiAnime.Scraper();
const hianimeRouter = new Hono<ServerContext>();

// … all your earlier routes unchanged …

// /api/v2/hianime/search/suggestion?q={query}
hianimeRouter.get("/search/suggestion", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const query = decodeURIComponent(c.req.query("q") || "");

  const data = await cache.getOrSet(
    () => hianime.getAnimeSearchSuggestion(query),
    key,
    duration
  );

  return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/anime/{animeId}
hianimeRouter.get("/anime/:animeId", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const animeId = decodeURIComponent(c.req.param("animeId").trim());

  const data = await cache.getOrSet(
    () => hianime.getAnimeAboutInfo(animeId),
    key,
    duration
  );

  return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/episode/servers?animeEpisodeId={id}
hianimeRouter.get("/episode/servers", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const animeEpisodeId = decodeURIComponent(c.req.query("animeEpisodeId") || "");

  const data = await cache.getOrSet(
    () => hianime.getAnimeEpisodeServers(animeEpisodeId),
    key,
    duration
  );

  return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/episode/sources?animeEpisodeId={id}&server={server}&category={category}
hianimeRouter.get("/episode/sources", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const animeEpisodeId = decodeURIComponent(c.req.query("animeEpisodeId") || "");
  const server = decodeURIComponent(c.req.query("server") || "vidstreaming");
  const category = decodeURIComponent(c.req.query("category") || "sub");

  const data = await cache.getOrSet(
    () => hianime.getAnimeEpisodeSources(animeEpisodeId, server, category),
    key,
    duration
  );

  return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/anime/{animeId}/episodes
hianimeRouter.get("/anime/:animeId/episodes", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const animeId = decodeURIComponent(c.req.param("animeId").trim());

  const data = await cache.getOrSet(
    () => hianime.getAnimeEpisodes(animeId),
    key,
    duration
  );

  return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/anime/{animeId}/next-episode-schedule
hianimeRouter.get("/anime/:animeId/next-episode-schedule", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const animeId = decodeURIComponent(c.req.param("animeId").trim());

  const data = await cache.getOrSet(
    () => hianime.getAnimeNextEpisodeSchedule(animeId),
    key,
    duration
  );

  return c.json({ status: 200, data }, { status: 200 });
});

export { hianimeRouter };
