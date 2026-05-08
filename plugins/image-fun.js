 const config = require('../config')
const axios = require('axios');
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const fs = require('fs');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

//====================================================================================
cmd({
    pattern: "garl",
    alias: ["imgloli"],
    react: '😎',
    desc: "Download anime loli images.",
    category: "anime",
    use: '.loli',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon')
let wm = `😎 Random Loli Image\n\n> ® Powered by Tyrex Tech`

await conn.sendMessage(from, { 
    image: { url: res.data.data[0].urls.original }, 
    caption: wm,
    contextInfo: getContextInfo({ sender: sender })
}, { quoted: mek })

} catch (e) {
reply("I cant find this anime.\n\n> ® Powered by Tyrex Tech")
console.log(e)
}
})

//=====================================================================
cmd({
    pattern: "waifu",
    alias: ["imgwaifu"],
    react: '💫',
    desc: "Download anime waifu images.",
    category: "anime",
    use: '.waifu',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.pics/sfw/waifu')
let wm = `🩵 Random Waifu Image\n\n> ® Powered by Tyrex Tech`

await conn.sendMessage(from, { 
    image: { url: res.data.url }, 
    caption: wm,
    contextInfo: getContextInfo({ sender: sender })
}, { quoted: mek })

} catch (e) {
reply("I cant find this anime.\n\n> ® Powered by Tyrex Tech")
console.log(e)
}
})

//================================================================
cmd({
    pattern: "neko",
    alias: ["imgneko"],
    react: '💫',
    desc: "Download anime neko images.",
    category: "anime",
    use: '.neko',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.pics/sfw/neko')
let wm = `🩷 Random Neko Image\n\n> ® Powered by Tyrex Tech`

await conn.sendMessage(from, { 
    image: { url: res.data.url  }, 
    caption: wm,
    contextInfo: getContextInfo({ sender: sender })
}, { quoted: mek })

} catch (e) {
reply("I cant find this anime.\n\n> ® Powered by Tyrex Tech")
console.log(e)
}
})
  
//=====================================================================
cmd({
    pattern: "megumin",
    alias: ["imgmegumin"],
    react: '💕',
    desc: "Download anime megumin images.",
    category: "anime",
    use: '.megumin',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.pics/sfw/megumin')
let wm = `❤️‍🔥 Random Megumin Image\n\n> ® Powered by Tyrex Tech`

await conn.sendMessage(from, { 
    image: { url: res.data.url }, 
    caption: wm,
    contextInfo: getContextInfo({ sender: sender })
}, { quoted: mek })

} catch (e) {
reply("I cant find this anime.\n\n> ® Powered by Tyrex Tech")
console.log(e)
}
})

//================================================================
cmd({
    pattern: "maid",
    alias: ["imgmaid"],
    react: '💫',
    desc: "Download anime maid images.",
    category: "anime",
    use: '.maid',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.im/search/?included_tags=maid')
let wm = `😎 Random Maid Image\n\n> ® Powered by Tyrex Tech`

await conn.sendMessage(from, { 
    image: { url: res.data.images[0].url  }, 
    caption: wm,
    contextInfo: getContextInfo({ sender: sender })
}, { quoted: mek })

} catch (e) {
reply("I cant find this anime.\n\n> ® Powered by Tyrex Tech")
console.log(e)
}
})

//=====================================================================
cmd({
    pattern: "awoo",
    alias: ["imgawoo"],
    react: '😎',
    desc: "Download anime awoo images.",
    category: "anime",
    use: '.awoo',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.pics/sfw/awoo')
let wm = `😎 Random Awoo Image\n\n> ® Powered by Tyrex Tech`

await conn.sendMessage(from, { 
    image: { url: res.data.url }, 
    caption: wm,
    contextInfo: getContextInfo({ sender: sender })
}, { quoted: mek })

} catch (e) {
reply("I cant find this anime.\n\n> ® Powered by Tyrex Tech")
console.log(e)
}
})

// Anmiex
cmd({
    pattern: "animegirl",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        await conn.sendMessage(from, { 
            image: { url: data.url }, 
            caption: '*ANIME GIRL IMAGE* 🥳\n\n> ® Powered by Tyrex Tech',
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`Error Fetching Anime Girl image: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    }
});

cmd({
    pattern: "animegirl1",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "🧚🏻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        await conn.sendMessage(from, { 
            image: { url: data.url }, 
            caption: 'ANIME GIRL IMAGE 👾\n\n> ® Powered by Tyrex Tech',
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`Error Fetching Anime Girl image: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    }
});

//==========anime=====
cmd({
    pattern: "anime",
    desc: "anime the bot",
    category: "main",
    react: "⛱️",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let dec = `> TYREX MD ANIME IMGS`

const images = [
    'https://telegra.ph/file/b26f27aa5daaada031b90.jpg',
    'https://telegra.ph/file/51b44e4b086667361061b.jpg',
    'https://telegra.ph/file/7d165d73f914985542537.jpg',
    'https://telegra.ph/file/3d9732d2657d2d72dc102.jpg',
    'https://telegra.ph/file/8daf7e432a646f3ebe7eb.jpg',
    'https://telegra.ph/file/7514b18ea89da924e7496.jpg',
    'https://telegra.ph/file/ce9cb5acd2cec7693d76b.jpg'
];

for (let img of images) {
    await conn.sendMessage(from, {
        image: { url: img },
        caption: dec,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
}

}catch(e){
console.log(e)
reply(`${e}`);
}
});

cmd({
    pattern: "anime1",
    desc: "Animal image.",
    react: "🧚‍♀️",
    category: "other",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
const images = [
    'https://i.waifu.pics/aD7t0Bc.jpg',
    'https://i.waifu.pics/PQO5wPN.jpg',
    'https://i.waifu.pics/5At1P4A.jpg',
    'https://i.waifu.pics/MjtH3Ha.jpg',
    'https://i.waifu.pics/QQW7VKy.jpg'
];

for (let img of images) {
    await conn.sendMessage(from, {
        image: { url: img },
        caption: '> ® Powered by Tyrex Tech',
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
}

}catch(e){
console.log(e)
reply(`${e}`);
}
})

cmd({
    pattern: "dog",
    desc: "Fetch a random dog image.",
    category: "fun",
    react: "🐶",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = `https://dog.ceo/api/breeds/image/random`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        await conn.sendMessage(from, { 
            image: { url: data.message }, 
            caption: '> ® Powered by Tyrex Tech',
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`Error fetching dog image: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    }
});
