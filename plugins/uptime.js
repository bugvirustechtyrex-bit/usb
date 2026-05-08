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
    pattern: "uptime",
    desc: "Check how long the bot has been active",
    category: "main",
    react: "⏳",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const uptimeSeconds = process.uptime();

        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);

        const uptimeString = `╭┄┄┄🌸🌹 *UPTIME* 🌹🌸┄┄┄⊷\n┃\n┃ *TYREX MD AI*\n┃\n┃ *${hours}h ${minutes}m ${seconds}s*\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, { 
            text: uptimeString,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("Error fetching uptime.\n\n> ® Powered by Tyrex Tech");
    }
});