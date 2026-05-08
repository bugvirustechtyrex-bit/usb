 const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

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

//=============================================
//  ADMIN EVENTS
//=============================================
cmd({
    pattern: "admin-events",
    alias: ["adminevents"],
    desc: "Enable or disable admin event notifications",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ADMIN_EVENTS = "true";
        return reply("Admin event notifications are now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (status === "off") {
        config.ADMIN_EVENTS = "false";
        return reply("Admin event notifications are now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.ADMIN_EVENTS === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *ADMIN EVENTS* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .admin-events on  - Enable\n┃ ➸ .admin-events off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  WELCOME
//=============================================
cmd({
    pattern: "welcome",
    alias: ["welcomeset"],
    desc: "Enable or disable welcome messages for new members",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.WELCOME = "true";
        return reply("Welcome messages are now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (status === "off") {
        config.WELCOME = "false";
        return reply("Welcome messages are now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.WELCOME === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *WELCOME* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .welcome on  - Enable\n┃ ➸ .welcome off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  SET PREFIX
//=============================================
cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    const newPrefix = args[0];
    if (!newPrefix) {
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *SET PREFIX* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Current Prefix:* ${config.PREFIX}\n┃\n┃ *Usage:* .setprefix [new_prefix]\n┃ *Example:* .setprefix !\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    config.PREFIX = newPrefix;
    reply(`Prefix successfully changed to *${newPrefix}*\n\n> ® Powered by Tyrex Tech`);
});

//=============================================
//  SET MODE
//=============================================
cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    if (!args[0]) {
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *BOT MODE* 🌹🌸┄┄┄⊷\n┃\n┃ 📌 *Current Mode:* *${config.MODE}*\n┃\n┃ *Usage:*\n┃ ➸ .mode private\n┃ ➸ .mode public\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

    const modeArg = args[0].toLowerCase();

    if (modeArg === "private") {
        config.MODE = "private";
        return reply("Bot mode is now set to *PRIVATE*.\n\n> ® Powered by Tyrex Tech");
    } else if (modeArg === "public") {
        config.MODE = "public";
        return reply("Bot mode is now set to *PUBLIC*.\n\n> ® Powered by Tyrex Tech");
    } else {
        return reply("Invalid mode. Please use `.mode private` or `.mode public`.\n\n> ® Powered by Tyrex Tech");
    }
});

//=============================================
//  AUTO-TYPING
//=============================================
cmd({
    pattern: "auto-typing",
    description: "Enable or disable auto-typing feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.AUTO_TYPING = "true";
        return reply("Auto typing has been turned ON.\n\n> ® Powered by Tyrex Tech");
    } else if (status === "off") {
        config.AUTO_TYPING = "false";
        return reply("Auto typing has been turned OFF.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.AUTO_TYPING === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *AUTO-TYPING* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .auto-typing on  - Enable\n┃ ➸ .auto-typing off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  MENTION REPLY
//=============================================
cmd({
    pattern: "mention-reply",
    alias: ["menetionreply", "mee"],
    description: "Enable or disable mention reply feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    const status = args[0]?.toLowerCase();
    
    if (args[0] === "on") {
        config.MENTION_REPLY = "true";
        return reply("Mention Reply feature is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
        config.MENTION_REPLY = "false";
        return reply("Mention Reply feature is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.MENTION_REPLY === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *MENTION REPLY* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .mee on  - Enable\n┃ ➸ .mee off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  ALWAYS ONLINE
//=============================================
cmd({
    pattern: "always-online",
    alias: ["alwaysonline"],
    desc: "Enable or disable the always online mode",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.ALWAYS_ONLINE = "true";
        return reply("Always online mode is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (status === "off") {
        config.ALWAYS_ONLINE = "false";
        return reply("Always online mode is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.ALWAYS_ONLINE === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *ALWAYS ONLINE* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .always-online on  - Enable\n┃ ➸ .always-online off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  AUTO RECORDING
//=============================================
cmd({
    pattern: "auto-recording",
    alias: ["autorecoding"],
    description: "Enable or disable auto-recording feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    const status = args[0]?.toLowerCase();
    
    if (status === "on") {
        config.AUTO_RECORDING = "true";
        await conn.sendPresenceUpdate("recording", from);
        return reply("Auto recording is now enabled. Bot is recording...\n\n> ® Powered by Tyrex Tech");
    } else if (status === "off") {
        config.AUTO_RECORDING = "false";
        await conn.sendPresenceUpdate("available", from);
        return reply("Auto recording has been disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.AUTO_RECORDING === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *AUTO RECORDING* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .auto-recording on  - Enable\n┃ ➸ .auto-recording off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  AUTO SEEN (STATUS)
//=============================================
cmd({
    pattern: "auto-seen",
    alias: ["autostatusview"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_SEEN = "true";
        return reply("Auto-viewing of statuses is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_SEEN = "false";
        return reply("Auto-viewing of statuses is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.AUTO_STATUS_SEEN === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *AUTO SEEN* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .auto-seen on  - Enable\n┃ ➸ .auto-seen off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  STATUS REACT
//=============================================
cmd({
    pattern: "status-react",
    alias: ["statusreaction"],
    desc: "Enable or disable auto-liking of statuses",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_REACT = "true";
        return reply("Auto-liking of statuses is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REACT = "false";
        return reply("Auto-liking of statuses is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.AUTO_STATUS_REACT === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *STATUS REACT* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .status-react on  - Enable\n┃ ➸ .status-react off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  READ MESSAGE
//=============================================
cmd({
    pattern: "read-message",
    alias: ["autoread"],
    desc: "enable or disable readmessage.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    if (args[0] === "on") {
        config.READ_MESSAGE = "true";
        return reply("Read message feature is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
        config.READ_MESSAGE = "false";
        return reply("Read message feature is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.READ_MESSAGE === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *READ MESSAGE* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .read-message on  - Enable\n┃ ➸ .read-message off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  ANTI-BAD
//=============================================
cmd({
    pattern: "anti-bad",
    alias: ["antibadword"],
    desc: "enable or disable antibad.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    if (args[0] === "on") {
        config.ANTI_BAD_WORD = "true";
        return reply("Anti bad word is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
        config.ANTI_BAD_WORD = "false";
        return reply("Anti bad word feature is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.ANTI_BAD_WORD === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *ANTI-BAD* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .anti-bad on  - Enable\n┃ ➸ .anti-bad off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  AUTO-STICKER
//=============================================
cmd({
    pattern: "auto-sticker",
    alias: ["autosticker"],
    desc: "enable or disable auto-sticker.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    if (args[0] === "on") {
        config.AUTO_STICKER = "true";
        return reply("Auto-sticker feature is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
        config.AUTO_STICKER = "false";
        return reply("Auto-sticker feature is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.AUTO_STICKER === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *AUTO-STICKER* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .auto-sticker on  - Enable\n┃ ➸ .auto-sticker off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  AUTO-REPLY
//=============================================
cmd({
    pattern: "auto-reply",
    alias: ["autoreply"],
    desc: "enable or disable auto-reply.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    if (args[0] === "on") {
        config.AUTO_REPLY = "true";
        return reply("Auto-reply is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
        config.AUTO_REPLY = "false";
        return reply("Auto-reply feature is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.AUTO_REPLY === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *AUTO-REPLY* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .auto-reply on  - Enable\n┃ ➸ .auto-reply off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  AUTO-REACT
//=============================================
cmd({
    pattern: "auto-react1",
    alias: ["autoreact1"],
    desc: "Enable or disable the autoreact feature",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    if (args[0] === "on") {
        config.AUTO_REACT = "true";
        return reply("Autoreact feature is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
        config.AUTO_REACT = "false";
        return reply("Autoreact feature is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.AUTO_REACT === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *AUTO-REACT* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .auto-react1 on  - Enable\n┃ ➸ .auto-react1 off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  STATUS-REPLY
//=============================================
cmd({
    pattern: "status-reply",
    alias: ["autostatusreply"],
    desc: "enable or disable status-reply.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply, sender }) => {
    if (!isCreator) {
        return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
    }

    if (args[0] === "on") {
        config.AUTO_STATUS_REPLY = "true";
        return reply("Status-reply feature is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REPLY = "false";
        return reply("Status-reply feature is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
        const currentStatus = config.AUTO_STATUS_REPLY === "true" ? "Enabled ✅" : "Disabled ❌";
        return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *STATUS-REPLY* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .status-reply on  - Enable\n┃ ➸ .status-reply off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
});

//=============================================
//  ANTILINK
//=============================================
cmd({
  pattern: "antilink",
  alias: ["antilinks"],
  desc: "Enable or disable ANTI_LINK in groups",
  category: "group",
  react: "🚫",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply, from, sender }) => {
  try {
    if (!isGroup) return reply("This command can only be used in a group.\n\n> ® Powered by Tyrex Tech");
    if (!isBotAdmins) return reply("Bot must be an admin to use this command.\n\n> ® Powered by Tyrex Tech");
    if (!isAdmins) return reply("You must be an admin to use this command.\n\n> ® Powered by Tyrex Tech");

    if (args[0] === "on") {
      config.ANTI_LINK = "true";
      return reply("ANTI_LINK has been enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
      config.ANTI_LINK = "false";
      return reply("ANTI_LINK has been disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
      const currentStatus = config.ANTI_LINK === "true" ? "Enabled ✅" : "Disabled ❌";
      return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *ANTILINK* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .antilink on  - Enable\n┃ ➸ .antilink off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
  } catch (e) {
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
  }
});

//=============================================
//  ANTILINK KICK
//=============================================
cmd({
  pattern: "antilinkkick",
  alias: ["kicklink"],
  desc: "Enable or disable ANTI_LINK_KICK in groups",
  category: "group",
  react: "⚠️",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply, from, sender }) => {
  try {
    if (!isGroup) return reply("This command can only be used in a group.\n\n> ® Powered by Tyrex Tech");
    if (!isBotAdmins) return reply("Bot must be an admin to use this command.\n\n> ® Powered by Tyrex Tech");
    if (!isAdmins) return reply("You must be an admin to use this command.\n\n> ® Powered by Tyrex Tech");

    if (args[0] === "on") {
      config.ANTI_LINK_KICK = "true";
      return reply("ANTI_LINK_KICK has been enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
      config.ANTI_LINK_KICK = "false";
      return reply("ANTI_LINK_KICK has been disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
      const currentStatus = config.ANTI_LINK_KICK === "true" ? "Enabled ✅" : "Disabled ❌";
      return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *ANTILINK KICK* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .antilinkkick on  - Enable\n┃ ➸ .antilinkkick off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
  } catch (e) {
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
  }
});

//=============================================
//  DELETE LINKS
//=============================================
cmd({
  pattern: "deletelink",
  alias: ["linksdelete"],
  desc: "Enable or disable DELETE_LINKS in groups",
  category: "group",
  react: "❌",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, reply, from, sender }) => {
  try {
    if (!isGroup) return reply("This command can only be used in a group.\n\n> ® Powered by Tyrex Tech");
    if (!isBotAdmins) return reply("Bot must be an admin to use this command.\n\n> ® Powered by Tyrex Tech");
    if (!isAdmins) return reply("You must be an admin to use this command.\n\n> ® Powered by Tyrex Tech");

    if (args[0] === "on") {
      config.DELETE_LINKS = "true";
      return reply("DELETE_LINKS is now enabled.\n\n> ® Powered by Tyrex Tech");
    } else if (args[0] === "off") {
      config.DELETE_LINKS = "false";
      return reply("DELETE_LINKS is now disabled.\n\n> ® Powered by Tyrex Tech");
    } else {
      const currentStatus = config.DELETE_LINKS === "true" ? "Enabled ✅" : "Disabled ❌";
      return await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *DELETE LINKS* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .deletelink on  - Enable\n┃ ➸ .deletelink off - Disable\n┃\n┃ 💡 *Current:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
  } catch (e) {
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
  }
});
