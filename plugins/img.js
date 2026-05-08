const { cmd } = require("../command");
const axios = require("axios");
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

const UNSPLASH_API_KEY = "TKwNF_gHeB4Z6ieR6sV_Q8gIkQW_VFOcmiNfD0AX0uM";

cmd({
    pattern: "img",
    alias: ["image", "searchimg"],
    react: "🫧",
    desc: "Search images from Unsplash",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { args, from, sender, reply }) => {
    try {
        if (!args.length) return reply("🖼️ Example: .img cute cats 3\n\n> ® Powered by Tyrex Tech");

        let count = parseInt(args[args.length - 1]);
        if (isNaN(count)) count = 3;
        const query = args.slice(0, isNaN(args[args.length - 1]) ? args.length : -1).join(" ");

        await conn.sendMessage(from, { text: `🔍 Searching "${query}"...`, contextInfo: getContextInfo({ sender: sender }) }, { quoted: mek });

        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&client_id=${UNSPLASH_API_KEY}`;
        const { data } = await axios.get(url);

        if (!data.results?.length) return reply("No images found.\n\n> ® Powered by Tyrex Tech");

        const selectedImages = data.results.sort(() => 0.5 - Math.random()).slice(0, count);

        for (const image of selectedImages) {
            await conn.sendMessage(from, {
                image: { url: image.urls.regular },
                caption: `📷 *${query}*\n> ® Powered by Tyrex Tech`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error("Image Error:", error);
        reply("Error fetching images.\n\n> ® Powered by Tyrex Tech");
    }
});
