const { cmd } = require('../command');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

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
    pattern: "vv",
    alias: ["viewonce", "reveal"],
    desc: "Reveal view-once image or video",
    category: "tools",
    react: "👁️",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return reply("❌ Reply to a *view-once image or video*.\n\n> ® Powered by Tyrex Tech");
        }

        const viewOnceMsg = quoted.viewOnceMessageV2 || quoted.viewOnceMessage || null;

        const mediaMessage = viewOnceMsg?.message?.imageMessage ||
            viewOnceMsg?.message?.videoMessage ||
            quoted.imageMessage ||
            quoted.videoMessage;

        if (!mediaMessage) {
            return reply("❌ Unsupported message type.\n\n> ® Powered by Tyrex Tech");
        }

        const isImage = !!mediaMessage.imageMessage || mediaMessage.mimetype?.startsWith("image");
        const isVideo = !!mediaMessage.videoMessage || mediaMessage.mimetype?.startsWith("video");

        if (!mediaMessage.viewOnce) {
            return reply("❌ This is not a view-once media.\n\n> ® Powered by Tyrex Tech");
        }

        const reactionEmojis = ['🔥','⚡','🚀','💨','🎯','🎉','🌟','💥','👁️'];
        const reactEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

        await conn.sendMessage(from, {
            react: { text: reactEmoji, key: mek.key }
        });

        const stream = await downloadContentFromMessage(
            mediaMessage,
            isImage ? "image" : "video"
        );

        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        await conn.sendMessage(from, {
            [isImage ? "image" : "video"]: buffer,
            caption: mediaMessage.caption || '',
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (err) {
        console.error("VV Command Error:", err);
        reply("❌ Failed to reveal view-once media.\n\n> ® Powered by Tyrex Tech");
    }
});