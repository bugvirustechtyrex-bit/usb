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
  pattern: "send",
  alias: ["sendme", "save"],
  react: "📤",
  desc: "Forwards quoted message back to your DM or current chat",
  category: "utility",
  filename: __filename
}, async (conn, mek, m, { from, sender, quoted, reply }) => {
  try {
    if (!mek.quoted) {
      return reply("*🍁 Please reply to a message (image, video, audio, or doc)!*\n\n> ® Powered by Tyrex Tech");
    }

    const buffer = await mek.quoted.download();
    const mtype = mek.quoted.mtype;
    const caption = mek.quoted.text || "";

    const target = sender; 

    let messageContent = {};

    switch (mtype) {
      case "imageMessage":
        messageContent = { image: buffer, caption };
        break;
      case "videoMessage":
        messageContent = { video: buffer, caption };
        break;
      case "audioMessage":
        messageContent = { 
            audio: buffer, 
            mimetype: mek.quoted.mimetype || "audio/mp4", 
            ptt: mek.quoted.ptt || false 
        };
        break;
      case "stickerMessage":
        messageContent = { sticker: buffer };
        break;
      case "documentMessage":
        messageContent = { 
            document: buffer, 
            mimetype: mek.quoted.mimetype, 
            fileName: mek.quoted.fileName || 'file' 
        };
        break;
      case "conversation":
      case "extendedTextMessage":
        messageContent = { text: mek.quoted.text };
        break;
      default:
        return reply("❌ This message type is not supported yet.\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendMessage(target, {
      ...messageContent,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    if (target === sender && from !== sender) {
        await conn.sendMessage(from, { 
          text: "Sent to your Inbox! ✅\n\n> ® Powered by Tyrex Tech",
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

  } catch (error) {
    console.error("Forward Error:", error);
    reply("❌ Error forwarding message:\n" + error.message + "\n\n> ® Powered by Tyrex Tech");
  }
});