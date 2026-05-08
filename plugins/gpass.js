 const crypto = require('crypto');
const { cmd } = require('../command');

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
    pattern: "gpass",
    desc: "Generate a strong password.",
    category: "other",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        const length = args[0] ? parseInt(args[0]) : 12;
        
        if (isNaN(length) || length < 8) {
            return reply("Please provide a valid length for the password (Minimum 08 Characters).\n\n> ® Powered by Tyrex Tech");
        }

        const generatePassword = (len) => {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
            let password = '';
            for (let i = 0; i < len; i++) {
                const randomIndex = crypto.randomInt(0, charset.length);
                password += charset[randomIndex];
            }
            return password;
        };

        const password = generatePassword(length);
        const message = `🔐 *Your Strong Password* 🔐\n\nPlease find your generated password below:`;

        await conn.sendMessage(from, { 
            text: message,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        await conn.sendMessage(from, { 
            text: `\`\`\`${password}\`\`\`\n\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`Error generating password: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    }
});
