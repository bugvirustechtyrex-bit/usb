const { cmd ,commands } = require('../command');
const { exec } = require('child_process');
const config = require('../config');
const {sleep} = require('../lib/functions')

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "TYREX"
    }
};

const getContextInfo = (m, ownerName = "TYREX 𝐌𝐃", formattedOwnerNumber = "255789661031") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '© TYREX 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁: ${ownerName}`,
            body: `📞 wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

// 1. Shutdown Bot
cmd({
    pattern: "shutdown",
    desc: "Shutdown the bot.",
    category: "owner",
    react: "🛑",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛!\n\n> © Powered by Tyrex Tech", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
    
    await conn.sendMessage(from, { 
        text: "🛑 𝚂𝚑𝚞𝚝𝚝𝚒𝚗𝚐 𝚍𝚘𝚠𝚗...\n\n> © Powered by Sila Tech", 
        contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
    }, { quoted: fkontak });
    
    setTimeout(() => process.exit(), 1000);
});

// 2. Broadcast Message to All Groups
cmd({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛!\n\n> © Powered by Tyrex Tech", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
    
    if (args.length === 0) {
        return await conn.sendMessage(from, { 
            text: "📢 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚘 𝚋𝚛𝚘𝚊𝚍𝚌𝚊𝚜𝚝.\n\n> © Powered by Tyrex Tech", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
    
    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());
    
    for (const groupId of groups) {
        await conn.sendMessage(groupId, { 
            text: `📢 *𝙱𝚁𝙾𝙰𝙳𝙲𝙰𝚂𝚃*\n\n${message}\n\n> © Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
    
    await conn.sendMessage(from, { 
        text: "📢 𝙼𝚎𝚜𝚜𝚊𝚐𝚎 𝚋𝚛𝚘𝚊𝚍𝚌𝚊𝚜𝚝𝚎𝚍 𝚝𝚘 𝚊𝚕𝚕 𝚐𝚛𝚘𝚞𝚙𝚜.\n\n> © Powered by Tyrex Tech", 
        contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
    }, { quoted: fkontak });
});

// 3. Set Profile Picture
cmd({
    pattern: "setme",
    desc: "Set bot profile picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛!\n\n> © Powered by Tyrex Tech", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
    
    if (!quoted || !quoted.message.imageMessage) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎.\n\n> © Powered by Tyrex Tech", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
    
    try {
        const media = await conn.downloadMediaMessage(quoted);
        await conn.updateProfilePicture(conn.user.jid, { url: media });
        
        await conn.sendMessage(from, { 
            text: "🖼️ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝚙𝚒𝚌𝚝𝚞𝚛𝚎 𝚞𝚙𝚍𝚊𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢!\n\n> © Powered by Tyrex Tech", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    } catch (error) {
        await conn.sendMessage(from, { 
            text: `❌ 𝙴𝚛𝚛𝚘𝚛 𝚞𝚙𝚍𝚊𝚝𝚒𝚗𝚐 𝚙𝚛𝚘𝚏𝚒𝚕𝚎 𝚙𝚒𝚌𝚝𝚞𝚛𝚎: ${error.message}\n\n> © Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
});

// 6. Clear All Chats
cmd({
    pattern: "clearchats",
    desc: "Clear all chats from the bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛!\n\n> © Powered by Tyrex Tech", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
    
    try {
        const chats = conn.chats.all();
        for (const chat of chats) {
            await conn.modifyChat(chat.jid, 'delete');
        }
        
        await conn.sendMessage(from, { 
            text: "🧹 𝙰𝚕𝚕 𝚌𝚑𝚊𝚝𝚜 𝚌𝚕𝚎𝚊𝚛𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢!\n\n> © Powered by Tyrex Tech", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    } catch (error) {
        await conn.sendMessage(from, { 
            text: `❌ 𝙴𝚛𝚛𝚘𝚛 𝚌𝚕𝚎𝚊𝚛𝚒𝚗𝚐 𝚌𝚑𝚊𝚝𝚜: ${error.message}\n\n> © Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
});

// 8. Group JIDs List
cmd({
    pattern: "gjid",
    desc: "Get the list of JIDs for all groups the bot is part of.",
    category: "owner",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: "❌ 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛!\n\n> © Powered by Tyrex Tech", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
    
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');
    
    await conn.sendMessage(from, { 
        text: `📝 *𝙶𝚛𝚘𝚞𝚙 𝙹𝙸𝙳𝚜:*\n\n${groupJids}\n\n> © Powered by Tyrex Tech`, 
        contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
    }, { quoted: fkontak });
});

// delete command
cmd({
    pattern: "delete",
    react: "❌",
    alias: ["del"],
    desc: "delete message",
    category: "group",
    use: '.del',
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    const ownerName = "TYREX 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!isOwner || !isAdmins) return;
    
    try {
        if (!m.quoted) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚘 𝚍𝚎𝚕𝚎𝚝𝚎.\n\n> © Powered by Tyrex Tech", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }
        
        const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        };
        
        await conn.sendMessage(m.chat, { delete: key });
        
    } catch(e) {
        console.log(e);
        await conn.sendMessage(from, { 
            text: '✅ 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕..👨‍💻✅\n\n> © Powered by Tyrex Tech', 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: fkontak });
    }
});
