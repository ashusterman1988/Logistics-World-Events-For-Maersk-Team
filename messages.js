// Serverless proxy for Logistics Pulse.
// Purpose: keep your Anthropic API key on the server, never in the browser.
// The frontend calls /api/messages, and this function forwards the request to
// Anthropic with your secret key attached, then returns the response.
//
// Works out of the box on Vercel (file lives at /api/messages.js).
// Requires one environment variable on the host: ANTHROPIC_API_KEY

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on the server." });
    return;
  }

  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body,
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("content-type", "application/json");
    res.send(text);
  } catch (e) {
    res.status(502).json({ error: "Proxy request failed", detail: String(e) });
  }
}
