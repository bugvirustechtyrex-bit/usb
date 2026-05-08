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
    pattern: "motivate",
    alias: ["motivation", "inspire"],
    desc: "Get a random motivational quote",
    react: "💪",
    category: "fun",
    use: '.motivate',
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const apiUrl = 'https://apis.davidcyriltech.my.id/random/quotes';

        const { data } = await axios.get(apiUrl);

        if (!data.success || !data.response) {
            return reply("Couldn't fetch a quote at the moment. Try again later!\n\n> ® Powered by Tyrex Tech");
        }

        const quoteMessage = `
✨ *MOTIVATIONAL QUOTE* ✨

"${data.response.quote}"

— ${data.response.author}

> ® Powered by Tyrex Tech
`;

        await conn.sendMessage(from, { 
            text: quoteMessage,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error('Motivation Error:', error);
        reply("Failed to fetch a motivational quote. Please try again later.\n\n> ® Powered by Tyrex Tech");
    }
});