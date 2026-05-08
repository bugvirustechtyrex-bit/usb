 const { cmd } = require('../command');
const axios = require('axios');

const REPO_IMAGE = 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg';
const REPO_LINK = 'https://github.com/bugvirustechtyrex-bit/Tyrex-MD';

function tyrexMessage(text) {
  return {
    text: text,
    contextInfo: {
      externalAdReply: {
        title: 'TYREX MD',
        body: 'GitHub Repository • Verified',
        thumbnailUrl: REPO_IMAGE,
        sourceUrl: REPO_LINK,
        mediaUrl: REPO_IMAGE,
        renderLargerThumbnail: true,
        mediaType: 1
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363424973782944@newsletter',
        newsletterName: 'TYREX TECH',
        serverMessageId: Math.floor(Math.random() * 1000000)
      },
      isForwarded: true,
      forwardingScore: 999
    }
  };
}

cmd({
    pattern: "repo",
    alias: ["repository", "github"],
    desc: "Get bot repository link",
    category: "main",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        let stars = '⭐';
        let forks = '🔀';
        
        try {
            const response = await axios.get('https://api.github.com/repos/bugvirustechtyrex-bit/Tyrex-MD');
            stars = response.data.stargazers_count || '⭐';
            forks = response.data.forks_count || '🔀';
        } catch (err) {
            console.log('Could not fetch GitHub stats');
        }
        
        const repoMessage = 
`╭┄┄┄🌸🌹 *TYREX MD GITHUB* 🌹🌸┄┄┄⊷
┃ 📦 Repository: TYREX-MD
┃ 👨‍💻 Developer: Tyrex Tech
┃ 🔗 Link: https://github.com/bugvirustechtyrex-bit/Tyrex-MD
┃
┃ ⭐ Stars: ${stars}
┃ 🔀 Forks: ${forks}
┃
┃ 🛠️ Open Source WhatsApp Bot
┃ 💚 Made with ❤️ by Tyrex Tech
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® Powered by Tyrex Tech`;

        const messageData = tyrexMessage(repoMessage);
        
        await conn.sendMessage(from, messageData, { quoted: mek });
        
    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});
