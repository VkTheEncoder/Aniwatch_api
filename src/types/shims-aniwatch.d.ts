// src/types/shims-aniwatch.d.ts

/**
 * Minimal type declarations for the `aniwatch` scraper package.
 * This lets TypeScript see both the HiAnime namespace and the error class.
 */

declare module "aniwatch" {
  /**
   * The HiAnime scraper namespace.  
   * In your code you do things like `new HiAnime.Scraper()`.
   * We leave it as `any` so any nested classes or methods are allowed.
   */
  export namespace HiAnime {
    // You can add specific types here later if you like:
    // export class Scraper { ... }
    // export function search(...): Promise<...>;
  }

  /**
   * The runtime value you import in your code:
   *   import { HiAnime } from "aniwatch";
   */
  export const HiAnime: any;

  /**
   * The error class thrown by the scraper when something goes wrong:
   *   import { HiAnimeError } from "aniwatch";
   *   if (err instanceof HiAnimeError) { … }
   */
  export class HiAnimeError extends Error {
    /** HTTP status code, e.g. 404 or 500 */
    public status: number;
    constructor(message?: string, status?: number);
  }
}
