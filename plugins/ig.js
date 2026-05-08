 const { cmd } = require("../command");
const { igdl } = require("ruhend-scraper");

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

const processedMessages = new Set();

cmd(
  {
    pattern: "ig",
    alias: ["insta", "instagram", "reels"],
    desc: "Download Instagram Media",
    category: "download",
    react: "📸",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, sender, reply }) => {
    try {
      if (processedMessages.has(m.key.id)) return;
      processedMessages.add(m.key.id);
      setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

      if (!q) {
        return reply("Please provide an Instagram link.\n\n> ® Powered by Tyrex Tech");
      }

      await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

      const downloadData = await igdl(q);
      
      if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
        return reply("No media found. Make sure the link is public.\n\n> ® Powered by Tyrex Tech");
      }

      const uniqueMedia = [];
      const seenUrls = new Set();
      for (const media of downloadData.data) {
        if (media.url && !seenUrls.has(media.url)) {
          seenUrls.add(media.url);
          uniqueMedia.push(media);
        }
      }

      for (let i = 0; i < uniqueMedia.length; i++) {
        const media = uniqueMedia[i];
        
        const isVideo = 
          /\.(mp4|mov|avi|mkv|webm)/i.test(media.url) || 
          media.type === 'video' || 
          q.includes('/reel/') || 
          q.includes('/tv/');

        if (isVideo) {
          await conn.sendMessage(from, {
            video: { url: media.url },
            caption: `✨ *IG Downloader by TYREX MD*\n\n✅ Video [${i + 1}/${uniqueMedia.length}]\n\n> ® Powered by Tyrex Tech`,
            mimetype: "video/mp4",
            fileName: `tyrex_md_${Date.now()}.mp4`,
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: mek });
        } else {
          await conn.sendMessage(from, {
            image: { url: media.url },
            caption: `✨ *IG Downloader by TYREX MD*\n\n✅ Image [${i + 1}/${uniqueMedia.length}]\n\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: mek });
        }

        if (uniqueMedia.length > 1) await new Promise(r => setTimeout(r, 1500));
      }

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
      console.error(e);
      reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    }
  }
);
