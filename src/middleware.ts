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
