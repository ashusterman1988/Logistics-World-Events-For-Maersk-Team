module.exports = async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.json({ status: "ERROR", reason: "No API key found" });

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 50,
        messages: [{ role: "user", content: "Say OK" }],
      }),
    });
    const json = await upstream.json();
    return res.json({ status: upstream.status, body: json });
  } catch (e) {
    return res.json({ status: "ERROR", reason: String(e) });
  }
};
