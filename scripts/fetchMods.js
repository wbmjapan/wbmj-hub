const fs = require("fs");
const fetch = require("node-fetch");

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const headers = {
  Authorization: `Bot ${TOKEN}`
};

async function fetchMods() {
  try {
    const threadRes = await fetch(
      `https://discord.com/api/v10/channels/${CHANNEL_ID}/threads/active`,
      { headers }
    );

    const threadData = await threadRes.json();

    if (!threadData.threads) {
      console.log("threads取得失敗:", threadData);
      return;
    }

    const threads = threadData.threads;
    console.log("threads数:", threads.length);

    const mods = [];

    for (const thread of threads) {
  try {
    console.log("thread:", thread.name); // ★追加①

    const msgRes = await fetch(
      `https://discord.com/api/v10/channels/${thread.id}/messages`,
      { headers }
    );

    const messages = await msgRes.json();

    console.log(
      "messages数:",
      Array.isArray(messages) ? messages.length : "取得失敗"
    ); // ★追加②

    if (!Array.isArray(messages)) {
      console.log("messages中身:", messages); // ★追加③
      continue;
    }

    if (messages.length === 0) continue;

    // 全attachments確認
    console.log(
      "attachments一覧:",
      messages.map(m => m.attachments)
    ); // ★追加④

    const msg = messages[messages.length - 1]; // ★ここ重要（修正）

    console.log("選ばれたmsg:", msg); // ★追加⑤

    if (!msg.attachments || msg.attachments.length === 0) {
      console.log("attachmentsなし → スキップ"); // ★追加⑥
      continue;
    }

    mods.push({
      name: thread.name,
      author: msg.author?.username || "unknown",
      url: msg.attachments[0].url,
      description: msg.content || ""
    });

  } catch (e) {
    console.log("thread処理エラー:", e);
  }
}

    fs.writeFileSync("mods.json", JSON.stringify(mods, null, 2));
    console.log("mods.json updated:", mods.length);

  } catch (err) {
    console.error("全体エラー:", err);
  }
}

fetchMods();
