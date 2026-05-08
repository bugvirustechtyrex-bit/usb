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
    pattern: "tts",
    alias: ["ttsgoogle", "speak", "voice"],
    react: "🔊",
    desc: "Convert text to speech using Google TTS",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

    if (!q || !q.trim()) {
        return reply("Please provide a text\n\nExample: .tts Hello world");
    }

    if (q.trim().length > 200) {
        return reply("Text too long (max 200 characters)\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendPresenceUpdate('composing', from);

    const response = await axios.get(`https://api.siputzx.my.id/api/tools/ttsgoogle?text=${encodeURIComponent(q.trim())}`, {
        responseType: 'arraybuffer',
        timeout: 30000
    });

    if (!response.data) {
        throw new Error('No response from API');
    }

    await conn.sendPresenceUpdate('paused', from);

    await conn.sendMessage(from, {
        audio: response.data,
        mimetype: 'audio/mpeg',
        ptt: true,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);

    let errorMsg = 'Failed to generate audio';

    if (e.response?.status === 429) {
        errorMsg = 'Rate limited try again later';
    } else if (e.response?.status === 500) {
        errorMsg = 'TTS server error';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout';
    }

    reply(errorMsg);
    l(e);
}
});