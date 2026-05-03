const fs = require("fs");
const fetch = require("node-fetch");

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

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
      .filter(m => m.attachments && m.attachments.length > 0)
      .map(m => ({
        name: m.content.split("\n")[0] || "No Name",
        author: m.author.username,
        url: m.attachments[0].url,
        description: m.content || ""
      }));

    fs.writeFileSync("mods.json", JSON.stringify(mods, null, 2));

    console.log("mods数:", mods.length);

  } catch (err) {
    console.error("エラー:", err);
  }
}

fetchMods();
