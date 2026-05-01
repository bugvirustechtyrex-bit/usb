const { cmd } = require("../command");
const config = require("../config");
const fs = require('fs');
const path = require('path');

// ==================== DATABASE SETUP ====================
const dbPath = path.join(__dirname, '../data/antilink_settings.json');

// Kuhakikisha database folder ipo
const dbFolder = path.join(__dirname, '../data');
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
}

// Kuhakikisha file ipo
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '{}');
}

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
        console.error('❌ Error writing to database:', err);
    }
}

// ==================== HELPER FUNCTIONS ====================
const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '© TYREX 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// ==================== WARNINGS MEMORY ====================
// Inahifadhiwa kwenye memory (inapotea bot ikirestart)
const warningCount = {};

// ==================== ANTI-LINK EVENT HANDLER ====================
cmd({ 
    on: "body" 
}, async (client, message, chat, { from, sender, isGroup, isAdmins, isOwner, body }) => {
    try {
        // Basic checks: Makundi tu, sio admin, sio owner
        if (!isGroup || isAdmins || isOwner) return;

        // Ignore messages from bot itself
        if (message.key && message.key.fromMe) return;

        // Check database kwa settings za group hii
        const db = readDB();
        let antiLinkEnabled;
        let mode;

        if (db[from] && typeof db[from].enabled !== 'undefined') {
            // Group ina settings zake
            antiLinkEnabled = db[from].enabled;
            mode = db[from].mode || 'delete';
        } else {
            // Tumia global config kwa makundi yasiyo na custom settings
            antiLinkEnabled = config.ANTI_LINK === "true" || config.ANTI_LINK === true;
            mode = config.LINK_ACTION || 'delete';
        }

        // Kama antilink imezimwa, acha kabisa
        if (!antiLinkEnabled) return;

        // Regex ya kutambua links zote
        const linkRegex = /((https?:\/\/|www\.)[^\s]+|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?)/gi;

        // Check kama message ina link
        if (linkRegex.test(body)) {
            
            // 1. FUTA LINK KWANZA (inafuta kabla ya kutoa warning)
            try {
                await client.sendMessage(from, { delete: message.key });
                console.log(`✅ Link deleted from ${sender} in ${from}`);
            } catch (delErr) {
                console.error('❌ Failed to delete message:', delErr);
            }

            // 2. KISHA LETA WARNING/ACTION (baada ya kufuta)
            if (mode === 'warn') {
                // Ongeza warning count
                warningCount[sender] = (warningCount[sender] || 0) + 1;
                const currentWarnings = warningCount[sender];
                const maxWarnings = config.LINK_WARN_LIMIT || 3;

                if (currentWarnings >= maxWarnings) {
                    // Imefikia limit - kick user
                    await client.sendMessage(from, { 
                        text: `🚫 @${sender.split("@")[0]} reached ${currentWarnings}/${maxWarnings} warnings and has been removed.\n\n> © Powered by Sila Tech`, 
                        mentions: [sender],
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: message });
                    
                    try {
                        await client.groupParticipantsUpdate(from, [sender], "remove");
                    } catch (kickErr) {
                        console.error('❌ Failed to kick user:', kickErr);
                    }
                    
                    // Reset warnings after kick
                    delete warningCount[sender];
                } else {
                    // Toa warning na mention mtumiaji
                    await client.sendMessage(from, { 
                        text: `⚠️ *LINK DETECTED!* @${sender.split("@")[0]}\n\n📊 Warning: ${currentWarnings}/${maxWarnings}\n🔒 Sending links is strictly prohibited!\n\n> © Powered by Sila Tech`, 
                        mentions: [sender],
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: message });
                }
            } 
            else if (mode === 'kick') {
                // Moja kwa moja kick
                await client.sendMessage(from, { 
                    text: `🚫 *LINK DETECTED!* @${sender.split("@")[0]} has been kicked for sending links.\n\n> © Powered by Sila Tech`, 
                    mentions: [sender],
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: message });
                
                try {
                    await client.groupParticipantsUpdate(from, [sender], "remove");
                } catch (kickErr) {
                    console.error('❌ Failed to kick user:', kickErr);
                }
            } 
            else if (mode === 'mute') {
                // Mute - inabidi uwe na mute system, kwa sasa ina notify tu
                await client.sendMessage(from, { 
                    text: `🔇 *LINK DETECTED!* @${sender.split("@")[0]} has been muted for sending links.\n\n> © Powered by Sila Tech`, 
                    mentions: [sender],
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: message });
            }
            else {
                // Delete only mode - tayari imefuta, unaweza kutoa notification ndogo
                await client.sendMessage(from, { 
                    text: `🗑️ Links are not allowed here! Message deleted.\n\n> © Powered by Sila Tech`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: message });
            }
        }
    } catch (error) {
        console.error("❌ Anti-link handler error:", error);
    }
});

