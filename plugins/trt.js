const { cmd } = require('../command');
const fetch = require('node-fetch');

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
    pattern: "trt",
    alias: ["translate", "trans"],
    react: "🌐",
    desc: "Translate text to any language.",
    category: "tools",
    use: ".trt fr Hello, how are you?",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) {
            return reply("⚙️ *SYSTEM:* Missing input.\n\n*Usage:* .trt <lang_code> <text>\n*Example:* .trt fr Hello\n\n> ® Powered by Tyrex Tech");
        }

        const args = q.split(" ");
        const targetLang = args[0]; 
        const textToTranslate = args.slice(1).join(" ");

        if (!textToTranslate) {
            return reply("❌ *ERROR:* Please provide the text you want to translate.\n\n> ® Powered by Tyrex Tech");
        }

        const { key } = await conn.sendMessage(from, { 
            text: "🔄 *TRANSLATING:* Processing request...",
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        const apiUrl = `https://apis.davidcyriltech.my.id/tools/translate?text=${encodeURIComponent(textToTranslate)}&to=${targetLang}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.success) {
            return await conn.sendMessage(from, { 
                text: "❌ *FATAL ERROR:* Translation service unavailable.\n\n> ® Powered by Tyrex Tech", 
                edit: key,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        let resultMsg = `╭┄┄┄🌸🌹 *TRANSLATE CORE* 🌹🌸┄┄┄⊷\n┃\n┃ 🌐 *FROM:* Auto-Detect\n┃ 🎯 *TO:* ${targetLang.toUpperCase()}\n┃\n┃ 📝 *RESULT:*\n┃ ${data.result}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, { 
            text: resultMsg, 
            edit: key,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ *SYSTEM ERROR:* ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
});