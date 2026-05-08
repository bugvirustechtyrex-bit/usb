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
  pattern: "post",
  alias: ["status", "story"],
  desc: "Post media to WhatsApp status",
  category: "utility",
  filename: __filename
}, async (conn, mek, m, { from, isCreator, sender, quoted, reply }) => {
  try {
    const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";

    if (!isCreator) {
      return reply("*📛 Owner only command*\n\n> ® Powered by Tyrex Tech");
    }

    const quotedMsg = m.quoted || m;

    // 1. Handle Text Status
    if (quotedMsg.text && !quotedMsg.hasMedia) {
      try {
        await conn.setStatus(quotedMsg.text);
        return reply("✅ Text status updated\n\n> ® Powered by Tyrex Tech");
      } catch (e) {
        return reply("❌ Failed to update text status\n\n> ® Powered by Tyrex Tech");
      }
    }

    // 2. Handle Media Status
    if (quotedMsg.hasMedia) {
      try {
        const media = await quotedMsg.download();
        const caption = quotedMsg.caption || "";

        await conn.sendMessage("status@broadcast", { 
          [quotedMsg.type.replace("Message", "")]: media,
          caption: caption
        });

        return reply("✅ Media posted to status\n\n> ® Powered by Tyrex Tech");
      } catch (error) {
        return reply(`❌ Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
      }
    }

    return reply("⚠ Please reply to media or text\n\n> ® Powered by Tyrex Tech");

  } catch (error) {
    console.error("Post command error:", error);
    reply(`❌ Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
  }
});