// ==================== ANTI-LINK COMMAND (PER GROUP) ====================
cmd({
    pattern: "antilink",
    alias: ["alink", "blocklink", "linkblock"],
    desc: "Configure anti-link settings for this group",
    category: "group",
    react: "🔗",
    filename: __filename,
},
async (client, message, m, { isGroup, isAdmins, isOwner, from, sender, args, reply }) => {
    try {
        // Check kama ni group
        if (!isGroup) {
            return await client.sendMessage(from, { 
                text: "❌ This command can only be used in groups!\n\n> © Powered by Sila Tech",
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: message });
        }

        // Check admin au owner
        if (!isAdmins && !isOwner) {
            return await client.sendMessage(from, { 
                text: "🚫 This command is for admins only!\n\n> © Powered by Sila Tech",
                mentions: [sender],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: message });
        }

        const action = args[0]?.toLowerCase();
        
        // Soma database
        const db = readDB();
        
        // Kama group haina settings bado, create default
        if (!db[from]) {
            db[from] = {
                enabled: false,
                mode: 'delete'
            };
        }

        let statusText, reaction = "🔗", additionalInfo = "";

        // Ikiwa hakuna argument, onyesha status
        if (!action || action === 'status') {
            const currentSettings = db[from];
            statusText = `📌 *Anti-link Status*\n\n⚙️ Status: ${currentSettings.enabled ? "✅ *ENABLED*" : "❌ *DISABLED*"}\n🔧 Mode: *${currentSettings.mode || 'delete'}*\n\n📝 *Usage:*\n.antilink on - Enable anti-link\n.antilink off - Disable anti-link\n.antilink warn - Warn users\n.antilink kick - Kick users\n.antilink delete - Delete links only`;
            additionalInfo = `⚠️ Warning Limit: ${config.LINK_WARN_LIMIT || 3} warnings before kick`;
            reaction = "📊";
        } else {
            switch (action) {
                case 'on':
                case 'enable':
                case 'true':
                    db[from].enabled = true;
                    statusText = "✅ Anti-link has been *ENABLED* for this group!";
                    reaction = "✅";
                    additionalInfo = `🔧 Mode: ${db[from].mode || 'delete'}\n🛡️ All links will now be monitored`;
                    break;

                case 'off':
                case 'disable':
                case 'false':
                    db[from].enabled = false;
                    statusText = "❌ Anti-link has been *DISABLED* for this group!";
                    reaction = "❌";
                    additionalInfo = "🔓 Links are now allowed in this group";
                    break;

                case 'warn':
                    db[from].enabled = true;
                    db[from].mode = 'warn';
                    statusText = "⚠️ Anti-link mode set to *WARN*";
                    reaction = "⚠️";
                    additionalInfo = `Users will receive warnings\n📊 Limit: ${config.LINK_WARN_LIMIT || 3} warnings before kick`;
                    break;

                case 'kick':
                    db[from].enabled = true;
                    db[from].mode = 'kick';
                    statusText = "🚫 Anti-link mode set to *KICK*";
                    reaction = "🚫";
                    additionalInfo = "Users will be kicked immediately for sending links";
                    break;

                case 'delete':
                case 'del':
                    db[from].enabled = true;
                    db[from].mode = 'delete';
                    statusText = "🗑️ Anti-link mode set to *DELETE ONLY*";
                    reaction = "🗑️";
                    additionalInfo = "Links will be deleted without notification";
                    break;

                case 'mute':
                    db[from].enabled = true;
                    db[from].mode = 'mute';
                    statusText = "🔇 Anti-link mode set to *MUTE*";
                    reaction = "🔇";
                    additionalInfo = "Users will be muted for sending links";
                    break;

                default:
                    statusText = "❌ Invalid option!";
                    reaction = "❌";
                    additionalInfo = "Use: on, off, warn, kick, delete, status";
            }
        }

        // Save changes kwenye database
        writeDB(db);

        // Send response (using quoted message instead of fkontak)
        await client.sendMessage(from, {
            image: { url: "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg" },
            caption: `${statusText}\n${additionalInfo}\n\n> © Powered by Tyrex Tech`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363424973782944@newsletter',
                    newsletterName: '© TYREX 𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: message });  // 👈 Hapa inareply moja kwa moja kwa message ya mtumiaji

        // React to command
        try {
            await client.sendMessage(from, {
                react: { text: reaction, key: message.key }
            });
        } catch (reactErr) {
            console.error('❌ React error:', reactErr);
        }

    } catch (error) {
        console.error("❌ Anti-link command error:", error);
        await client.sendMessage(from, { 
            text: `⚠️ Error: ${error.message}\n\n> © Powered by Tyrex Tech`,
            mentions: [sender],
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: message });
    }
});
