const { cmd } = require("../command");

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

// Random Boy Selection Command
cmd({
  pattern: "bacha",
  alias: ["larka"],
  desc: "Randomly selects a boy from the group",
  react: "👦",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, from, sender }) => {
  try {
    if (!isGroup) {
      return await conn.sendMessage(from, { 
        text: "This command can only be used in groups!\n\n> ® Powered by Tyrex Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
    
    if (!groupMetadata?.participants) {
      return await conn.sendMessage(from, { 
        text: "Couldn't fetch group members.\n\n> ® Powered by Tyrex Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    const botNumber = conn.user.id;
    const participants = groupMetadata.participants.filter(p => p.id !== botNumber);

    if (participants.length < 1) {
      return await conn.sendMessage(from, { 
        text: "No eligible participants found!\n\n> ® Powered by Tyrex Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    const randomUser = participants[Math.floor(Math.random() * participants.length)];

    await conn.sendMessage(
      from,
      {
        text: `👦 *Here is your Boy!*\n\n@${randomUser.id.split('@')[0]} is your handsome boy! 😎\n\n> ® Powered by Tyrex Tech`,
        mentions: [randomUser.id],
        contextInfo: getContextInfo({ sender: sender })
      },
      { quoted: fkontak }
    );
    
  } catch (error) {
    console.error("Error in .bacha command:", error);
    await conn.sendMessage(from, { 
      text: "An error occurred while selecting a boy.\n\n> ® Powered by Tyrex Tech", 
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
  }
});

// Random Girl Selection Command
cmd({
  pattern: "bachi",
  alias: ["kuri", "larki"],
  desc: "Randomly selects a girl from the group",
  react: "👧",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, from, sender }) => {
  try {
    if (!isGroup) {
      return await conn.sendMessage(from, { 
        text: "This command can only be used in groups!\n\n> ® Powered by Tyrex Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
    
    if (!groupMetadata?.participants) {
      return await conn.sendMessage(from, { 
        text: "Couldn't fetch group members.\n\n> ® Powered by Tyrex Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    const botNumber = conn.user.id;
    const participants = groupMetadata.participants.filter(p => p.id !== botNumber);

    if (participants.length < 1) {
      return await conn.sendMessage(from, { 
        text: "No eligible participants found!\n\n> ® Powered by Tyrex Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    const randomUser = participants[Math.floor(Math.random() * participants.length)];

    await conn.sendMessage(
      from,
      {
        text: `👧 *Here is your Girl!*\n\n@${randomUser.id.split('@')[0]} is your beautiful girl! 💖\n\n> ® Powered by Tyrex Tech`,
        mentions: [randomUser.id],
        contextInfo: getContextInfo({ sender: sender })
      },
      { quoted: fkontak }
    );
    
  } catch (error) {
    console.error("Error in .bachi command:", error);
    await conn.sendMessage(from, { 
      text: "An error occurred while selecting a girl.\n\n> ® Powered by Tyrex Tech", 
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
  }
});
