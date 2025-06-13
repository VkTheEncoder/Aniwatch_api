// src/types/shims-aniwatch.d.ts

/**
 * Minimal type declarations for the `aniwatch` scraper package.
 * Expands the HiAnime namespace so all of your referenced types exist.
 */

declare module "aniwatch" {
  /**
   * The HiAnime scraper namespace.  
   * Your code references things like HiAnime.Scraper,
   * plus these types: ScrapedEpisodeServers, AnimeServers, etc.
   */
  export namespace HiAnime {
    export class Scraper {
      // you can leave this empty or add: search(...): Promise<any>, etc.
    }

    // These are the types your routes expect to import/use:
    export type ScrapedEpisodeServers       = any;
    export type AnimeServers                = any;
    export type ScrapedAnimeEpisodesSources = any;
    export type ScrapedAnimeEpisodes        = any;
    export type ScrapedNextEpisodeSchedule  = any;
  }

  /**
   * The runtime value you do `import { HiAnime } from "aniwatch";`
   */
  export const HiAnime: any;

  /**
   * The error class thrown by the scraper on HTTP/parsing errors.
   */
  export class HiAnimeError extends Error {
    public status: number;
    constructor(message?: string, status?: number);
  }
}
