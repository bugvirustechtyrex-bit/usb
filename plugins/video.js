const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const VIDEO_IMAGE = 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg';

cmd({
    pattern: "video",
    alias: ["ytmp4", "mp4", "ytv", "tyrexvideo"],
    desc: "Download videos from YouTube",
    category: "downloader",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, q }) => {
    try {
        if (!q) {
            return reply(`╭┄┄┄🌸🌹 *TYREX MD VIDEO DOWNLOADER* 🌹🌸┄┄┄⊷\n┃ 🎥 Do you want to download video 🥺\n┃\n┃ Type: .video YOUR VIDEO NAME\n┃\n┃ Example:\n┃ .video Cristiano Ronaldo Goal\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
        }

        const search = await yts(q);
        if (!search.videos.length) {
            return reply(`╭┄┄┄🌸🌹 *TYREX MD VIDEO SEARCH* 🌹🌸┄┄┄⊷\n┃ ❌ Can't Find Any Video\n┃ 😭 SORRY 🥺❤️\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
        }

        const data = search.videos[0];
        const ytUrl = data.url;

        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.video_url) {
            return reply(`╭┄┄┄🌸🌹 *TYREX MD VIDEO ERROR* 🌹🌸┄┄┄⊷\n┃ ❌ Video Download Failed\n┃ 🥺 Please Try Again ☺️\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
        }

        const result = apiRes.result.media;
        const caption = `╭┄┄┄🌸🌹 *TYREX MD VIDEO PLAYER* 🌹🌸┄┄┄⊷\n┃ 🎬 Title: ${data.title}\n┃\n┃ 🔗 Link: ${data.url}\n┃ 👀 Views: ${data.views}\n┃ ⏱️ Time: ${data.timestamp}\n┃\n┃ 📝 Choose your version:\n┃\n┃ ❮1❯ Simple Video\n┃ ❮2❯ File Video\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: result.thumbnail }, 
            caption: caption 
        }, { quoted: mek });

        const messageID = sentMsg.key.id;

        const messageHandler = async (msgData) => {
            if (!msgData.messages) return;

            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;

            const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
            const senderID = receivedMsg.key.remoteJid;

            if (isReplyToBot && senderID === from) {
                const choice = receivedText.trim();

                try {
                    if (choice === "1") {
                        await conn.sendMessage(senderID, { 
                            video: { url: result.video_url }, 
                            mimetype: "video/mp4",
                            caption: `*Video: ${data.title}*\n\n*Downloaded by TYREX MD*\n> ® Powered by Tyrex Tech`
                        }, { quoted: mek });
                    } else if (choice === "2") {
                        await conn.sendMessage(senderID, { 
                            document: { url: result.video_url }, 
                            mimetype: "video/mp4", 
                            fileName: `${data.title}.mp4`,
                            caption: `*Video: ${data.title}*\n\n*Downloaded by TYREX MD*\n> ® Powered by Tyrex Tech`
                        }, { quoted: mek });
                    } else {
                        await conn.sendMessage(senderID, { 
                            text: `╭┄┄┄🌸🌹 *TYREX MD SELECTION* 🌹🌸┄┄┄⊷\n┃ ❌ Please Reply with ❮1❯ or ❮2❯\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech` 
                        }, { quoted: mek });
                    }
                } catch (err) {
                    console.error("Video send error:", err.message);
                    await conn.sendMessage(senderID, { 
                        text: `╭┄┄┄🌸🌹 *TYREX MD SEND ERROR* 🌹🌸┄┄┄⊷\n┃ ❌ Failed to send video 📹\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech` 
                    }, { quoted: mek });
                }

                conn.ev.off('messages.upsert', messageHandler);
            }
        };

        conn.ev.on('messages.upsert', messageHandler);

        setTimeout(() => {
            conn.ev.off('messages.upsert', messageHandler);
        }, 60000);

    } catch (error) {
        console.error('Video Error:', error.message);
        reply(`╭┄┄┄🌸🌹 *TYREX MD DOWNLOAD FAILED* 🌹🌸┄┄┄⊷\n┃ 😔 Video download failed!\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
    }
});