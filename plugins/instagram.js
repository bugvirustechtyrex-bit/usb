 const { cmd } = require("../command");
const { igdl } = require("ruhend-scraper");
const config = require("../config");

const processedMessages = new Set();

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
    pattern: "instagram",
    alias: ["ig2", "igdl", "instalink"],
    desc: "Download Instagram video or image",
    category: "downloader",
    react: "📎",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        if (processedMessages.has(m.key.id)) return;
        processedMessages.add(m.key.id);
        setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

        const text = q?.trim() || m.message?.conversation || m.message?.extendedTextMessage?.text;

        if (!text) {
            return reply(`╭┄┄┄🌸🌹 *INSTAGRAM LINK MISSING* 🌹🌸┄┄┄⊷\n┃\n┃ Please provide a valid Instagram video link.\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
        }

        const instagramPatterns = [
            /https?:\/\/(?:www\.)?instagram\.com\//,
            /https?:\/\/(?:www\.)?instagr\.am\//,
            /https?:\/\/(?:www\.)?instagram\.com\/p\//,
            /https?:\/\/(?:www\.)?instagram\.com\/reel\//,
            /https?:\/\/(?:www\.)?instagram\.com\/tv\//
        ];

        const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));

        if (!isValidUrl) {
            return reply(`╭┄┄┄🌸🌹 *INVALID LINK* 🌹🌸┄┄┄⊷\n┃\n┃ That is not a valid Instagram post, reel, or TV link.\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
        }

        await conn.sendMessage(from, { react: { text: '🔄', key: m.key } });

        const downloadData = await igdl(text);

        if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
            return reply(`╭┄┄┄🌸🌹 *NO MEDIA FOUND* 🌹🌸┄┄┄⊷\n┃\n┃ There was no media at the provided link.\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
        }

        const mediaData = downloadData.data;
        for (let i = 0; i < Math.min(20, mediaData.length); i++) {
            const media = mediaData[i];
            const mediaUrl = media.url;

            const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) ||
                            media.type === 'video' ||
                            text.includes('/reel/') ||
                            text.includes('/tv/');

            if (isVideo) {
                await conn.sendMessage(from, {
                    video: { url: mediaUrl },
                    mimetype: "video/mp4",
                    caption: `╭┄┄┄🌸🌹 *INSTA VIDEO DOWNLOADED* 🌹🌸┄┄┄⊷\n┃\n┃ Source: Instagram.com\n┃ Status: ✅ Complete\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                    contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
                }, { quoted: mek });
            } else {
                await conn.sendMessage(from, {
                    image: { url: mediaUrl },
                    caption: `╭┄┄┄🌸🌹 *INSTA IMAGE DOWNLOADED* 🌹🌸┄┄┄⊷\n┃\n┃ Source: Instagram.com\n┃ Status: ✅ Complete\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                    contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
                }, { quoted: mek });
            }
        }

    } catch (error) {
        console.error('Error in Instagram command:', error);
        reply(`╭┄┄┄🌸🌹 *ERROR OCCURRED* 🌹🌸┄┄┄⊷\n┃\n┃ Something went wrong while processing the link.\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
    }
});
