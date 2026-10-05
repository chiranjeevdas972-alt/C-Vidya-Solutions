/**
 * C Vidya Solutions - Cloudflare Worker Gateway
 * Connects cvidyasolutions.com to Google AI Studio Cloud Run backend
 * and serves static assets directly from Cloudflare Global CDN Edge.
 */

const TARGET_HOST = "ais-pre-hrsrnkyjs5thwr5cb4rnxg-45680654387.asia-southeast1.run.app";
const BACKUP_HOST = "ais-dev-hrsrnkyjs5thwr5cb4rnxg-45680654387.asia-southeast1.run.app";

export default {
  async fetch(request, env, ctx) {
    try {
      // 1. If static asset binding is available, try serving from Cloudflare Edge first
      if (env && env.ASSETS) {
        try {
          const assetRes = await env.ASSETS.fetch(request);
          if (assetRes.status < 400) {
            return assetRes;
          }
        } catch (_) {}
      }

      // 2. Otherwise forward request to Cloud Run backend
      const url = new URL(request.url);
      const targetUrl = new URL(url.pathname + url.search, `https://${TARGET_HOST}`);

      const newHeaders = new Headers(request.headers);
      newHeaders.set("Host", TARGET_HOST);
      newHeaders.set("X-Forwarded-Host", url.hostname);
      newHeaders.set("X-Forwarded-Proto", url.protocol.replace(":", ""));
      newHeaders.set("X-Real-IP", request.headers.get("CF-Connecting-IP") || "");

      const fetchOptions = {
        method: request.method,
        headers: newHeaders,
        redirect: "follow",
      };

      if (request.method !== "GET" && request.method !== "HEAD") {
        fetchOptions.body = request.body;
      }

      let response;
      try {
        response = await fetch(targetUrl.toString(), fetchOptions);
      } catch (originErr) {
        try {
          const backupUrl = new URL(url.pathname + url.search, `https://${BACKUP_HOST}`);
          newHeaders.set("Host", BACKUP_HOST);
          fetchOptions.headers = newHeaders;
          response = await fetch(backupUrl.toString(), fetchOptions);
        } catch (backupErr) {
          // If backend origin is warming up, fallback to root single-page app if available
          if (env && env.ASSETS) {
            const indexReq = new Request(new URL("/", request.url), request);
            const indexRes = await env.ASSETS.fetch(indexReq);
            if (indexRes.status < 400) return indexRes;
          }
          return new Response(
            `<!DOCTYPE html><html><head><meta charset="utf-8"><title>C Vidya Solutions</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:sans-serif;background:#071739;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;text-align:center;}.btn{display:inline-block;margin-top:20px;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;}</style></head><body><div><h2>C Vidya Solutions</h2><p>Application server is synchronizing. Please click below to refresh.</p><a href="/" class="btn" onclick="location.reload();return false;">Refresh Page</a></div></body></html>`,
            { status: 502, headers: { "Content-Type": "text/html; charset=utf-8" } }
          );
        }
      }

      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("X-Proxy-By", "Cloudflare-CVidya-Gateway");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(
        `<!DOCTYPE html><html><head><meta charset="utf-8"><title>C Vidya Solutions</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>C Vidya Solutions Gateway</h2><p>Please <a href="/" onclick="location.reload();">refresh</a> in a moment.</p></body></html>`,
        { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  },
};
