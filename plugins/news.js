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
    pattern: "news",
    desc: "Get the latest news headlines.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const apiKey = "0f2c43ab11324578a7b1709651736382";
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const articles = response.data.articles;

        if (!articles.length) {
            return reply("No news articles found.\n\n> ® Powered by Tyrex Tech");
        }

        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            const article = articles[i];
            let message = `
╭┄┄┄🌸🌹 *NEWS* 🌹🌸┄┄┄⊷
┃
┃ 📌 *${article.title}*
┃
┃ 📝 ${article.description || 'No description available'}
┃
┃ 🔗 ${article.url}
┃
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® Powered by Tyrex Tech
            `;

            console.log('Article Image URL:', article.urlToImage);

            if (article.urlToImage) {
                await conn.sendMessage(from, { 
                    image: { url: article.urlToImage }, 
                    caption: message,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            } else {
                await conn.sendMessage(from, { 
                    text: message,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            }
        }

    } catch (e) {
        console.error("Error fetching news:", e);
        reply("Could not fetch news. Please try again later.\n\n> ® Powered by Tyrex Tech");
    }
});