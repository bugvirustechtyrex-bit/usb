 const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');

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

cmd({
    pattern: "get",
    alias: ["source", "js"],
    desc: "Fetch the full source code of a command",
    category: "owner",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        const allowedJid = "255628378557@s.whatsapp.net";
        if (sender !== allowedJid) {
            return reply("Access Denied! This command is restricted.\n\n> ® Powered by Tyrex Tech");
        }

        if (!args[0]) {
            return reply("Please provide a command name. Example: .get alive\n\n> ® Powered by Tyrex Tech");
        }

        const commandName = args[0].toLowerCase();
        const commandData = commands.find(cmd => cmd.pattern === commandName || (cmd.alias && cmd.alias.includes(commandName)));

        if (!commandData) {
            return reply("Command not found!\n\n> ® Powered by Tyrex Tech");
        }

        const commandPath = commandData.filename;

        const fullCode = fs.readFileSync(commandPath, 'utf-8');

        let truncatedCode = fullCode;
        if (truncatedCode.length > 4000) {
            truncatedCode = fullCode.substring(0, 4000) + "\n\n// Code too long, sending full file 📂";
        }

        const formattedCode = `╭┄┄┄🌸🌹 *COMMAND SOURCE* 🌹🌸┄┄┄⊷\n┃\n\`\`\`js\n${truncatedCode}\n\`\`\`\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n⚡ Full file sent below 📂\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, { 
            image: { url: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg' },
            caption: formattedCode,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        const fileName = `${commandName}.js`;
        const tempPath = path.join(__dirname, fileName);
        fs.writeFileSync(tempPath, fullCode);

        await conn.sendMessage(from, { 
            document: fs.readFileSync(tempPath),
            mimetype: 'text/javascript',
            fileName: fileName,
            caption: `📄 *${commandName}.js*`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        fs.unlinkSync(tempPath);

    } catch (e) {
        console.error("Error in .get command:", e);
        reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    }
});
