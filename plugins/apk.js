const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐓𝐘𝐑𝐄𝐗"
    }
};

const getContextInfo = (m, ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", formattedOwnerNumber = "255700000000") => {
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
    pattern: "apk2",
    alias: ["app2"],
    react: "📲",
    desc: "Download APK directly",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, sender }) => {
    try {
        if (!q) return await conn.sendMessage(from, { 
            text: "Please provide an app name!\n\nExample: .apk2 whatsapp", 
            contextInfo: getContextInfo({ sender: sender }) 
        }, { quoted: fkontak });

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
        const response = await axios.get(apiUrl);
        const res = response.data;

        if (!res.status || !res.result) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return await conn.sendMessage(from, { 
                text: "*App not found!*\nPlease check the app name and try again.", 
                contextInfo: getContextInfo({ sender: sender }) 
            }, { quoted: fkontak });
        }

        const app = res.result;

        await conn.sendMessage(from, { 
            image: { url: app.icon }, 
            caption: `📦 *${app.name}*\n⚖️ ${app.size}\n\n> © Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

        await conn.sendMessage(from, {
            document: { url: app.dllink },
            mimetype: "application/vnd.android.package-archive",
            fileName: `${app.name}.apk`,
            caption: `✅ Downloaded Successfully\n> © Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("APK Error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await conn.sendMessage(from, { 
            text: "Error fetching APK. Please try again later.", 
            contextInfo: getContextInfo({ sender: sender }) 
        }, { quoted: fkontak });
    }
});
