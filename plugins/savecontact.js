const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions');

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
    pattern: 'savecontact',
    alias: ["vcf","scontact","savecontacts"],
    desc: 'gc vcard',
    category: 'tools',
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) {
            return reply("This command is for groups only.\n\n> ® Powered by Tyrex Tech");
        }

        if (!isOwner) {
            return reply("🚫 *This command is for the owner only*\n\n> ® Powered by Tyrex Tech");
        }

        let card = quoted || m;
        let cmiggc = groupMetadata;
        const { participants } = groupMetadata;

        let orgiggc = participants.map(a => a.id);
        let vcard = '';
        let noPort = 0;

        for (let a of cmiggc.participants) {
            vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${noPort++}] +${a.id.split("@")[0]}\nTEL;type=CELL;type=VOICE;waid=${a.id.split("@")[0]}:+${a.id.split("@")[0]}\nEND:VCARD\n`;
        }

        let nmfilect = './contacts.vcf';

        await conn.sendMessage(from, { 
            text: 'Saving ' + cmiggc.participants.length + ' participants contact',
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        fs.writeFileSync(nmfilect, vcard.trim());
        await sleep(2000);

        await conn.sendMessage(from, {
            document: fs.readFileSync(nmfilect), 
            mimetype: 'text/vcard', 
            fileName: 'tyrex_md.vcf', 
            caption: `╭┄┄┄🌸🌹 *CONTACTS SAVED* 🌹🌸┄┄┄⊷\n┃\n┃ Group Name: *${cmiggc.subject}*\n┃ Contacts: *${cmiggc.participants.length}*\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        fs.unlinkSync(nmfilect);

    } catch (err) {
        console.error("Savecontact error:", err);
        reply(err.toString());
    }
});