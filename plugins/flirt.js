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
    pattern: "flirt",
    alias: ["line"],
    desc: "Get a random flirty message",
    react: "😘",
    category: "fun",
    use: '.flirt',
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const apiUrl = 'https://shizoapi.onrender.com/api/texts/flirt?apikey=shizo';
        
        const { data } = await axios.get(apiUrl);
        
        if (!data.result) {
            return reply("Couldn't fetch a flirty message. Try again later!\n\n> ® Powered by Tyrex Tech");
        }
        
        const flirtMessage = `${data.result}

> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, { 
            text: flirtMessage,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } catch (error) {
        console.error('Flirt Error:', error);
        reply("Failed to fetch a flirty message. Maybe try being romantic yourself?\n\n> ® Powered by Tyrex Tech");
    }
});
