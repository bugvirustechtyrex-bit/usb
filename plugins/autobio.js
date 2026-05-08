const axios = require('axios');
const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');

// FakevCard ya TYREX MD
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐓𝐘𝐑𝐄𝐗"
    }
};

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

let bioInterval;
const defaultBio = config.AUTO_BIO_TEXT || "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 | Quote: {quote} | Time: {time}";
const quoteApiUrl = config.QUOTE_API_URL || 'https://apis.davidcyriltech.my.id/random/quotes';
const updateInterval = config.AUTO_BIO_INTERVAL || 30 * 1000;

// Fallback quotes
const fallbackQuotes = [
    "Stay curious, keep learning!",
    "Dream big, work hard!",
    "The best is yet to come.",
    "Keep it real, always.",
    "Life is a journey, enjoy it!"
];

// Function to get Tanzania time
function getTanzaniaTime() {
    const options = {
        timeZone: 'Africa/Dar_es_Salaam',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };
    
    const now = new Date();
    const tzTime = now.toLocaleString('en-US', options);
    return tzTime;
}

cmd({
    pattern: 'autobio',
    alias: ['autoabout'],
    desc: 'Toggle automatic bio updates with random quotes and Tanzania time',
    category: 'misc',
    filename: __filename,
    usage: `${config.PREFIX}autobio [on/off] [text]`
}, async (conn, mek, m, { args, isOwner, from, sender }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        if (!isOwner) {
            return await conn.sendMessage(from, { 
                text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ 🚫 *This command is only available to the bot owner.*\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        const [action, ...bioParts] = args;
        const customBio = bioParts.join(' ') || defaultBio;

        if (action === 'on') {
            if (config.AUTO_BIO === "true") {
                return await conn.sendMessage(from, { 
                    text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ℹ️ *Auto-Bio is already enabled*\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
                    contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
                }, { quoted: fkontak });
            }

            config.AUTO_BIO = "true";
            config.AUTO_BIO_TEXT = customBio;

            startAutoBio(conn, customBio);
            
            return await conn.sendMessage(from, { 
                text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ✅ *Auto-Bio Enabled*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ Text: "${customBio}"\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });

        } else if (action === 'off') {
            if (config.AUTO_BIO !== "true") {
                return await conn.sendMessage(from, { 
                    text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ℹ️ *Auto-Bio is already disabled*\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
                    contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
                }, { quoted: fkontak });
            }

            config.AUTO_BIO = "false";
            stopAutoBio();
            
            return await conn.sendMessage(from, { 
                text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ✅ *Auto-Bio Disabled*\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });

        } else {
            const currentStatus = config.AUTO_BIO === "true" ? "Enabled ✅" : "Disabled ❌";
            
            return await conn.sendMessage(from, { 
                text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ 🤖 *AUTO-BIO*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ 📜 *Usage:*\n┃ ➸ .autobio on [text] - Enable\n┃ ➸ .autobio off - Disable\n┃\n┃ 🔖 *Placeholders:*\n┃ ➸ {quote} - Random quote\n┃ ➸ {time} - Tanzania time\n┃\n┃ 💡 *Status:* ${currentStatus}\n┃ 📝 *Text:* "${config.AUTO_BIO_TEXT || defaultBio}"\n┃ 🕒 *Tanzania Time:* ${getTanzaniaTime()}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }
    } catch (error) {
        console.error('❌ Auto-bio error:', error.message);
        await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ Failed to update auto-bio settings\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
            contextInfo: getContextInfo({ sender: sender }, "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", "255628378557")
        }, { quoted: fkontak });
    }
});

// Fetch random quote
async function fetchQuote() {
    try {
        const response = await axios.get(quoteApiUrl);
        if (response.status === 200 && response.data.content) {
            return response.data.content;
        }
        throw new Error('Invalid quote API response');
    } catch (error) {
        console.error('Quote fetch error:', error.message);
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
}

// Start auto-bio updates
async function startAutoBio(conn, bioText) {
    stopAutoBio();

    try {
        const quote = await fetchQuote();
        const tzTime = getTanzaniaTime();
        const formattedBio = bioText
            .replace('{quote}', quote)
            .replace('{time}', tzTime);
        await conn.updateProfileStatus(formattedBio);
    } catch (error) {
        console.error('❌ Initial bio update error:', error.message);
    }

    bioInterval = setInterval(async () => {
        try {
            const quote = await fetchQuote();
            const tzTime = getTanzaniaTime();
            const formattedBio = bioText
                .replace('{quote}', quote)
                .replace('{time}', tzTime);
            await conn.updateProfileStatus(formattedBio);
        } catch (error) {
            console.error('❌ Bio update error:', error.message);
            setTimeout(async () => {
                try {
                    const quote = await fetchQuote();
                    const tzTime = getTanzaniaTime();
                    const formattedBio = bioText
                        .replace('{quote}', quote)
                        .replace('{time}', tzTime);
                    await conn.updateProfileStatus(formattedBio);
                } catch (retryError) {
                    console.error('❌ Bio retry error:', retryError.message);
                    stopAutoBio();
                }
            }, 5000);
        }
    }, updateInterval);
}

// Stop auto-bio updates
function stopAutoBio() {
    if (bioInterval) {
        clearInterval(bioInterval);
        bioInterval = null;
    }
}

// Initialize auto-bio if enabled
module.exports.init = (conn) => {
    if (config.AUTO_BIO === "true") {
        const bioText = config.AUTO_BIO_TEXT || defaultBio;
        startAutoBio(conn, bioText);
    }
};
