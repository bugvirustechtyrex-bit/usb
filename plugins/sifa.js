const { cmd, commands } = require('../command');
const config = require('../config');

cmd({
    pattern: "sifa",
    alias: ["profile", "whois", "mimi"],
    desc: "Onyesha profile/sifa ya mtumiaji",
    category: "main",
    react: "👤",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushName, reply, isGroup, groupMetadata }) => {
    try {
        const prefix = config.PREFIX || '.';
        
        // Angalia kama kuna mtu aliyetagwa
        let target = sender;
        let targetName = pushName || "Unknown";
        let mentionedJid = [sender];
        let isSelf = true;
        
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
            targetName = "@" + target.split('@')[0];
            mentionedJid = [sender, target];
            isSelf = false;
        }
        
        // Pata info ya group (kama ni group)
        let groupInfo = '';
        let isAdmin = false;
        let isOwner = false;
        let groupName = '';
        
        if (isGroup && groupMetadata) {
            const groupAdmins = groupMetadata.participants
                .filter(p => p.admin)
                .map(p => p.id);
            const groupOwner = groupMetadata.owner || '';
            
            isAdmin = groupAdmins.includes(target);
            isOwner = groupOwner === target;
            groupName = groupMetadata.subject || 'Unknown';
            
            groupInfo = `
┃👥 *GROUP:* ${groupName}
┃👑 *ADMIN:* ${isAdmin ? '√' : '×'}
┃🌟 *OWNER:* ${isOwner ? '√' : '×'}`;
        }
        
        // Pata number ya commands zote
        const totalCommands = commands.filter(a => a.pattern).length;
        
        // Build response
        const sifaText = `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷
┃
┃📋 *PROFILE INFO*
┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔
┃👤 *NAME:* ${isSelf ? pushName : targetName}
┃📱 *NUMBER:* wa.me/${target.split('@')[0]}
┃🆔 *JID:* ${target}
┃📅 *TYPE:* ${isSelf ? '👤 Personal' : '👥 Tagged User'}
┃🔗 *STATUS:* Online
${groupInfo}
┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁
┃
┃📊 *QUICK STATS*
┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔
┃⚙️ *PREFIX:* ${prefix}
┃📦 *COMMANDS:* ${totalCommands}
┃🤖 *BOT:* 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃
┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁
┃
┃💡 *TIP:*
┃Type *${prefix}menu* to see
┃all available commands
┃
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`;

        // Context info kwa newsletter forwarding
        const contextInfo = {
            mentionedJid: mentionedJid,
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363424973782944@newsletter',
                newsletterName: `𝐓𝐘𝐑𝐄𝐗 𝐌𝐃`,
                serverMessageId: 143,
            },
        };

        // Send with profile picture ya target
        try {
            const ppUrl = await conn.profilePictureUrl(target, 'image').catch(() => null);
            
            if (ppUrl) {
                await conn.sendMessage(from, {
                    image: { url: ppUrl },
                    caption: sifaText,
                    contextInfo: contextInfo
                }, { quoted: mek });
            } else {
                // Fallback kwa bot image
                await conn.sendMessage(from, {
                    image: { url: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg' },
                    caption: sifaText,
                    contextInfo: contextInfo
                }, { quoted: mek });
            }
        } catch (imgErr) {
            // Text only fallback
            await conn.sendMessage(from, {
                text: sifaText,
                contextInfo: contextInfo
            }, { quoted: mek });
        }
        
        // React success
        await conn.sendMessage(from, {
            react: { text: '✅', key: mek.key }
        });
        
    } catch (e) {
        console.error("Sifa Error:", e);
        reply(`❌ 𝙴𝚛𝚛𝚘𝚛: ${e.message}`);
    }
});
