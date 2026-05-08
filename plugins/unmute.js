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

cmd({
    pattern: "unmute",
    alias: ["tyrexunmute", "unsilent", "loud"],
    react: "🔊",
    desc: "Unmute the group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");

    if (!isAdmins) return reply("You need to be an admin to unmute\n\n> ® Powered by Tyrex Tech");

    await conn.groupSettingUpdate(from, 'not_announcement');

    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *GROUP UNMUTED* 🌹🌸┄┄┄⊷\n┃ ✅ Group mouth opened\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    if (e.message.includes('403') || e.message.includes('permission')) {
        reply("Bot needs to be admin first\n\n> ® Powered by Tyrex Tech");
    } else {
        reply("Command failed\n\n> ® Powered by Tyrex Tech");
    }
    l(e);
}
});