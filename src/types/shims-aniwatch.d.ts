// src/types/shims-aniwatch.d.ts

/**
 * Minimal type declarations for the `aniwatch` scraper package.
 */

declare module "aniwatch" {
  /**
   * Error thrown by the HiAnime scraper when an HTTP or parsing error occurs.
   */
  export class HiAnimeError extends Error {
    /** HTTP status code (e.g. 404, 500) */
    public status: number;
    constructor(message: string, status: number);
  }

  /**
   * Top‐level namespace for the HiAnime scraper.  
   * In your code you do:
   *   import { HiAnime } from "aniwatch";
   *   const scraper = new HiAnime.Scraper();
   *
   * We type it as `any` so you can call whatever methods exist
   * (search, fetchEpisodes, fetchSources, etc.) without TS errors.
   */
  export const HiAnime: any;
}
