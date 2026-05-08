const { cmd } = require("../command");
const fetch = require("node-fetch");
const axios = require("axios");

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
    pattern: "tiny",
    alias: ['url', 'shorturl'],
    react: "🫧",
    desc: "Makes URL tiny.",
    category: "convert",
    use: "<url>",
    filename: __filename,
},
async (conn, mek, m, { from, quoted, isOwner, isAdmins, reply, args, sender }) => {
    try {
        if (!args[0]) {
            return reply("*🏷️ Please provide me a link.*\n\n> ® Powered by Tyrex Tech");
        }

        const link = args[0];
        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${link}`);
        const shortenedUrl = response.data;

        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *SHORTENED URL* 🌹🌸┄┄┄⊷\n┃\n┃ *YOUR SHORTENED URL*\n┃ ${shortenedUrl}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (e) {
        console.error("Error shortening URL:", e);
        reply("An error occurred while shortening the URL. Please try again.\n\n> ® Powered by Tyrex Tech");
    }
});