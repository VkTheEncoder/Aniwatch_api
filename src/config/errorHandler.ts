// src/config/errorHandler.ts

import { HiAnimeError } from "aniwatch";
import type { ErrorHandler, NotFoundHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { log } from "./logger.js";

export const errorHandler: ErrorHandler = (err, c) => {
  // Log the raw error for debugging
  log.error(JSON.stringify(err));

  // Default to 500
  let status: ContentfulStatusCode = 500;
  let message = "Internal Server Error";

  // If it’s our scraper’s error class, pull its status/message
  if (err instanceof HiAnimeError) {
    status = (err.status as ContentfulStatusCode) || 500;
    message = err.message;
  }

  // Respond with JSON { status, message } and the appropriate HTTP code
  return c.json({ status, message }, status);
};

export const notFoundHandler: NotFoundHandler = (c) => {
  const status: ContentfulStatusCode = 404;
  const message = "Not Found";

  log.error(JSON.stringify({ status, message }));
  return c.json({ status, message }, status);
};
