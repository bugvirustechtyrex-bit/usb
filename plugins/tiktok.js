const { cmd } = require("../command");
const axios = require("axios");

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
    pattern: "tiktok",
    alias: ["tt", "tiktokdl", "tiktokvideo"],
    desc: "Download TikTok videos without watermark",
    category: "download",
    react: "🎵",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, sender, args, reply }) => {
    try {
      if (processedMessages.has(m.key.id)) return;
      processedMessages.add(m.key.id);
      setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

      if (!q) {
        return reply("*Please provide a TikTok video link*\n\n*Example:* .tiktok https://www.tiktok.com/@user/video/123456789\n\n> ® Powered by Tyrex Tech");
      }

      await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

      let quality = "no_watermark";
      let url = q;

      const parts = q.split(' ');
      if (parts.length > 1) {
        const possibleQuality = parts[0].toLowerCase();
        if (possibleQuality === 'hd' || possibleQuality === 'nowm' || 
            possibleQuality === 'wm' || possibleQuality === 'audio') {
          quality = possibleQuality === 'nowm' ? 'no_watermark' : possibleQuality;
          url = parts.slice(1).join(' ');
        }
      }

      const tiktokUrl = url.trim();

      if (!tiktokUrl.includes('tiktok.com')) {
        return reply("*Invalid TikTok URL*\n\nPlease provide a valid TikTok video link.\n\n> ® Powered by Tyrex Tech");
      }

      const apiUrl = `https://api.bk9.dev/download/tiktok3?url=${encodeURIComponent(tiktokUrl)}`;
      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.status) {
        return reply(`*Failed to fetch video*\n\nReason: ${response.data?.message || 'Invalid URL or video not found'}\n\n> ® Powered by Tyrex Tech`);
      }

      const tiktokData = response.data.BK9;

      let selectedFormat = null;
      let qualityDisplay = "";

      switch(quality) {
        case 'hd':
          selectedFormat = tiktokData.formats.find(f => f.quality === 'hd_no_watermark');
          qualityDisplay = "HD (No Watermark)";
          break;
        case 'no_watermark':
        case 'nowm':
          selectedFormat = tiktokData.formats.find(f => f.quality === 'no_watermark');
          qualityDisplay = "No Watermark";
          break;
        case 'wm':
        case 'watermark':
          selectedFormat = tiktokData.formats.find(f => f.quality === 'watermark');
          qualityDisplay = "With Watermark";
          break;
        case 'audio':
          selectedFormat = tiktokData.formats.find(f => f.type === 'audio');
          qualityDisplay = "Audio Only";
          break;
        default:
          selectedFormat = tiktokData.formats[1] || tiktokData.formats[0];
          qualityDisplay = "No Watermark";
      }

      if (!selectedFormat) {
        selectedFormat = tiktokData.formats[0];
        qualityDisplay = "Default";
      }

      const caption = `
🎵 *TikTok Downloader*

📌 *Title:* ${tiktokData.title || 'N/A'}
👤 *Author:* ${tiktokData.author || 'N/A'}
⏱️ *Duration:* ${tiktokData.duration || 'N/A'}
🎚️ *Quality:* ${qualityDisplay}

⬇️ *Downloading...*

> ® Powered by Tyrex Tech
      `;

      if (tiktokData.thumbnail) {
        await conn.sendMessage(from, {
          image: { url: tiktokData.thumbnail },
          caption: caption,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
      } else {
        await conn.sendMessage(from, { 
          text: caption,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
      }

      if (selectedFormat.type === 'audio') {
        await conn.sendMessage(from, {
          audio: { url: selectedFormat.url },
          mimetype: "audio/mpeg",
          fileName: `tiktok_audio_${Date.now()}.mp3`,
          caption: `✅ *Audio downloaded successfully*\n\n> ® Powered by Tyrex Tech`,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
      } else {
        await conn.sendMessage(from, {
          video: { url: selectedFormat.url },
          caption: `✅ *Video downloaded successfully*\n\n🎚️ *Quality:* ${qualityDisplay}\n\n> ® Powered by Tyrex Tech`,
          mimetype: "video/mp4",
          fileName: `tiktok_${Date.now()}.mp4`,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
      }

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
      console.error("TikTok Download Error:", e);

      let errorMessage = e.message;
      if (e.response?.status === 404) {
        errorMessage = "Video not found. Make sure the URL is correct and the video is public.";
      } else if (e.code === 'ECONNREFUSED') {
        errorMessage = "Connection to API server failed.";
      }

      reply(`*Error:* ${errorMessage}\n\n*Example:* .tiktok https://www.tiktok.com/@user/video/123456789\n\n> ® Powered by Tyrex Tech`);
    }
  }
);