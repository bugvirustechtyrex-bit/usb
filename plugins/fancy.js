 const axios = require("axios");
const { cmd } = require("../command");

const getContextInfo = (m, ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", formattedOwnerNumber = "255628378557") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 BOT OWNER: ${ownerName}`,
            body: `wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "✍️",
  desc: "Convert text into various fonts.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, q, reply, sender }) => {
  try {
    const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!q) {
      return reply("Please provide text to convert into fancy fonts.\n\n*Example:* .fancy Hello\n\n> ® Powered by Tyrex Tech");
    }

    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);
    
    if (!response.data.status) {
      return reply("Error fetching fonts. Please try again later.\n\n> ® Powered by Tyrex Tech");
    }

    const fonts = response.data.result.map(item => `*${item.name}:*\n${item.result}`).join("\n\n");
    const resultText = `╭┄┄┄🌸🌹 *FANCY FONTS* 🌹🌸┄┄┄⊷\n┃\n${fonts}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

    await conn.sendMessage(from, { 
      text: resultText,
      contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
    }, { quoted: mek });
    
  } catch (error) {
    console.error("Error in fancy command:", error);
    reply("An error occurred while fetching fonts.\n\n> ® Powered by Tyrex Tech");
  }
});
