
declare module 'astro:middleware' {
  type MiddlewareContext = {
    request: Request;
    url: URL;
    locals: Record<string, any>;
    params: Record<string, string | undefined>;
    [key: string]: any;
  };

  type MiddlewareNext = () => Promise<Response> | Response;

  export function defineMiddleware(
    middleware: (
      context: MiddlewareContext,
      next: MiddlewareNext,
    ) => Promise<Response> | Response,
  ): (context: MiddlewareContext, next: MiddlewareNext) => Promise<Response> | Response;
}

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const startTime = Date.now();

  const response = await next();

  const log = {
    level: 'info',
    message: 'HTTP request completed',
    method: context.request.method,
    path: context.url.pathname,
    status: response.status,
    durationMs: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  };

  console.log(JSON.stringify(log));

  return response;
});
