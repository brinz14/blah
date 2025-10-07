import fetch from "node-fetch";

export default async function handler(req, res) {
  const API_URL = "https://aethrabeta.vercel.app/api/recent-redemptions";
  const AUTH_TOKEN = process.env.AETHRA_TOKEN;
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

  try {
    const response = await fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${AUTH_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Format the message
    const message = {
      content: `📦 **Recent Redemptions**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
    };

    await fetch(DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    res.status(200).json({ success: true, message: "Sent to Discord!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
