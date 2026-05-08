const { cmd } = require("../command");
const axios = require("axios");

// FakevCard ya TYREX MD
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
    pattern: "apk",
    alias: ["app", "downloadapk", "androidapp", "tyrexapk"],
    desc: "Search and download APK files",
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
          text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ 📱 *APK DOWNLOADER*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ 👉 *Please provide an app name*\n┃\n┃ 📝 *Example:*\n┃ *.apk whatsapp*\n┃ *.apk instagram*\n┃ *.apk capcut*\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      await conn.sendMessage(from, { react: { text: "🔍", key: m.key } });

      // Search for apps using G-Tech API
      const searchQuery = q.trim();
      const apiUrl = `https://gtech-api-xtp1.onrender.com/api/androidapk?query=${encodeURIComponent(searchQuery)}&apikey=APIKEY`;
      
      const response = await axios.get(apiUrl);
      
      if (!response.data || !response.data.status) {
        return await conn.sendMessage(from, { 
          text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *Failed to search apps*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ Reason: ${response.data?.message || 'No results found'}\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      const searchResults = response.data.result.data;
      
      if (!searchResults || searchResults.length === 0) {
        return await conn.sendMessage(from, { 
          text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *No apps found for* "${searchQuery}"\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ Please try a different search term.\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // If multiple results found, show selection menu
      if (searchResults.length > 1) {
        let menuText = `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ 🔍 *Search Results for* "${searchQuery}"\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n`;
        
        searchResults.slice(0, 5).forEach((app, index) => {
          menuText += `┃ *${index + 1}.* ${app.judul}\n`;
          menuText += `┃   👤 ${app.dev || 'Unknown'}\n`;
          menuText += `┃   ⭐ ${app.rating || 'N/A'}\n`;
          menuText += `┃   🔗 Reply with *${index + 1}* to select\n┃\n`;
        });
        
        menuText += `┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`;

        // Store results temporarily for selection
        global.apkSearchResults = global.apkSearchResults || {};
        global.apkSearchResults[sender] = {
          results: searchResults,
          timestamp: Date.now()
        };

        return await conn.sendMessage(from, {
          image: { url: searchResults[0].thumb || 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg' },
          caption: menuText,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // If only one result, download directly
      await downloadAndSendApp(conn, from, sender, m, searchResults[0]);

    } catch (e) {
      console.error("APK Search Error:", e);
      
      await conn.sendMessage(from, { 
        text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ⚠️ *Error:* ${e.message}\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ Please try again later.\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
  }
);

// Helper function to download and send app
async function downloadAndSendApp(conn, from, sender, m, appData) {
  try {
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    // Get download URL from the app page
    const downloadApiUrl = `https://gtech-api-xtp1.onrender.com/api/apkdata?url=${encodeURIComponent(appData.link)}&apikey=APIKEY`;
    
    const downloadResponse = await axios.get(downloadApiUrl);
    
    if (!downloadResponse.data || !downloadResponse.data.status) {
      throw new Error('Could not fetch download link');
    }

    const downloadData = downloadResponse.data.result;
    const downloadUrl = downloadData.download || downloadData.url || appData.link;

    // Prepare app info
    const appInfo = `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ 📱 *APK DOWNLOADER*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ *App:* ${appData.judul}\n┃ *Developer:* ${appData.dev || 'Unknown'}\n┃ *Rating:* ⭐ ${appData.rating || 'N/A'}\n┃ *Size:* ${downloadData.size || 'Unknown'}\n┃\n┃ ⬇️ *Downloading...*\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`;

    // Send app info with thumbnail
    await conn.sendMessage(from, {
      image: { url: appData.thumb || 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg' },
      caption: appInfo,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

    // Send the APK file
    await conn.sendMessage(from, {
      document: { url: downloadUrl },
      mimetype: "application/vnd.android.package-archive",
      fileName: `${appData.judul.replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
      caption: `✅ *${appData.judul} downloaded successfully*\n\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error("Download Error:", e);
    throw e;
  }
}

// Handle app selection via number
cmd({
  pattern: "select",
  alias: ["sel"],
  desc: "Select app from search results",
  category: "download",
  react: "🔢",
  filename: __filename,
  dontAddCommand: true
}, async (conn, mek, m, { from, q, sender }) => {
  try {
    if (!global.apkSearchResults || !global.apkSearchResults[sender]) {
      return await conn.sendMessage(from, { 
        text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *No active search found*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ Please search for an app first using .apk\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    const searchData = global.apkSearchResults[sender];
    
    // Check if search expired (5 minutes)
    if (Date.now() - searchData.timestamp > 5 * 60 * 1000) {
      delete global.apkSearchResults[sender];
      return await conn.sendMessage(from, { 
        text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *Search expired*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ Please search again using .apk\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    // Handle direct number reply
    const selection = q ? parseInt(q) : parseInt(m.message.conversation || m.message.extendedTextMessage?.text);
    
    if (isNaN(selection) || selection < 1 || selection > searchData.results.length) {
      return await conn.sendMessage(from, { 
        text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *Invalid selection*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ Please choose 1-${searchData.results.length}\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    const selectedApp = searchData.results[selection - 1];
    
    // Clear stored search
    delete global.apkSearchResults[sender];
    
    // Download selected app
    await downloadAndSendApp(conn, from, sender, m, selectedApp);

  } catch (e) {
    console.error("Selection Error:", e);
    await conn.sendMessage(from, { 
      text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ⚠️ *Error:* ${e.message}\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
  }
});
