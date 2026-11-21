/**
 * captmate.com on Cloudflare: the site is served as static assets; this script only runs for requests
 * that are not a file of the site:
 *   /download/CaptMate-beta.apk  -> counts the download (D1) and serves the newest APK named in download/latest.txt
 *   www.captmate.com             -> redirects to captmate.com
 */
export default {
  async fetch(req, env, ctx) {
    const u = new URL(req.url);
    if (u.hostname === "www.captmate.com") return Response.redirect("https://captmate.com" + u.pathname + u.search, 301);
    if (u.pathname === "/download/CaptMate-beta.apk" || u.pathname === "/download" || u.pathname === "/download/") {
      const name = (await (await env.ASSETS.fetch(new URL("/download/latest.txt", u))).text()).trim();
      const apk = await env.ASSETS.fetch(new URL("/download/" + name, u));
      if (!apk.ok) return new Response("Download not available", { status: 503 });
      if (req.method === "GET") ctx.waitUntil(env.DB.prepare("INSERT INTO downloads (t, file, country, ua) VALUES (?, ?, ?, ?)")
        .bind(Date.now(), name, (req.cf && req.cf.country) || "", (req.headers.get("User-Agent") || "").slice(0, 120)).run().catch(() => {}));
      return new Response(apk.body, { headers: {
        "Content-Type": "application/vnd.android.package-archive",
        ...(apk.headers.get("Content-Length") ? { "Content-Length": apk.headers.get("Content-Length") } : {}),
        "Content-Disposition": 'attachment; filename="' + name + '"',
        "Cache-Control": "no-store",
      } });
    }
    return env.ASSETS.fetch(req);
  },
};
