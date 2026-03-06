const { cmd } = require("../command");
const { getLangText } = require('./language_cmds'); // Kama unatumia language system

cmd({
    pattern: "buttonmenu",
    alias: ["bmenu", "btnmenu", "buttons"],
    desc: "Display interactive button menu",
    category: "menu",
    react: "🔘",
    filename: __filename
}, async (conn, mek, m, { from, sender, pushname, isOwner, isCreator, reply }) => {
    try {
        // Check if user has language preference
        const userLang = global.db?.users?.[sender]?.language || 'sw';
        
        // Button message template
        const buttonMessage = {
            image: { url: 'https://files.catbox.moe/i4aqjo.png' }, // Your bot image
            caption: `╔══════════════════════╗
║   🔘 *BUTTON MENU*   ║
╚══════════════════════╝

👋 *Hello, ${pushname || 'User'}!*

Welcome to *SILA-MD* WhatsApp Bot.
Select a category below to get started.

╔══════════════════════╗
║ *📋 MAIN CATEGORIES*  ║
╚══════════════════════╝

🔹 *DOWNLOAD* - Download media from various platforms
🔹 *GROUP* - Group management commands
🔹 *SEARCH* - Search for information
🔹 *UTILS* - Useful tools and utilities
🔹 *FUN* - Fun and entertainment
🔹 *OWNER* - Owner only commands

> © SILA-MD | Powered by Codertz26`,
            footer: 'SILA-MD WhatsApp Bot',
            buttons: [
                {
                    buttonId: '.menu download',
                    buttonText: { displayText: '⬇️ DOWNLOAD' },
                    type: 1
                },
                {
                    buttonId: '.menu group',
                    buttonText: { displayText: '👥 GROUP' },
                    type: 1
                },
                {
                    buttonId: '.menu search',
                    buttonText: { displayText: '🔍 SEARCH' },
                    type: 1
                }
            ],
            headerType: 4 // 4 = image
        };

        // Send first row of buttons
        await conn.sendMessage(from, buttonMessage, { quoted: mek });

        // Second row of buttons
        const buttonMessage2 = {
            text: "═══════════════════════\nSelect more categories below:\n═══════════════════════",
            footer: 'SILA-MD WhatsApp Bot',
            buttons: [
                {
                    buttonId: '.menu utils',
                    buttonText: { displayText: '🛠️ UTILS' },
                    type: 1
                },
                {
                    buttonId: '.menu fun',
                    buttonText: { displayText: '🎉 FUN' },
                    type: 1
                },
                {
                    buttonId: '.menu owner',
                    buttonText: { displayText: '👑 OWNER' },
                    type: 1
                }
            ],
            headerType: 1
        };

        await conn.sendMessage(from, buttonMessage2, { quoted: mek });

        // List message with sections
        const listMessage = {
            text: "📋 *DETAILED MENU*\n\nClick the button below to see all commands in each category.",
            footer: 'SILA-MD WhatsApp Bot',
            title: 'SILA-MD COMMANDS',
            buttonText: '📋 VIEW ALL COMMANDS',
            sections: [
                {
                    title: '⬇️ DOWNLOAD COMMANDS',
                    rows: [
                        { title: 'Instagram', description: 'Download Instagram videos', rowId: '.menu ig' },
                        { title: 'TikTok', description: 'Download TikTok videos', rowId: '.menu tt' },
                        { title: 'YouTube', description: 'Download YouTube videos', rowId: '.menu yt' },
                        { title: 'Facebook', description: 'Download Facebook videos', rowId: '.menu fb' },
                        { title: 'Twitter', description: 'Download Twitter videos', rowId: '.menu tw' }
                    ]
                },
                {
                    title: '👥 GROUP COMMANDS',
                    rows: [
                        { title: 'Group Open/Close', description: 'Open or close group', rowId: '.menu groupopen' },
                        { title: 'Tag All', description: 'Mention all members', rowId: '.menu tagall' },
                        { title: 'Promote/Demote', description: 'Manage admins', rowId: '.menu promote' },
                        { title: 'Kick/Add', description: 'Manage members', rowId: '.menu kick' },
                        { title: 'Anti-Link', description: 'Protect from links', rowId: '.menu antilink' }
                    ]
                },
                {
                    title: '🔍 SEARCH COMMANDS',
                    rows: [
                        { title: 'Google Search', description: 'Search on Google', rowId: '.menu google' },
                        { title: 'YouTube Search', description: 'Search videos', rowId: '.menu ytsearch' },
                        { title: 'Wikipedia', description: 'Search Wikipedia', rowId: '.menu wiki' },
                        { title: 'Image Search', description: 'Search images', rowId: '.menu image' },
                        { title: 'Weather', description: 'Check weather', rowId: '.menu weather' }
                    ]
                },
                {
                    title: '🛠️ UTILS COMMANDS',
                    rows: [
                        { title: 'Calculator', description: 'Simple calculator', rowId: '.menu calc' },
                        { title: 'QR Code', description: 'Generate QR code', rowId: '.menu qr' },
                        { title: 'Shorten URL', description: 'Shorten long URLs', rowId: '.menu shorten' },
                        { title: 'Currency', description: 'Convert currency', rowId: '.menu currency' },
                        { title: 'BMI', description: 'Calculate BMI', rowId: '.menu bmi' }
                    ]
                },
                {
                    title: '🎉 FUN COMMANDS',
                    rows: [
                        { title: 'Facts', description: 'Random fun facts', rowId: '.menu facts' },
                        { title: 'Truth', description: 'Truth questions', rowId: '.menu truth' },
                        { title: 'Karma', description: 'Check your karma', rowId: '.menu karma' },
                        { title: 'Dream Name', description: 'Get your dream name', rowId: '.menu dream' },
                        { title: 'Lucky Number', description: 'Your lucky number', rowId: '.menu lucky' }
                    ]
                },
                {
                    title: '👑 OWNER COMMANDS',
                    rows: [
                        { title: 'Broadcast', description: 'Send broadcast message', rowId: '.menu broadcast' },
                        { title: 'Block/Unblock', description: 'Manage blocked users', rowId: '.menu block' },
                        { title: 'Set Status', description: 'Change bot status', rowId: '.menu status' },
                        { title: 'Update', description: 'Update bot', rowId: '.menu update' },
                        { title: 'Eval', description: 'Execute code', rowId: '.menu eval' }
                    ]
                }
            ],
            listType: 1
        };

        await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.error('Button Menu Error:', e);
        reply('❌ Error displaying button menu.');
    }
});

