const { cmd } = require("../command");
const axios = require('axios');

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

const processedMessages = new Set();

cmd(
  {
    pattern: "apk",
    alias: ["playstore", "modapk", "app"],
    desc: "Search and download APK files from Play Store",
    category: "download",
    react: "📱",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, sender }) => {
    try {
      if (processedMessages.has(m.key.id)) return;
      processedMessages.add(m.key.id);
      setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

      if (!q) {
        return await conn.sendMessage(from, { 
          text: "👉 *𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊𝚙𝚙 𝚗𝚊𝚖𝚎*\n\n𝙴𝚡𝚊𝚖𝚙𝚕𝚎: *.apk whatsapp*\n.playstore facebook\n.modapk spotify\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      await conn.sendMessage(from, { react: { text: "🔍", key: m.key } });

      // Search APK
      const searchResponse = await axios.get(`https://api.bk9.dev/search/apk?q=${encodeURIComponent(q)}`);
      const apps = searchResponse.data?.data || searchResponse.data?.results;

      if (!apps || apps.length === 0) {
        await conn.sendMessage(from, { 
          text: "❌ *𝙽𝚘 𝚊𝚙𝚙𝚜 𝚏𝚘𝚞𝚗𝚍.* 𝚃𝚛𝚢 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚜𝚎𝚊𝚛𝚌𝚑 𝚝𝚎𝚛𝚖.\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        return;
      }

      const app = apps[0];
      const appId = app.package || app.id;

      if (appId) {
        // Download APK
        const downloadResponse = await axios.get(`https://api.bk9.dev/download/apk?id=${encodeURIComponent(appId)}`);
        const downloadUrl = downloadResponse.data?.url || downloadResponse.data?.downloadUrl;

        if (downloadUrl) {
          await conn.sendMessage(from, {
            document: { url: downloadUrl },
            fileName: `${app.name || q}.apk`,
            mimetype: 'application/vnd.android.package-archive',
            caption: `📱 *${app.name || q}*\n\n📦 *Package:* ${appId}\n🔄 *Version:* ${app.version || 'N/A'}\n📊 *Size:* ${app.size || 'N/A'}\n\n✨ *𝙰𝙿𝙺 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛 𝚋𝚢 𝚂𝙸𝙻𝙰 𝙼𝙳*\n\n> © Powered by Sila Tech`,
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: fkontak });
          
          await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
        } else {
          await conn.sendMessage(from, { 
            text: `📱 *𝙰𝚙𝚙 𝙵𝚘𝚞𝚗𝚍:* ${app.name}\n\n📦 *Package:* ${appId}\n🔄 *Version:* ${app.version || 'N/A'}\n📊 *Size:* ${app.size || 'N/A'}\n\n❌ *𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚕𝚒𝚗𝚔 𝚗𝚘𝚝 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎*\n\n> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
          }, { quoted: fkontak });
          await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        }
      } else {
        await conn.sendMessage(from, { 
          text: "❌ *𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚐𝚎𝚝 𝚊𝚙𝚙 𝚍𝚎𝚝𝚊𝚒𝚕𝚜*\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
      }

    } catch (e) {
      console.error(e);
      await conn.sendMessage(from, { 
        text: `⚠️ *𝙴𝚛𝚛𝚘𝚛:* ${e.message}\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
      await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
  }
);
