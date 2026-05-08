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
    pattern: "restart",
    desc: "Restart the bot",
    category: "main",
    react: "🔄",
    filename: __filename,
    owner: true
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const restartMessage = 
`╭┄┄┄🌸🌹 *RESTART* 🌹🌸┄┄┄⊷
┃ 🔄 Bot is restarting now...
┃ ⏳ Please wait a moment...
┃ 💚 Coming back online soon!
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, 
            { text: restartMessage },
            { quoted: mek }
        );

        setTimeout(() => {
            console.log('🔄 Bot is restarting...');
            process.exit(0);
        }, 2000);

    } catch (e) {
        reply("❌ Error during restart: " + e.message);
    }
});