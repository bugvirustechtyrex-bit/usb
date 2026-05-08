const axios = require('axios'); 
const config = require('../config');
const { cmd, commands } = require('../command');
const fetch = require('node-fetch'); 

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
    pattern: "praytime", 
    alias: ["prayertimes", "prayertime", "ptime" ], 
    react: "✅", 
    desc: "Get the prayer times, weather, and location for the city.", 
    category: "information", 
    filename: __filename,
},
async(conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";

        const city = args.length > 0 ? args.join(" ") : "bhakkar";
        const apiUrl = `https://api.nexoracle.com/islamic/prayer-times?city=${city}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            return reply('Error fetching prayer times!\n\n> ® Powered by Tyrex Tech');
        }

        const data = await response.json();

        if (data.status !== 200) {
            return reply('Failed to get prayer times. Please try again later.\n\n> ® Powered by Tyrex Tech');
        }

        const prayerTimes = data.result.items[0];
        const weather = data.result.today_weather;
        const location = data.result.city;

        let dec = `╭┄┄┄🌸🌹 *PRAYER TIMES* 🌹🌸┄┄┄⊷\n┃\n┃ 📍 *Location*: ${location}, ${data.result.state}\n┃ 🕌 *Method*: ${data.result.prayer_method_name}\n┃\n┃ ━━━━━━━━━━━━━━━━\n┃\n┃ 🌅 *Fajr*: ${prayerTimes.fajr}\n┃ 🌄 *Shurooq*: ${prayerTimes.shurooq}\n┃ ☀️ *Dhuhr*: ${prayerTimes.dhuhr}\n┃ 🌇 *Asr*: ${prayerTimes.asr}\n┃ 🌆 *Maghrib*: ${prayerTimes.maghrib}\n┃ 🌃 *Isha*: ${prayerTimes.isha}\n┃\n┃ 🧭 *Qibla Direction*: ${data.result.qibla_direction}°\n┃\n┃ 🌡️ *Temperature*: ${weather.temperature !== null ? `${weather.temperature}°C` : 'Data not available'}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(
            from,
            {
                image: { url: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg' },
                caption: dec,
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply('*Error occurred while fetching prayer times and weather.*\n\n> ® Powered by Tyrex Tech');
    }
});