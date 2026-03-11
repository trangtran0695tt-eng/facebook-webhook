const express = require("express");
const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/action/status", (req, res) => {
res.json({
ok: true,
hasPageId: !!process.env.FB_PAGE_ID,
hasPageToken: !!process.env.FB_PAGE_TOKEN
});
});

app.listen(process.env.PORT || 3000, () => {
console.log("server started");
});
