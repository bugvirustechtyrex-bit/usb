const fs = require('fs');
const config = require('../config');
const { cmd } = require('../command');

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
    pattern: "setpp",
    desc: "Change bot profile picture",
    category: "owner",
    react: "❤️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwner, sender }) => {
    try {
        if (!isOwner) {
            return reply("*This command is only available to the bot owner.*\n\n> ® Powered by Tyrex Tech");
        }

        const quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null;
        if (!quoted) {
            return reply("Please reply to an image.\n\n> ® Powered by Tyrex Tech");
        }

        const mime = quoted.imageMessage ? 'image/jpeg' : null;
        if (!mime) {
            return reply("Please reply to an **image** only.\n\n> ® Powered by Tyrex Tech");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const buffer = await m.quoted.download();

        await conn.updateProfilePicture(conn.user.id, buffer);

        await conn.sendMessage(from, {
            text: "✅ *Profile picture updated successfully!*\n\n> ® Powered by Tyrex Tech",
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (err) {
        console.error("Error updating DP:", err);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply(`Error: ${err.message}\n\n> ® Powered by Tyrex Tech`);
    }
});