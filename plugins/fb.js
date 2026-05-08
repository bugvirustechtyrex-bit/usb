 const { cmd } = require("../command");
const getFBInfo = require("@xaviabot/fb-downloader");
const config = require("../config");
const fs = require("fs");
const path = require("path");

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
    pattern: "fb",
    alias: ["facebook", "facebook1", "fb1"],
    desc: "Download Facebook videos/audios",
    category: "download",
    react: "📽️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        const fbUrl = q && q.trim();
        
        if (!fbUrl) {
            return reply("Please send a Facebook video link!\n\n> ® Powered by Tyrex Tech");
        }
        
        if (!fbUrl.includes("https://") || !fbUrl.includes("facebook.com")) {
            return reply("Please send a valid Facebook video link.\n\n> ® Powered by Tyrex Tech");
        }

        const videoData = await getFBInfo(fbUrl);

        if (!videoData || !videoData.sd) {
            return reply("Failed to fetch video. The link might be private or invalid.\n\n> ® Powered by Tyrex Tech");
        }

        const caption = `
╭┄┄┄🌸🌹 *FACEBOOK DOWNLOADER* 🌹🌸┄┄┄⊷
┃
┃ *📌 TITLE:*  
┃ ${videoData.title || 'No title available'}
┃
┃ ━━━━━━━━━━━━━━━━
┃ *🎬 REPLY WITH NUMBER BELOW*
┃ ━━━━━━━━━━━━━━━━
┃
┃ *📹 VIDEO*
┃ 1 SD Quality
┃ 2 HD Quality
┃
┃ *🎵 AUDIO*
┃ 3 Audio Only
┃ 4 As Document
┃ 5 As Voice Message
┃
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® Powered by Tyrex Tech
`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: videoData.thumbnail || "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg" },
            caption,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });

        // Reply handler: listen for reply with option
        conn.ev.on("messages.upsert", async update => {
            try {
                const msg = update.messages[0];
                if (!msg.message?.extendedTextMessage) return;
                
                const text = msg.message.extendedTextMessage.text.trim();
                const quotedMsg = msg.message.extendedTextMessage.contextInfo?.stanzaId;
                
                if (quotedMsg === sentMsg.key.id) {
                    await conn.sendMessage(from, { react: { text: "⬇️", key: msg.key } });

                    switch (text) {
                        case "1":
                            await conn.sendMessage(from, {
                                video: { url: videoData.sd },
                                caption: `*TYREX MD* - SD Quality\n\n> ® Powered by Tyrex Tech`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                            
                        case "2":
                            if (videoData.hd) {
                                await conn.sendMessage(from, {
                                    video: { url: videoData.hd },
                                    caption: `*TYREX MD* - HD Quality\n\n> ® Powered by Tyrex Tech`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                                }, { quoted: msg });
                            } else {
                                await conn.sendMessage(from, { 
                                    text: "HD not available. Sending SD quality.\n\n> ® Powered by Tyrex Tech",
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                                }, { quoted: msg });
                                
                                await conn.sendMessage(from, {
                                    video: { url: videoData.sd },
                                    caption: `*TYREX MD* - SD Quality\n\n> ® Powered by Tyrex Tech`,
                                    contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                                }, { quoted: msg });
                            }
                            break;
                            
                        case "3":
                            await conn.sendMessage(from, {
                                audio: { url: videoData.sd },
                                mimetype: "audio/mpeg",
                                caption: `*TYREX MD* - Audio Only\n\n> ® Powered by Tyrex Tech`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                            
                        case "4":
                            await conn.sendMessage(from, {
                                document: { url: videoData.sd },
                                mimetype: "video/mp4",
                                fileName: `TYREX_MD_${Date.now()}.mp4`,
                                caption: `*TYREX MD* - Video Document\n\n> ® Powered by Tyrex Tech`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                            
                        case "5":
                            await conn.sendMessage(from, {
                                audio: { url: videoData.sd },
                                mimetype: "audio/ogg; codecs=opus",
                                ptt: true,
                                caption: `*TYREX MD* - Voice Message\n\n> ® Powered by Tyrex Tech`,
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                            
                        default:
                            await conn.sendMessage(from, { 
                                text: "Please choose a number (1-5) only.\n\n> ® Powered by Tyrex Tech",
                                contextInfo: getContextInfo({ sender: msg.key.participant || msg.key.remoteJid }, ownerName, formattedOwnerNumber)
                            }, { quoted: msg });
                            break;
                    }
                    
                    await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
                }
            } catch (e) {
                console.error("FB Reply Handler Error:", e);
            }
        });

    } catch (error) {
        console.error("FB Command Error:", error);
        reply(`Failed to download video. Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
});
