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

cmd({
    pattern: "xx",
    alias: ["delete", "del", "remove"],
    react: "🗑️",
    desc: "Delete quoted message and command message (Owner only)",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, quoted, isOwner, sender, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        if (!isOwner) {
            return reply("This is an owner-only command\n\n> ® Powered by Tyrex Tech");
        }
        
        if (!quoted) {
            return reply("Please reply to the message you want to delete\n\n> ® Powered by Tyrex Tech");
        }

        let successCount = 0;

        // Delete command message
        try {
            await conn.sendMessage(from, {
                delete: {
                    id: mek.key.id,
                    remoteJid: from,
                    fromMe: true
                }
            });
            successCount++;
        } catch (e) {
            console.log('Command delete failed:', e.message);
        }

        // Delete quoted message if from bot
        if (quoted.key.fromMe) {
            try {
                await conn.sendMessage(from, {
                    delete: {
                        id: quoted.key.id,
                        remoteJid: from,
                        fromMe: true
                    }
                });
                successCount++;
            } catch (e) {
                console.log('Quoted delete failed:', e.message);
            }
        } else {
            // If quoted message not from bot, edit it
            try {
                await conn.sendMessage(from, {
                    text: "🗑️ Message cleared by admin",
                    edit: quoted.key
                });
                successCount++;
            } catch (editError) {
                console.log('Edit method failed:', editError.message);
            }
        }

        // Send temporary feedback
        if (successCount > 0) {
            const feedback = await conn.sendMessage(from, { 
                text: `🗑️ Cleared ${successCount} message(s)`, 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: mek });
            
            setTimeout(async () => {
                try {
                    await conn.sendMessage(from, {
                        delete: {
                            id: feedback.key.id,
                            remoteJid: from,
                            fromMe: true
                        }
                    });
                } catch (e) {}
            }, 1500);
        } else {
            reply("No messages could be cleared\n\n> ® Powered by Tyrex Tech");
        }

    } catch (error) {
        console.error('Delete command error:', error);
        reply("Failed to process delete command\n\n> ® Powered by Tyrex Tech");
    }
});
