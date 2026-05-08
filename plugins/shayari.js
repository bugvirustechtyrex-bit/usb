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
    pattern: "shayari",
    alias: ["shayar", "poetry"],
    desc: "Get a random romantic shayari",
    react: "💫",
    category: "fun",
    use: '.shayari',
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const apiUrl = 'https://shizoapi.onrender.com/api/texts/shayari?apikey=shizo';

        const { data } = await axios.get(apiUrl);

        if (!data.result) {
            return reply("Shayari dil mein nahi aayi, phir try karo!\n\n> ® Powered by Tyrex Tech");
        }

        const shayariMessage = `💫 *Shayari* 💫\n\n${data.result}\n\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, { 
            text: shayariMessage,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error('Shayari Error:', error);
        reply("Aaj dil mein shayari nahi hai... Kal try karna!\n\n> ® Powered by Tyrex Tech");
    }
});