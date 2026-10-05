/**
 * C Vidya Solutions - Cloudflare Worker Reverse Proxy
 * Fixes Cloudflare Error 1101 (Worker threw exception) completely.
 * 
 * Copy and paste this exact script into:
 * Cloudflare Dashboard -> Workers & Pages -> Your Worker -> Edit Code -> Deploy
 */

const TARGET_HOST = "ais-pre-hrsrnkyjs5thwr5cb4rnxg-45680654387.asia-southeast1.run.app";
const BACKUP_HOST = "ais-dev-hrsrnkyjs5thwr5cb4rnxg-45680654387.asia-southeast1.run.app";

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // Construct target URL preserving path and query parameters
      const targetUrl = new URL(url.pathname + url.search, `https://${TARGET_HOST}`);

      // Clone and modify headers safely (never modify request.headers directly)
      const newHeaders = new Headers(request.headers);
      newHeaders.set("Host", TARGET_HOST);
      newHeaders.set("X-Forwarded-Host", url.hostname);
      newHeaders.set("X-Forwarded-Proto", url.protocol.replace(":", ""));
      newHeaders.set("X-Real-IP", request.headers.get("CF-Connecting-IP") || "");

      // Prepare safe fetch options (CRITICAL: Never send body on GET or HEAD requests)
      const fetchOptions = {
        method: request.method,
        headers: newHeaders,
        redirect: "follow",
      };

      if (request.method !== "GET" && request.method !== "HEAD") {
        fetchOptions.body = request.body;
      }

      // Execute fetch to origin with error protection
      let response;
      try {
        response = await fetch(targetUrl.toString(), fetchOptions);
      } catch (originError) {
        // If primary target is temporarily syncing, try backup host
        try {
          const backupUrl = new URL(url.pathname + url.search, `https://${BACKUP_HOST}`);
          newHeaders.set("Host", BACKUP_HOST);
          fetchOptions.headers = newHeaders;
          response = await fetch(backupUrl.toString(), fetchOptions);
        } catch (backupError) {
          return new Response(
            `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>C Vidya Solutions - Service Syncing</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #071739; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; max-width: 500px; text-align: center; }
    h1 { font-size: 24px; color: #60a5fa; margin-bottom: 12px; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
    .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h1>C Vidya Solutions</h1>
    <p>The backend application server is synchronizing the latest deployment. Please click the button below to refresh.</p>
    <a href="/" class="btn" onclick="location.reload(); return false;">Refresh Page</a>
  </div>
</body>
</html>`,
            {
              status: 502,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }
          );
        }
      }

      // Return clean response
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("X-Proxy-By", "Cloudflare-CVidya-Gateway");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (fatalError) {
      // Global safety net: NEVER throw uncaught exception to Cloudflare (prevents Error 1101)
      return new Response(
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>C Vidya Solutions</title>
</head>
<body style="font-family:sans-serif;text-align:center;padding:50px;">
  <h2>C Vidya Solutions Gateway</h2>
  <p>Connecting to application server. Please <a href="/" onclick="location.reload();">refresh</a> in a moment.</p>
</body>
</html>`,
        {
          status: 500,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }
  },
};
