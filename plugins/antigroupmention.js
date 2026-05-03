const { cmd } = require("../command");
const config = require("../config");
const fs = require('fs');
const path = require('path');

// ==================== DATABASE SETUP ====================
const dbPath = path.join(__dirname, '../data/antigrpmention_settings.json');
const dbFolder = path.join(__dirname, '../data');
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '{}');

function readDB() {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch {
        return {};
    }
}
function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('❌ AntiGrpMention DB error:', err);
    }
}

// ==================== CONTEXT INFO (NEWSLETTER STYLE) ====================
const getContextInfo = (sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '✨ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 ✨',
            serverMessageId: 143,
        },
    };
};

// ==================== EVENT HANDLER (detects @everyone/@all) ====================
cmd({ on: "body" }, async (client, message, chat, { from, sender, isGroup, isAdmins, isOwner, body }) => {
    try {
        // Hakikisha ni group, si admin, si owner, si ujumbe wa bot yenyewe
        if (!isGroup || isAdmins || isOwner) return;
        if (message.key && message.key.fromMe) return;

        const db = readDB();
        let enabled = false;
        let mode = 'delete';

        if (db[from] && typeof db[from].enabled !== 'undefined') {
            enabled = db[from].enabled;
            mode = db[from].mode || 'delete';
        } else {
            enabled = false; // default imezimwa
            mode = 'delete';
        }

        if (!enabled) return;

        // Detect @everyone or @all (case insensitive)
        const mentionRegex = /(@everyone|@all)/i;
        if (!mentionRegex.test(body)) return;

        // 1. Futa ujumbe wenye mention
        try {
            await client.sendMessage(from, { delete: message.key });
            console.log(`🗑️ Deleted group mention from ${sender} in ${from}`);
        } catch (delErr) {
            console.error('❌ Failed to delete mention message:', delErr);
        }

        // 2. Chukua hatua kulingana na mode
        if (mode === 'warn') {
            await client.sendMessage(from, {
                text: `⚠️ *Group mention detected!*\n@${sender.split("@")[0]} tafadhari usitumie @everyone au @all.\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                mentions: [sender],
                contextInfo: getContextInfo(sender)
            }, { quoted: message });
        }
        else if (mode === 'kick') {
            await client.sendMessage(from, {
                text: `🚫 *Group mention detected!*\n@${sender.split("@")[0]} ametolewa kwenye kundi.\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                mentions: [sender],
                contextInfo: getContextInfo(sender)
            }, { quoted: message });
            try {
                await client.groupParticipantsUpdate(from, [sender], "remove");
            } catch (kickErr) {
                console.error('❌ Kick failed:', kickErr);
            }
        }
        // mode 'delete' -> hakuna ujumbe zaidi, umefutwa tu
    } catch (err) {
        console.error('❌ AntiGrpMention handler error:', err);
    }
});

// ==================== COMMAND YA KUSAJI MIPANGILIO ====================
cmd({
    pattern: "antigrpmention",
    alias: ["agm", "antieveryone", "antiall"],
    desc: "Kuzuia au kuchukua hatua kwa @everyone / @all kwenye makundi",
    category: "group",
    react: "🔇",
    filename: __filename,
},
async (client, message, m, { isGroup, isAdmins, isOwner, from, sender, args, reply }) => {
    try {
        if (!isGroup) {
            return await client.sendMessage(from, {
                text: "❌ Command hii inatumika kwenye makundi tu!",
                contextInfo: getContextInfo(sender)
            }, { quoted: message });
        }

        if (!isAdmins && !isOwner) {
            return await client.sendMessage(from, {
                text: "🚫 Wana admin pekee ndio wanaweza kutumia command hii!",
                mentions: [sender],
                contextInfo: getContextInfo(sender)
            }, { quoted: message });
        }

        const action = args[0]?.toLowerCase();
        const db = readDB();
        if (!db[from]) db[from] = { enabled: false, mode: 'delete' };

        let statusText = "", reaction = "🔇", extra = "";

        if (!action || action === 'status') {
            const settings = db[from];
            statusText = `📌 *Hali ya Anti Group Mention*\n\n⚙️ Imewashwa: ${settings.enabled ? "✅ NDIO" : "❌ HAPANA"}\n🔧 Njia: *${settings.mode}*\n\n📝 *Amri:*\n.agm on      - Washa ulinzi\n.agm off     - Zima ulinzi\n.agm set delete  - Futa tu\n.agm set warn    - Futa + onyo\n.agm set kick    - Futa + toa nje`;
            extra = `Inagundua: @everyone , @all`;
            reaction = "📊";
        } 
        else if (action === 'on') {
            db[from].enabled = true;
            statusText = "✅ Ulinzi wa @everyone/@all umewashwa kwa kundi hili!";
            reaction = "✅";
            extra = "Sasa kila mtu anayetaja @everyone au @all atachukuliwa hatua.";
        }
        else if (action === 'off') {
            db[from].enabled = false;
            statusText = "❌ Ulinzi wa @everyone/@all umezimwa kwa kundi hili.";
            reaction = "❌";
            extra = "Sasa watu wanaweza kutumia @everyone / @all bila kizuizi.";
        }
        else if (action === 'set') {
            const mode = args[1]?.toLowerCase();
            if (!['delete', 'warn', 'kick'].includes(mode)) {
                return await client.sendMessage(from, {
                    text: "❌ Njia isiyo sahihi. Tumia: delete, warn, au kick",
                    contextInfo: getContextInfo(sender)
                }, { quoted: message });
            }
            db[from].enabled = true;
            db[from].mode = mode;
            statusText = `🔄 Njia ya ulinzi imebadilishwa kuwa *${mode.toUpperCase()}*`;
            reaction = "⚙️";
            extra = mode === 'delete' ? "Ujumbe utafutwa tu." : (mode === 'warn' ? "Ujumbe utafutwa na mtumiaji ataonywa." : "Ujumbe utafutwa na mtumiaji atatolewa nje.");
        }
        else {
            statusText = "❌ Amri isiyojulikana. Tumia: on, off, set <delete/warn/kick>, status";
            reaction = "❌";
        }

        // Hifadhi mabadiliko
        writeDB(db);

        // Tuma jibu pamoja na picha ya brand
        await client.sendMessage(from, {
            image: { url: "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg" },
            caption: `${statusText}\n${extra}\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
            contextInfo: getContextInfo(sender)
        }, { quoted: message });

        // React kwa command
        try {
            await client.sendMessage(from, { react: { text: reaction, key: message.key } });
        } catch (e) {}

    } catch (err) {
        console.error("❌ AntiGrpMention command error:", err);
        await client.sendMessage(from, {
            text: `⚠️ Hitilafu: ${err.message}`,
            contextInfo: getContextInfo(sender)
        }, { quoted: message });
    }
});
