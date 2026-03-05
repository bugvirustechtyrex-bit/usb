const { cmd } = require("../command");
const axios = require("axios");

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
    alias: ["app", "downloadapk", "androidapp"],
    desc: "Download APK files from Google Play Store",
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
          text: "👉 *𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊𝚗 𝚊𝚙𝚙 𝙸𝙳*\n\n*Example:* .apk com.whatsapp\n*Example:* .apk com.instagram.android\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

      // Clean the input - remove any extra spaces or URLs
      const packageName = q.trim().replace(/https?:\/\/play\.google\.com\/store\/apps\/details\?id=/, '');
      
      // API request
      const apiUrl = `https://api.bk9.dev/download/apk?id=${encodeURIComponent(packageName)}`;
      const response = await axios.get(apiUrl);
      
      if (!response.data || !response.data.status) {
        return await conn.sendMessage(from, { 
          text: `❌ *𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚏𝚎𝚝𝚌𝚑 𝚊𝚙𝚙*\n\n𝚁𝚎𝚊𝚜𝚘𝚗: ${response.data?.message || 'Invalid package name or app not found'}\n\n> © Powered by Sila Tech`, 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      const appData = response.data.data;
      
      // Check if download URL exists
      if (!appData.download) {
        return await conn.sendMessage(from, { 
          text: "❌ *𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚄𝚁𝙻 𝚗𝚘𝚝 𝚏𝚘𝚞𝚗𝚍*\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // Prepare app info message
      const appInfo = `
📱 *𝙰𝙿𝙺 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛*

*𝙰𝚙𝚙 𝙽𝚊𝚖𝚎:* ${appData.name || 'N/A'}
*𝙿𝚊𝚌𝚔𝚊𝚐𝚎:* ${appData.packageName || packageName}
*𝚅𝚎𝚛𝚜𝚒𝚘𝚗:* ${appData.version || 'N/A'}
*𝚂𝚒𝚣𝚎:* ${appData.size || 'Unknown'}
*𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛:* ${appData.developer || 'N/A'}

⬇️ *𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐...*

> © Powered by Sila Tech
      `;

      // Send app info with thumbnail if available
      if (appData.icon) {
        await conn.sendMessage(from, {
          image: { url: appData.icon },
          caption: appInfo,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      } else {
        await conn.sendMessage(from, { 
          text: appInfo,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // Send the APK file
      await conn.sendMessage(from, {
        document: { url: appData.download },
        mimetype: "application/vnd.android.package-archive",
        fileName: `${appData.name || 'app'}_${appData.version || 'latest'}.apk`,
        caption: `✅ *${appData.name || 'App'} downloaded successfully*\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
      console.error("APK Download Error:", e);
      
      // Handle specific error cases
      let errorMessage = e.message;
      if (e.response?.status === 404) {
        errorMessage = "App not found. Make sure the package name is correct.";
      } else if (e.code === 'ECONNREFUSED') {
        errorMessage = "Connection to API server failed.";
      }

      await conn.sendMessage(from, { 
        text: `⚠️ *𝙴𝚛𝚛𝚘𝚛:* ${errorMessage}\n\n*Example:* .apk com.whatsapp\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
  }
);
