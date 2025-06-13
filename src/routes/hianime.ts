import { Hono } from "hono";
import { HiAnime } from "aniwatch";
import { cache } from "../config/cache.js";
import type { ServerContext } from "../config/context.js";

const hianime = new HiAnime.Scraper();
const hianimeRouter = new Hono<ServerContext>();

// Redirect root
hianimeRouter.get("/", (c) => c.redirect("/", 301));

// Home page
hianimeRouter.get("/home", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const data = await cache.getOrSet(
    () => hianime.getHomePage(),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// A–Z list
hianimeRouter.get("/azlist/:sortOption", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const sortOption = c.req.param("sortOption").trim().toLowerCase();
  const page = Number(c.req.query("page") || "1") || 1;

  const data = await cache.getOrSet(
    () => hianime.getAZList(sortOption, page),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Qtip info
hianimeRouter.get("/qtip/:animeId", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const animeId = c.req.param("animeId").trim();

  const data = await cache.getOrSet(
    () => hianime.getQtipInfo(animeId),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Category
hianimeRouter.get("/category/:name", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const categoryName = c.req.param("name").trim();
  const page = Number(c.req.query("page") || "1") || 1;

  const data = await cache.getOrSet(
    () => hianime.getCategoryAnime(categoryName, page),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Genre
hianimeRouter.get("/genre/:name", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const genreName = c.req.param("name").trim();
  const page = Number(c.req.query("page") || "1") || 1;

  const data = await cache.getOrSet(
    () => hianime.getGenreAnime(genreName, page),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Producer
hianimeRouter.get("/producer/:name", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const producerName = c.req.param("name").trim();
  const page = Number(c.req.query("page") || "1") || 1;

  const data = await cache.getOrSet(
    () => hianime.getProducerAnimes(producerName, page),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Schedule
hianimeRouter.get("/schedule", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const date = c.req.query("date") || "";
  const tzOffset = Number(c.req.query("tzOffset") || "-330");

  const data = await cache.getOrSet(
    () => hianime.getEstimatedSchedule(date, isNaN(tzOffset) ? -330 : tzOffset),
    `${key}_${tzOffset}`,
    duration
  );
  return c.json({ status: 200, data });
});

// Search
hianimeRouter.get("/search", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const query = c.req.query("q") || "";
  const page = Number(c.req.query("page") || "1") || 1;
  const filters = { ...c.req.query() };
  delete filters.q;
  delete filters.page;

  const data = await cache.getOrSet(
    () => hianime.search(query, page, filters),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Search suggestions
hianimeRouter.get("/search/suggestion", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const query = c.req.query("q") || "";

  const data = await cache.getOrSet(
    () => hianime.searchSuggestions(query),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Anime details
hianimeRouter.get("/anime/:animeId", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const animeId = c.req.param("animeId").trim();

  const data = await cache.getOrSet(
    () => hianime.getInfo(animeId),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Episode servers
hianimeRouter.get("/episode/servers", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const episodeId = c.req.query("animeEpisodeId") || "";

  const data = await cache.getOrSet(
    () => hianime.getEpisodeServers(episodeId),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Episode sources
hianimeRouter.get("/episode/sources", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const episodeId = c.req.query("animeEpisodeId") || "";
  const server = c.req.query("server") || "vidstreaming";
  const category = c.req.query("category") || "sub";

  const data = await cache.getOrSet(
    () => hianime.getEpisodeSources(episodeId, server, category),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Episode list
hianimeRouter.get("/anime/:animeId/episodes", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const animeId = c.req.param("animeId").trim();

  const data = await cache.getOrSet(
    () => hianime.getEpisodes(animeId),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

// Next-episode schedule
hianimeRouter.get("/anime/:animeId/next-episode-schedule", async (c) => {
  const { key, duration } = c.get("CACHE_CONFIG");
  const animeId = c.req.param("animeId").trim();

  const data = await cache.getOrSet(
    () => hianime.getNextEpisodeSchedule(animeId),
    key,
    duration
  );
  return c.json({ status: 200, data });
});

export { hianimeRouter };
