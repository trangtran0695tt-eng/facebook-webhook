const express = require("express");
const app = express();
app.use(express.json());

const {
FB_PAGE_ID,
FB_PAGE_TOKEN,
BRIDGE_API_KEY
} = process.env;

function requireKey(req, res, next) {
if (!BRIDGE_API_KEY) return next();
if (req.headers["x-api-key"] !== BRIDGE_API_KEY) {
return res.status(401).json({ ok: false, error: "unauthorized" });
}
  next();
}

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/action/status", (req, res) => {
res.json({
ok: true,
hasPageId: !!FB_PAGE_ID,
hasPageToken: !!FB_PAGE_TOKEN
});
});

app.post("/action/post", requireKey, async (req, res) => {
try {
  const { message } = req.body || {};
if (!message) return res.status(400).json({ ok: false, error: "message is required" });
if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
return res.status(500).json({ ok: false, error: "Missing FB_PAGE_ID or FB_PAGE_TOKEN" });
}

const body = new URLSearchParams({
message,
access_token: FB_PAGE_TOKEN
});

const r = await fetch(`https://graph.facebook.com/v25.0/${FB_PAGE_ID}/feed`, {
method: "POST",
headers: { "Content-Type": "application/x-www-form-urlencoded" },
body
  });

const data = await r.json();
if (!r.ok || data.error) {
return res.status(400).json({ ok: false, error: data?.error?.message || "facebook api error", raw: data });
}

return res.json({ ok: true, result: data });
} catch (e) {
return res.status(500).json({ ok: false, error: e.message });
}
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server started on", port));