// Handler for button clicks
cmd({
    pattern: "menu",
    alias: ["btn"],
    desc: "Handle button menu selections",
    category: "menu",
    filename: __filename,
    dontAddCommand: true
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const category = q.trim().toLowerCase();
        
        // Different responses based on button clicked
        const responses = {
            'download': '⬇️ *DOWNLOAD MENU*\n\nUse .menu to go back\n\n.dl ig [url]\n.dl tt [url]\n.dl yt [url]',
            'group': '👥 *GROUP MENU*\n\n.group open\n.group close\n.tagall\n.promote @user\n.demote @user',
            'search': '🔍 *SEARCH MENU*\n\n.google [query]\n.yt [query]\n.wiki [query]\n.image [query]',
            'utils': '🛠️ *UTILS MENU*\n\n.calc [expression]\n.qr [text]\n.shorten [url]\n.currency [amount] [from] [to]',
            'fun': '🎉 *FUN MENU*\n\n.fact\n.truth\n.karma\n.dreamname [name]\n.lucky [name]',
            'owner': '👑 *OWNER MENU*\n\n.broadcast [message]\n.block @user\n.unblock @user\n.setstatus [text]',
            'ig': '📸 *INSTAGRAM DOWNLOAD*\n\nUsage: .ig [url]\nExample: .ig https://www.instagram.com/p/xxx',
            'tt': '🎵 *TIKTOK DOWNLOAD*\n\nUsage: .tiktok [url]\nExample: .tiktok https://www.tiktok.com/@user/video/xxx',
            'yt': '🎬 *YOUTUBE DOWNLOAD*\n\nUsage: .yt [url] or .ytsearch [query]',
            'fb': '📘 *FACEBOOK DOWNLOAD*\n\nUsage: .fb [url]\nExample: .fb https://www.facebook.com/xxx',
            'tw': '🐦 *TWITTER DOWNLOAD*\n\nUsage: .twitter [url]\nExample: .twitter https://twitter.com/user/status/xxx',
            'groupopen': '🔓 *GROUP OPEN/CLOSE*\n\n.group open - Open group\n.group close - Close group',
            'tagall': '📢 *TAG ALL*\n\n.tagall [message] - Mention all members\n.hidetag [message] - Silent mention',
            'promote': '⬆️ *PROMOTE/DEMOTE*\n\n.promote @user - Make admin\n.demote @user - Remove admin',
            'kick': '👢 *KICK/ADD*\n\n.kick @user - Remove member\n.add 255XXXXXXXXX - Add member',
            'antilink': '🔗 *ANTI-LINK*\n\n.antilink on/off - Toggle anti-link protection',
            'google': '🌐 *GOOGLE SEARCH*\n\n.google [query] - Search Google',
            'ytsearch': '🎬 *YOUTUBE SEARCH*\n\n.ytsearch [query] - Search YouTube',
            'wiki': '📚 *WIKIPEDIA*\n\n.wiki [query] - Search Wikipedia',
            'image': '🖼️ *IMAGE SEARCH*\n\n.image [query] - Search images',
            'weather': '☁️ *WEATHER*\n\n.weather [city] - Check weather',
            'calc': '🧮 *CALCULATOR*\n\n.calc 2+2*3 - Calculate',
            'qr': '📱 *QR CODE*\n\n.qr [text] - Generate QR code',
            'shorten': '🔗 *URL SHORTENER*\n\n.shorten [url] - Shorten URL',
            'currency': '💱 *CURRENCY CONVERTER*\n\n.currency 100 usd tzs - Convert',
            'bmi': '⚖️ *BMI CALCULATOR*\n\n.bmi [weight] [height] - e.g., .bmi 70 1.75',
            'facts': '🤔 *RANDOM FACTS*\n\n.fact - Get random fact',
            'truth': '🔍 *TRUTH DARE*\n\n.truth - Get truth question',
            'karma': '⚖️ *KARMA CHECK*\n\n.karma - Check your karma',
            'dream': '💭 *DREAM NAME*\n\n.dreamname [name] - Get dream name',
            'lucky': '🍀 *LUCKY NUMBER*\n\n.lucky [name] - Get lucky number',
            'broadcast': '📢 *BROADCAST*\n\n.broadcast [message] - Send to all groups',
            'block': '🚫 *BLOCK/UNBLOCK*\n\n.block @user - Block user\n.unblock @user - Unblock',
            'status': '📝 *SET STATUS*\n\n.setstatus [text] - Change bot status',
            'update': '🔄 *UPDATE*\n\n.update - Update bot',
            'eval': '💻 *EVAL*\n\n.eval [code] - Execute code (owner only)'
        };

        if (responses[category]) {
            reply(responses[category]);
        } else {
            reply(`❌ Category "${category}" not found.\n\nUse .buttonmenu to see available categories.`);
        }

    } catch (e) {
        console.error('Menu Handler Error:', e);
        reply('❌ Error processing menu selection.');
    }
});
