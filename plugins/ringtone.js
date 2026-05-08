const axios = require("axios");
const { cmd } = require("../command");
const config = require('../config');

const getContextInfo = (m, ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", formattedOwnerNumber = "255628378557") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 BOT OWNER: ${ownerName}`,
            body: `wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

cmd({
    pattern: "ringtone",
    alias: ["ringtones", "ring"],
    desc: "Get a random ringtone",
    react: "🎵",
    category: "fun",
    filename: __filename,
},
async (conn, mek, m, { from, args, sender, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("Example: .ringtone Suna\n\n> ® Powered by Tyrex Tech");
        }

        const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(query)}`);

        if (!data.status || !data.result?.length) {
            return reply("No ringtones found.\n\n> ® Powered by Tyrex Tech");
        }

        const randomRingtone = data.result[Math.floor(Math.random() * data.result.length)];

        await conn.sendMessage(from, {
            audio: { url: randomRingtone.dl_link },
            mimetype: "audio/mpeg",
            fileName: `${randomRingtone.title}.mp3`,
            caption: `🎵 *${randomRingtone.title}*\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error("Ringtone Error:", error);
        reply("Error fetching ringtone.\n\n> ® Powered by Tyrex Tech");
    }
});