const fs = require("fs");
const fetch = require("node-fetch");

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

function parseModInfo(text) {
  const lines = text.split("\n");

  const data = {};

  for (const line of lines) {
    const [key, ...rest] = line.split("=");
    if (!key || rest.length === 0) continue;

    data[key.trim()] = rest.join("=").trim();
  }

  return data;
}

async function fetchMods() {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=50`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      }
    );

    const messages = await res.json();

    if (!Array.isArray(messages)) {
      console.log("取得失敗:", messages);
      return;
    }

    console.log("メッセージ数:", messages.length);

    const mods = messages
  .map(m => {
    const info = parseModInfo(m.content); // ★ここで使う

    // 必須チェック（ここ重要）
    if (!info.name || !info.author) return null;

    return {
      name: info.name,
      author: info.author,
      version: info.version || "",
      description: info.description || "",
      url:
        m.attachments?.[0]?.url ||
        m.embeds?.[0]?.url ||
        ""
    };
  })
  .filter(Boolean); // null除外
    
    fs.writeFileSync("mods.json", JSON.stringify(mods, null, 2));

    console.log("mods数:", mods.length);

  } catch (err) {
    console.error("エラー:", err);
  }
}

fetchMods();
