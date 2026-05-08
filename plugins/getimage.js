 const { cmd } = require('../command');
const axios = require('axios');

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
    pattern: "getimage",
    alias: ["tophoto","url2image","urltoimage", "imagefromurl", "fetchimage"],
    desc: "Convert image URL to WhatsApp image",
    category: "media",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { from, reply, text, sender }) => {
    try {
        if (!text) {
            return reply("Please provide an image URL\nExample: .getimage https://example.com/image.jpg\n\n> ® Powered by Tyrex Tech");
        }

        const imageUrl = text.trim();

        if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
            return reply("Invalid image URL! Must be direct link to image (jpg/png/gif/webp)\n\n> ® Powered by Tyrex Tech");
        }

        try {
            const response = await axios.head(imageUrl);
            if (!response.headers['content-type']?.startsWith('image/')) {
                return reply("URL does not point to a valid image\n\n> ® Powered by Tyrex Tech");
            }
        } catch (e) {
            return reply("Could not access image URL. Please check the link\n\n> ® Powered by Tyrex Tech");
        }

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: "Here is your image from the URL\n\n> ® Powered by Tyrex Tech",
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error('GetImage Error:', error);
        reply(`Failed to process image. Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
});
