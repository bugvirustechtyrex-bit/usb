const { cmd } = require('../command');
const axios = require('axios');

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
    pattern: "youtube",
    alias: ["yt", "stalk", "ytstalk"],
    react: "🎥",
    desc: "Get YouTube channel information and latest videos",
    category: "stalk",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

    if (!q || !q.trim()) {
        return reply("Please provide a YouTube username\n\nExample: .youtube mrbeast");
    }

    await conn.sendPresenceUpdate('composing', from);

    const response = await axios.get(`https://api.siputzx.my.id/api/stalk/youtube?username=${encodeURIComponent(q.trim())}`, {
        timeout: 30000
    });

    if (!response.data) {
        throw new Error('No response from API');
    }

    const data = response.data;

    if (!data.username) {
        throw new Error('Channel not found');
    }

    await conn.sendPresenceUpdate('paused', from);

    let channelInfo = `╭┄┄┄🌸🌹 *YOUTUBE CHANNEL* 🌹🌸┄┄┄⊷\n`;
    channelInfo += `┃ 📺 Username: ${data.username || 'N/A'}\n`;
    channelInfo += `┃ 📝 Display Name: ${data.displayName || 'N/A'}\n`;
    channelInfo += `┃ 👥 Subscribers: ${data.subscribers || 'N/A'}\n`;
    channelInfo += `┃ 🎬 Videos: ${data.videoCount || 'N/A'}\n`;
    channelInfo += `┃ 📄 Description: ${(data.description || 'N/A').substring(0, 100)}\n`;
    channelInfo += `┃ 🔗 Channel URL: ${data.channelUrl || 'N/A'}\n`;
    channelInfo += `╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n\n`;

    channelInfo += `╭┄┄┄🌸🌹 *LATEST VIDEOS* 🌹🌸┄┄┄⊷\n`;

    if (data.latestVideos && Array.isArray(data.latestVideos)) {
        data.latestVideos.forEach((video, index) => {
            channelInfo += `┃\n┃ 📹 Video ${index + 1}:\n`;
            channelInfo += `┃ 🎞️ Title: ${(video.title || 'N/A').substring(0, 50)}\n`;
            channelInfo += `┃ 👁️ Views: ${video.views || 'N/A'}\n`;
            channelInfo += `┃ ⏱️ Duration: ${video.duration || 'N/A'}\n`;
            channelInfo += `┃ 🕐 Published: ${video.publishedTime || 'N/A'}\n`;
            channelInfo += `┃ 🔗 Link: ${video.videoUrl || 'N/A'}\n`;
        });
    } else {
        channelInfo += `┃ ❌ No videos found\n`;
    }

    channelInfo += `╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

    if (channelInfo.length > 4096) {
        channelInfo = channelInfo.substring(0, 4090) + '...';
    }

    if (data.avatarUrl) {
        try {
            await conn.sendMessage(from, {
                image: { url: data.avatarUrl },
                caption: channelInfo,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        } catch (imgError) {
            await conn.sendMessage(from, {
                text: channelInfo,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }
    } else {
        await conn.sendMessage(from, {
            text: channelInfo,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);

    let errorMsg = 'Error fetching YouTube data';

    if (e.message === 'Channel not found') {
        errorMsg = 'Channel not found';
    } else if (e.response?.status === 429) {
        errorMsg = 'Rate limited try again later';
    } else if (e.response?.status === 500) {
        errorMsg = 'API server error';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout';
    }

    reply(errorMsg);
    l(e);
}
});