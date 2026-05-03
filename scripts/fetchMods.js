console.log("threads:", threads.length);

for (const thread of threads) {
  console.log("thread:", thread.name);

  const msgRes = await fetch(
    `https://discord.com/api/v10/channels/${thread.id}/messages`,
    { headers }
  );

  const messages = await msgRes.json();

  console.log("messages:", messages.length);

  if (!messages || messages.length === 0) continue;

  console.log("first message:", messages[0]);

  const firstMsg = messages[0];

  console.log("attachments:", firstMsg.attachments);

  if (!firstMsg.attachments || firstMsg.attachments.length === 0) continue;
}
