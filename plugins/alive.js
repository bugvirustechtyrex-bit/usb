const { cmd } = require('../command');
const config = require('../config');
const os = require('os');
const moment = require('moment-timezone');

// fakevCard ya bot yako
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 𝐁𝐎𝐓\nORG:𝐓𝐘𝐑𝐄𝐗-𝐓𝐄𝐂𝐇;\nTEL;type=CELL;type=VOICE;waid=255700000000:+255700000000\nEND:VCARD`
    }
  }
};

const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const h = Math.floor(seconds / 3600);
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};

cmd({
    pattern: "alive",
    desc: "Angalia kama bot iko hai",
    category: "main",
    react: "💚",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, pushName }) => {
    try {
        const uptime = formatUptime(process.uptime());
        const timeZone = 'Africa/Dar_es_Salaam';
        const time = moment.tz(timeZone).format('hh:mm:ss A');
        const date = moment.tz(timeZone).format('DD/MM/YYYY');
        const mode = config.MODE === 'public' ? 'PUBLIC' : 'PRIVATE';
        const prefix = config.PREFIX || '.';
        
        const aliveMessage = 
`┏━❑ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 𝐁𝐎𝐓 ━━━━━━━━━
┃ ✅ Hali: IKO HAI
┃ 👤 Mtumiaji: ${pushName || sender.split('@')[0]}
┃ 🚀 Modhi: ${mode}
┃ 🔧 Kiambishi: ${prefix}
┃ ⏱️ Muda wa kufanya kazi: ${uptime}
┃ 📅 Tarehe: ${date}
┃ 🕐 Saa: ${time}
┃ 💚 Afya ya Bot: 100%
┗━━━━━━━━━━━━━━━━━━━━`;
        
        // Unaweza kubadilisha hii URL na picha yako unayotaka
        const imageUrl = 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg';
        
        try {
            await conn.sendMessage(from, 
                { 
                    image: { url: imageUrl },
                    caption: aliveMessage
                },
                { quoted: fakevCard }
            );
        } catch (imageError) {
            console.log("Image error, sending text only:", imageError);
            await conn.sendMessage(from, 
                { text: aliveMessage },
                { quoted: fakevCard }
            );
        }
        
    } catch (e) {
        reply("❌ Hitilafu: " + e.message);
    }
});
