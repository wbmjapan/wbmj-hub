const fs = require("fs");
const fetch = require("node-fetch");

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const headers = {
  Authorization: `Bot ${TOKEN}`
};

async function fetchMods() {
  // ① スレッド一覧取得
  const threadRes = await fetch(
    `https://discord.com/api/v10/channels/${CHANNEL_ID}/threads/active`,
    { headers }
  );

  const threadData = await threadRes.json();
  const threads = threadData.threads || [];

  const mods = [];

  // ② 各スレッド処理
  for (const thread of threads) {
    const msgRes = await fetch(
      `https://discord.com/api/v10/channels/${thread.id}/messages`,
      { headers }
    );

    const messages = await msgRes.json();

    if (!messages || messages.length === 0) continue;

    const firstMsg = messages[0];

    if (!firstMsg.attachments || firstMsg.attachments.length === 0) continue;

    mods.push({
      name: thread.name,
      author: firstMsg.author.username,
      url: firstMsg.attachments[0].url,
      description: firstMsg.content || ""
    });
  }

  fs.writeFileSync("mods.json", JSON.stringify(mods, null, 2));
  console.log("mods.json updated:", mods.length);
}

fetchMods().catch(console.error);
