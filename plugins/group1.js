 const { cmd } = require('../command');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// ============ KICKALL COMMAND ============
cmd({
    pattern: "kickall",
    alias: ["removeall", "deleteall"],
    react: "👢",
    desc: "Remove all members from group (except admins)",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, isBotAdmins, participants, groupAdmins, botNumber, reply}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");
    
    if (!isAdmins) return reply("You need to be an admin to use this command\n\n> ® Powered by Tyrex Tech");
    
    await conn.sendMessage(from, {
        text: "⏳ Removing all members...",
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    const membersToRemove = participants
        .filter(p => !groupAdmins.includes(p.id) && p.id !== botNumber)
        .map(p => p.id);
    
    if (membersToRemove.length === 0) {
        return reply("No members to remove\n\n> ® Powered by Tyrex Tech");
    }
    
    let removed = 0;
    for (let i = 0; i < membersToRemove.length; i += 5) {
        const batch = membersToRemove.slice(i, i + 5);
        await conn.groupParticipantsUpdate(from, batch, 'remove');
        removed += batch.length;
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *KICKALL COMPLETE* 🌹🌸┄┄┄⊷\n┃ ✅ Successfully removed ${removed} members\n┃ 👥 Remaining: ${participants.length - removed} (admins only)\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log('KICKALL ERROR:', e);
    reply(`Failed to remove members: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

// ============ REJECTALL COMMAND ============
cmd({
    pattern: "rejectall",
    alias: ["rejectpending", "rejectrequests"],
    react: "❌",
    desc: "Reject all pending join requests",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, isBotAdmins, reply}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");
    
    if (!isAdmins) return reply("You need to be an admin to use this command\n\n> ® Powered by Tyrex Tech");
    
    await conn.sendMessage(from, {
        text: "⏳ Fetching pending join requests...",
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
        return reply("No pending join requests\n\n> ® Powered by Tyrex Tech");
    }
    
    let rejected = 0;
    for (const request of requests) {
        if (request.requestMethod === 'invite') {
            await conn.groupRequestParticipantsUpdate(from, [request.jid], 'reject');
            rejected++;
        }
    }
    
    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *REJECTALL COMPLETE* 🌹🌸┄┄┄⊷\n┃ ✅ Rejected ${rejected} pending requests\n┃ 📋 Total requests: ${requests.length}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log('REJECTALL ERROR:', e);
    reply(`Failed to reject requests: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

// ============ RGPP COMMAND ============
cmd({
    pattern: "rgpp",
    alias: ["resetpp", "removepp", "delpp"],
    react: "🖼️",
    desc: "Remove group profile picture",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, reply}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");
    
    if (!isAdmins) return reply("You need to be an admin to use this command\n\n> ® Powered by Tyrex Tech");
    
    await conn.sendMessage(from, {
        text: "⏳ Removing group profile picture...",
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    try {
        const ppUrl = await conn.profilePictureUrl(from, 'image').catch(() => null);
        
        if (!ppUrl) {
            return reply("Group doesn't have a profile picture\n\n> ® Powered by Tyrex Tech");
        }
        
        await conn.removeProfilePicture(from);
        
        await conn.sendMessage(from, {
            text: `╭┄┄┄🌸🌹 *RGPP COMPLETE* 🌹🌸┄┄┄⊷\n┃ ✅ Group profile picture has been removed\n┃ 🖼️ Group now has default picture\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } catch (ppError) {
        console.log('Profile picture error:', ppError);
        reply("Could not remove picture. Make sure bot has permissions.\n\n> ® Powered by Tyrex Tech");
    }

} catch (e) {
    console.log('RGPP ERROR:', e);
    reply(`Failed to remove group picture. Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

// ============ CREATEGC COMMAND ============
cmd({
    pattern: "creategc",
    alias: ["creategroup", "newgc", "makegroup"],
    react: "✨",
    desc: "Create a new group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, pushname, reply, args}) => {
try{
    if (!args[0]) return reply("Please provide group name\n\nExample: .creategc Group Name\n\n> ® Powered by Tyrex Tech");
    
    const groupName = args.join(' ');
    
    await conn.sendMessage(from, {
        text: `⏳ Creating group "${groupName}"...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    try {
        const group = await conn.groupCreate(groupName, [sender]);
        const groupId = group.gid || group.id;
        
        if (!groupId) {
            throw new Error('Could not get group ID');
        }
        
        await conn.groupParticipantsUpdate(groupId, [sender], 'promote');
        const code = await conn.groupInviteCode(groupId);
        
        await conn.sendMessage(from, {
            text: `╭┄┄┄🌸🌹 *GROUP CREATED* 🌹🌸┄┄┄⊷\n┃ ✅ Group created successfully\n┃ 📌 *Name:* ${groupName}\n┃ 🔗 *Link:* https://chat.whatsapp.com/${code}\n┃ 👑 *You are now admin*\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
        await conn.sendMessage(groupId, {
            text: `╭┄┄┄🌸🌹 *WELCOME* 🌹🌸┄┄┄⊷\n┃ 📌 *Group:* ${groupName}\n┃ 👑 *Admin:* @${sender.split('@')[0]}\n┃ 🤖 Bot is ready to help!\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
            mentions: [sender],
            contextInfo: getContextInfo({ sender: sender })
        });
        
    } catch (createError) {
        console.log('Group creation error:', createError);
        
        if (createError.message.includes('bad-request')) {
            return reply("Failed to create group. Possible reasons:\n• Invalid group name\n• WhatsApp limit reached\n• Account restricted\n\nTry again with a different name or check your account status.\n\n> ® Powered by Tyrex Tech");
        } else {
            throw createError;
        }
    }

} catch (e) {
    console.log('CREATEGC ERROR:', e);
    reply(`Failed to create group: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

// ============ JOIN COMMAND ============
cmd({
    pattern: "join",
    alias: ["joingroup", "joinlink"],
    react: "🔗",
    desc: "Join a group via invite link",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, reply, args}) => {
try{
    if (!args[0]) return reply("Please provide group link\n\nExample: .join https://chat.whatsapp.com/xxxxxx\n\n> ® Powered by Tyrex Tech");
    
    const link = args[0];
    let code = link.split('https://chat.whatsapp.com/')[1] || link;
    
    if (!code) return reply("Invalid group link\n\n> ® Powered by Tyrex Tech");
    
    await conn.sendMessage(from, {
        text: "⏳ Joining group...",
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    const groupId = await conn.groupAcceptInvite(code);
    const groupMetadata = await conn.groupMetadata(groupId);
    
    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *JOIN SUCCESSFUL* 🌹🌸┄┄┄⊷\n┃ ✅ Bot has joined the group\n┃ 📌 *Group:* ${groupMetadata.subject}\n┃ 👥 *Members:* ${groupMetadata.participants.length}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    await conn.sendMessage(groupId, {
        text: `╭┄┄┄🌸🌹 *BOT JOINED* 🌹🌸┄┄┄⊷\n┃ 🤖 Hello! I'm TYREX MD Bot\n┃ 📌 Type .menu to see my commands\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    });

} catch (e) {
    console.log('JOIN ERROR:', e);
    reply(`Failed to join group: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

// ============ LEFT COMMAND ============
cmd({
    pattern: "left",
    alias: ["leave", "exit", "leavegc"],
    react: "👋",
    desc: "Bot leaves the group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, reply}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");
    
    if (!isAdmins) return reply("You need to be an admin to use this command\n\n> ® Powered by Tyrex Tech");
    
    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *BOT LEAVING* 🌹🌸┄┄┄⊷\n┃ 👋 Goodbye! Bot is leaving the group\n┃ ⚡ Thanks for using TYREX MD\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    setTimeout(async () => {
        await conn.groupLeave(from);
    }, 2000);

} catch (e) {
    console.log('LEFT ERROR:', e);
    reply(`Failed to leave group: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

// ============ KICK COMMAND ============
cmd({
    pattern: "kick",
    alias: ["remove", "ban"],
    react: "👢",
    desc: "Remove members from group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, isGroup, sender, isAdmins, isBotAdmins, participants, groupAdmins, botNumber, args, reply}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");
    
    if (!isAdmins) return reply("You need to be an admin to kick members\n\n> ® Powered by Tyrex Tech");
    
    let usersToKick = [];
    
    if (m.quoted && m.quoted.sender) {
        usersToKick.push(m.quoted.sender);
    }
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        usersToKick = m.mentionedJid;
    }
    else if (args && args[0]) {
        let input = args[0].replace(/[^0-9]/g, '');
        if (input.length >= 10) {
            let number = input + '@s.whatsapp.net';
            usersToKick.push(number);
        } else {
            return reply("Please provide a valid number or tag the user\n\nExample: .kick @user\nOr reply to user's message with .kick\n\n> ® Powered by Tyrex Tech");
        }
    } else {
        return reply("Please tag the user or reply to their message\n\nExample: .kick @user\n\n> ® Powered by Tyrex Tech");
    }
    
    usersToKick = usersToKick.filter(user => 
        !groupAdmins.includes(user) && user !== botNumber
    );
    
    if (usersToKick.length === 0) {
        return reply("Cannot kick admins or bot\n\n> ® Powered by Tyrex Tech");
    }
    
    await conn.sendMessage(from, {
        text: `⏳ Kicking ${usersToKick.length} user(s)...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    for (let user of usersToKick) {
        try {
            await conn.groupParticipantsUpdate(from, [user], 'remove');
        } catch (kickError) {
            console.log(`Error kicking ${user}:`, kickError);
        }
    }
    
    let mentions = [];
    let mentionText = '';
    
    for (let user of usersToKick) {
        mentions.push(user);
        let username = '@' + user.split('@')[0];
        mentionText += username + ' ';
    }
    
    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *KICKED SUCCESSFULLY* 🌹🌸┄┄┄⊷\n┃ 👢 *Kicked:* ${mentionText}\n┃ ✅ ${usersToKick.length} user(s) removed from group\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log('KICK ERROR:', e);
    reply(`Failed to kick user(s): ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});
