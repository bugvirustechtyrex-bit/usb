const { cmd } = require('../command');

// FakevCard
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐒𝐈𝐋𝐀 𝐌𝐃"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// ============ GSTATUS COMMAND ============
cmd({
    pattern: "gstatus",
    alias: ["groupstatus", "gs", "statusgc"],
    react: "📢",
    desc: "Post a group status with text, image, video, or audio",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, prefix, quoted, isGroup, sender, isBotAdmins, reply, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command can only be used in group chats`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Check if bot is admin (optional - remove if you don't want this check)
    // if (!isBotAdmins) return await conn.sendMessage(from, {
    //     text: `❌ Bot needs to be admin to post group status`,
    //     contextInfo: getContextInfo({ sender: sender })
    // }, { quoted: fkontak });
    
    const quotedMsg = m.quoted ? m.quoted : m;
    const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
    const caption = args.join(' ').trim();
    
    // Default group link - replace with your actual group link
    const defaultGroupLink = 'https://chat.whatsapp.com/your-group-link-here';
    
    const defaultCaption = 
`Group status posted successfully ✅

JOIN:
${defaultGroupLink}

> 𝐒𝐈𝐋𝐀 𝐌𝐃`;

    if (!/image|video|audio/.test(mime) && !caption) {
        return await conn.sendMessage(from, {
            text: `📢 *GROUP STATUS COMMAND*
            
Please reply to an image, video, or audio,
or include text with the command.

*Examples:*
▸ ${prefix}gstatus Check out this update!
▸ Reply to image with ${prefix}gstatus
▸ Reply to video with ${prefix}gstatus
▸ Reply to audio with ${prefix}gstatus

> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `⏳ Posting group status...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Handle media types
    if (/image/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        await conn.sendMessage(from, {
            image: buffer,
            caption: caption || defaultCaption,
            contextInfo: {
                ...getContextInfo({ sender: sender }),
                isForwarded: true,
                forwardingScore: 999,
                externalAdReply: {
                    title: "📢 GROUP STATUS",
                    body: "SILA MD BOT",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: fkontak });
        
        await conn.sendMessage(from, {
            text: `┏━❑ GSTATUS COMPLETE ━━━━━━━━━
┃ ✅ Image status posted successfully
┗━━━━━━━━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } else if (/video/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        await conn.sendMessage(from, {
            video: buffer,
            caption: caption || defaultCaption,
            contextInfo: {
                ...getContextInfo({ sender: sender }),
                isForwarded: true,
                forwardingScore: 999,
                externalAdReply: {
                    title: "📢 GROUP STATUS",
                    body: "SILA MD BOT",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: fkontak });
        
        await conn.sendMessage(from, {
            text: `┏━❑ GSTATUS COMPLETE ━━━━━━━━━
┃ ✅ Video status posted successfully
┗━━━━━━━━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } else if (/audio/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        await conn.sendMessage(from, {
            audio: buffer,
            mimetype: 'audio/mp4',
            ptt: false, // Set to true for voice note
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        
        await conn.sendMessage(from, {
            text: `┏━❑ GSTATUS COMPLETE ━━━━━━━━━
┃ ✅ Audio status posted successfully
┗━━━━━━━━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } else if (caption) {
        await conn.sendMessage(from, {
            text: `📢 *GROUP STATUS*
            
${caption}

> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        
        await conn.sendMessage(from, {
            text: `┏━❑ GSTATUS COMPLETE ━━━━━━━━━
┃ ✅ Text status posted successfully
┗━━━━━━━━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) {
    console.log('GSTATUS ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to post group status: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});
