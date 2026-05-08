const fetch = require("node-fetch");
const { cmd } = require("../command");

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

cmd({
  pattern: "tiktoksearch",
  alias: ["tiktoks", "tiks"],
  desc: "Search for TikTok videos using a query.",
  react: '✅',
  category: 'tools',
  filename: __filename
}, async (conn, m, store, {
  from,
  args,
  reply,
  sender
}) => {
  try {
    if (!args[0]) {
      return reply("🌸 What do you want to search on TikTok?\n\n*Usage Example:*\n.tiktoksearch <query>\n\n> ® Powered by Tyrex Tech");
    }

    const query = args.join(" ");

    await conn.sendMessage(from, { 
      text: `🔎 Searching TikTok for: *${query}*`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: m });

    const response = await fetch(`https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      return reply("No results found for your query. Please try with a different keyword.\n\n> ® Powered by Tyrex Tech");
    }

    const results = data.data.slice(0, 7).sort(() => Math.random() - 0.5);

    for (const video of results) {
      const message = `╭┄┄┄🌸🌹 *TIKTOK RESULT* 🌹🌸┄┄┄⊷\n┃\n┃ *• Title*: ${video.title}\n┃ *• Author*: ${video.author || 'Unknown'}\n┃ *• Duration*: ${video.duration || "Unknown"}\n┃ *• URL*: ${video.link}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

      if (video.nowm) {
        await conn.sendMessage(from, {
          video: { url: video.nowm },
          caption: message,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: m });
      } else {
        await conn.sendMessage(from, { 
          text: `Failed to retrieve video for *"${video.title}"*.\n\n> ® Powered by Tyrex Tech`, 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: m });
      }
    }

  } catch (error) {
    console.error("Error in TikTokSearch command:", error);
    reply("An error occurred while searching TikTok. Please try again later.\n\n> ® Powered by Tyrex Tech");
  }
});