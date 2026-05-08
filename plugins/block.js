 const { cmd } = require('../command');
const config = require('../config');

const getContextInfo = (m, ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", formattedOwnerNumber = "255628378557") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 BOT OWNER: ${ownerName}`,
            body: `wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

// BLOCK COMMAND
cmd({
    pattern: "block",
    desc: "Blocks a person",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, q, quoted, mentionedJid, sender, isOwner, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        if (!isOwner) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
        }

        let jid;
        if (quoted) {
            jid = quoted.sender;
        } else if (mentionedJid && mentionedJid.length > 0) {
            jid = mentionedJid[0];
        } else if (q && q.includes("@")) {
            jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
        } else {
            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return reply("Please mention a user or reply to their message.\n\n> ® Powered by Tyrex Tech");
        }

        await conn.updateBlockStatus(jid, "block");
        
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });
        
        await conn.sendMessage(from, { 
            text: `✅ Successfully blocked @${jid.split("@")[0]}\n\n> ® Powered by Tyrex Tech`,
            mentions: [jid],
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });
        
    } catch (error) {
        console.error("Block command error:", error);
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });
        reply("Failed to block the user.\n\n> ® Powered by Tyrex Tech");
    }
});

// UNBLOCK COMMAND
cmd({
    pattern: "unblock",
    desc: "Unblocks a person",
    category: "owner",
    react: "🔓",
    filename: __filename
},
async (conn, mek, m, { from, q, quoted, mentionedJid, sender, isOwner, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        if (!isOwner) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
        }

        let jid;
        if (quoted) {
            jid = quoted.sender;
        } else if (mentionedJid && mentionedJid.length > 0) {
            jid = mentionedJid[0];
        } else if (q && q.includes("@")) {
            jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
        } else {
            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key }
            });
            return reply("Please mention a user or reply to their message.\n\n> ® Powered by Tyrex Tech");
        }

        await conn.updateBlockStatus(jid, "unblock");
        
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });
        
        await conn.sendMessage(from, { 
            text: `✅ Successfully unblocked @${jid.split("@")[0]}\n\n> ® Powered by Tyrex Tech`,
            mentions: [jid],
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });
        
    } catch (error) {
        console.error("Unblock command error:", error);
        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });
        reply("Failed to unblock the user.\n\n> ® Powered by Tyrex Tech");
    }
});
