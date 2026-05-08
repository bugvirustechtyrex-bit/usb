 const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const getContextInfo = (sender) => ({
    mentionedJid: [sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363424973782944@newsletter',
        newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
        serverMessageId: 143,
    },
});

const CREATOR = '255628378557@s.whatsapp.net';
const OWNERS_FILE = path.join(__dirname, '../data', 'owners.json');
const CONFIG_ENV = path.join(__dirname, '../config.env');

const getOwners = () => {
    try {
        return fs.existsSync(OWNERS_FILE) ? JSON.parse(fs.readFileSync(OWNERS_FILE, 'utf-8')) : [CREATOR];
    } catch (e) {
        console.error('Error reading owners:', e);
        return [CREATOR];
    }
};

const isOwner = (jid) => getOwners().includes(jid);

const getConfig = (key) => {
    try {
        if (fs.existsSync(CONFIG_ENV)) {
            const content = fs.readFileSync(CONFIG_ENV, 'utf-8');
            const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
            return match ? match[1] : null;
        }
    } catch (e) {
        console.error('Error reading config:', e);
    }
    return null;
};

const setConfig = (key, value) => {
    try {
        let content = '';
        if (fs.existsSync(CONFIG_ENV)) {
            content = fs.readFileSync(CONFIG_ENV, 'utf-8');
            const regex = new RegExp(`^${key}=.*$`, 'm');
            content = regex.test(content) ? content.replace(regex, `${key}=${value}`) : content + `\n${key}=${value}`;
        } else {
            content = `${key}=${value}`;
        }
        fs.writeFileSync(CONFIG_ENV, content);
        return true;
    } catch (e) {
        console.error('Error writing config:', e);
        return false;
    }
};

const toggleConfig = (key) => {
    const current = (getConfig(key) || 'false').toLowerCase();
    const newValue = current === 'true' ? 'false' : 'true';
    return setConfig(key, newValue) ? newValue : null;
};

const FEATURES = {
    'auto_typing': 'AUTO_TYPING',
    'auto_reply': 'AUTO_REPLY',
    'auto_react': 'AUTO_REACT',
    'read_message': 'READ_MESSAGE',
    'always_online': 'ALWAYS_ONLINE',
    'anti_call': 'ANTI_CALL',
    'anti_delete': 'ANTI_DELETE',
    'anti_bad': 'ANTI_BAD',
    'auto_status_seen': 'AUTO_STATUS_SEEN',
    'auto_sticker': 'AUTO_STICKER',
    'auto_recording': 'AUTO_RECORDING',
    'welcome': 'WELCOME',
    'admin_events': 'ADMIN_EVENTS'
};

cmd({
    pattern: "settings",
    alias: ["control", "tyrexcontrol", "feature", "toggle", "config"],
    react: "⚙️",
    desc: "Bot settings - toggle features on/off",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, l, q, sender, reply }) => {
    try {
        if (!isOwner(sender)) {
            return reply("Only bot owners can use this\n\n> ® Powered by Tyrex Tech");
        }

        if (!q || !q.trim()) {
            let list = `╭┄┄┄🌸🌹 *BOT SETTINGS* 🌹🌸┄┄┄⊷\n`;
            list += `┃ ⚙️ Available Features:\n┃\n`;
            
            for (const [name, key] of Object.entries(FEATURES)) {
                const status = (getConfig(key) || 'false').toLowerCase() === 'true' ? '✅' : '❌';
                list += `┃ ${status} ${name}\n`;
            }
            
            list += `┃\n┣━━━━━━━━━━━━━━━━━━━━\n`;
            list += `┃ 📝 To toggle:\n`;
            list += `┃ .settings feature_name\n`;
            list += `┃\n┃ Example:\n`;
            list += `┃ .settings auto_reply\n`;
            list += `╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

            return await conn.sendMessage(from, {
                text: list,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        }

        const feature = q.trim().toLowerCase();
        const configKey = FEATURES[feature];

        if (!configKey) {
            let suggestions = `Feature '${feature}' not found\n\n`;
            suggestions += `Available features:\n`;
            for (const name of Object.keys(FEATURES)) {
                suggestions += `${name}\n`;
            }
            suggestions += `\n> ® Powered by Tyrex Tech`;

            return reply(suggestions);
        }

        const newStatus = toggleConfig(configKey);
        if (newStatus) {
            const statusText = newStatus === 'true' ? 'ENABLED' : 'DISABLED';
            const icon = newStatus === 'true' ? '🟢' : '🔴';
            
            await conn.sendMessage(from, {
                text: `╭┄┄┄🌸🌹 *SETTING UPDATED* 🌹🌸┄┄┄⊷\n┃\n┃ ${icon} Feature:\n┃ 📌 ${feature.toUpperCase()}\n┃\n┃ Status:\n┃ ${statusText}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });
        } else {
            reply("Failed to update setting\n\n> ® Powered by Tyrex Tech");
        }
    } catch (e) {
        console.error('Settings command error:', e);
        reply(`Command error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
        if (l) l(e);
    }
});
