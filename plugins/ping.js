const { cmd } = require('../command');

cmd({
    pattern: "ping",
    alias: ["p"],
    desc: "Check bot speed",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();

        const initialMsg = await conn.sendMessage(from, 
            { text: "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃..." },
            { quoted: mek }
        );

        const end = Date.now();
        const latency = end - start;

        const text = 
`╭┄┄┄🌸🌹 *PONG* 🌹🌸┄┄┄⊷
┃ ⚡ ${latency} ms
┃ 🚀 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 𝐁𝐎𝐓
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, {
            text: text,
            edit: initialMsg.key,
            contextInfo: {
                externalAdReply: {
                    title: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
                    body: '𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚃𝚢𝚛𝚎𝚡 𝚃𝚎𝚌𝚑',
                    thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg',
                    sourceUrl: 'https://github.com/bugvirustechtyrex-bit/Tyrex-MD',
                    mediaType: 1
                }
            }
        });

    } catch (e) {
        console.log("Ping Error:", e);
        reply("❌ Error during ping");
    }
});