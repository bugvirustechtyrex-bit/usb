const axios = require('axios');
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
    pattern: "truth",
    desc: "Get a random truth question",
    react: "🤔",
    category: "fun",
    use: '.truth',
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const { data } = await axios.get('https://apis.davidcyriltech.my.id/truth');

        if (!data.success) {
            return reply("Couldn't get a truth question. Try again!\n\n> ® Powered by Tyrex Tech");
        }

        const message = `🔍 *Truth Question* 🔍\n\n"${data.question}"\n\n_Be honest!_\n\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, { 
            text: message,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error('Truth Error:', error);
        reply("Can't handle the truth right now. Try again later!\n\n> ® Powered by Tyrex Tech");
    }
});