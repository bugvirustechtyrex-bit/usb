 const config = require('../config')
const { cmd, commands } = require('../command')
const { runtime } = require('../lib/functions')

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
    pattern: "list",
    alias: ["listcmd", "commands"],
    desc: "Show all available commands with descriptions",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        const totalCommands = Object.keys(commands).length
        let aliasCount = 0
        Object.values(commands).forEach(cmd => {
            if (cmd.alias) aliasCount += cmd.alias.length
        })

        const categories = [...new Set(Object.values(commands).map(c => c.category))]

        let menuText = `╭┄┄┄🌸🌹 *TYREX MD* 🌹🌸┄┄┄⊷\n┃\n┃ *🛠️ BOT INFORMATION*\n┃ • 🤖 Bot Name: ${config.BOT_NAME}\n┃ • 👑 Owner: ${config.OWNER_NAME}\n┃ • ⚙️ Prefix: [${config.PREFIX}]\n┃ • 🌐 Platform: Heroku\n┃ • 📦 Version: 1.0.0\n┃ • 🕒 Runtime: ${runtime(process.uptime())}\n┃\n┃ *📊 COMMAND STATS*\n┃ • 📜 Total Commands: ${totalCommands}\n┃ • 🔄 Total Aliases: ${aliasCount}\n┃ • 🗂️ Categories: ${categories.length}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n`

        const categorized = {}
        categories.forEach(cat => {
            categorized[cat] = Object.values(commands).filter(c => c.category === cat)
        })

        for (const [category, cmds] of Object.entries(categorized)) {
            menuText += `╭┄┄┄『 *${category.toUpperCase()}* 』┄┄┄⊷\n┃ • 📂 Commands: ${cmds.length}\n┃ • 🔄 Aliases: ${cmds.reduce((a, c) => a + (c.alias ? c.alias.length : 0), 0)}\n┃\n`

            cmds.forEach(c => {
                menuText += `┃▸📄 COMMAND: ${config.PREFIX}${c.pattern}\n`
                menuText += `┃▸❕ ${c.desc || 'No description available'}\n`
                if (c.alias && c.alias.length > 0) {
                    menuText += `┃▸🔹 Aliases: ${c.alias.map(a => `${config.PREFIX}${a}`).join(', ')}\n`
                }
                if (c.use) {
                    menuText += `┃▸💡 Usage: ${c.use}\n`
                }
                menuText += `┃\n`
            })
            
            menuText += `╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n`
        }

        menuText += `\n📝 *Note*: Use ${config.PREFIX}help <command> for detailed help\n`
        menuText += `> ® Powered by Tyrex Tech`

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg' },
                caption: menuText,
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            },
            { quoted: mek }
        )

    } catch (e) {
        console.error('Command List Error:', e)
        reply(`Error generating command list: ${e.message}\n\n> ® Powered by Tyrex Tech`)
    }
})
