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
    pattern: "getdp",
    desc: "Get profile picture of a user or group",
    category: "tools",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, isGroup, reply, sender }) => {
    try {
        let target;
        if (m.mentionedJid && m.mentionedJid[0]) {
            target = m.mentionedJid[0];
        } else if (m.msg.contextInfo && m.msg.contextInfo.participant) {
            target = m.msg.contextInfo.participant;
        } else {
            target = from;
        }

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch (e) {
            return reply("I couldn't fetch the profile picture. It might be private or not set.\n\n> ® Powered by Tyrex Tech");
        }

        await conn.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: `🖼️ *Profile Picture of:* @${target.split('@')[0]}\n\n> ® Powered by Tyrex Tech`,
            mentions: [target],
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("Error fetching profile picture.\n\n> ® Powered by Tyrex Tech");
    }
});
