const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
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
  pattern: "newgc",
  category: "group",
  desc: "Create a new group and add participants.",
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, body, sender, groupMetadata, participants, reply }) => {
  try {
    if (!body) {
      return reply(`Usage: .newgc group_name;number1,number2,...\n\n> ® Powered by Tyrex Tech`);
    }

    const [groupName, numbersString] = body.split(";");

    if (!groupName || !numbersString) {
      return reply(`Usage: .newgc group_name;number1,number2,...\n\n> ® Powered by Tyrex Tech`);
    }

    const participantNumbers = numbersString.split(",").map(number => `${number.trim()}@s.whatsapp.net`);

    const group = await conn.groupCreate(groupName, participantNumbers);
    console.log('created group with id: ' + group.id);

    const inviteLink = await conn.groupInviteCode(group.id);

    await conn.sendMessage(group.id, { text: 'Hello there! Welcome to the new group! 🎉' });

    await conn.sendMessage(from, { 
      text: `✅ Group created successfully with invite link: https://chat.whatsapp.com/${inviteLink}\nWelcome message sent.\n\n> ® Powered by Tyrex Tech`, 
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

  } catch (e) {
    return reply(`An error occurred while processing your request.\n\nError: ${e.message}\n\n> ® Powered by Tyrex Tech`);
  }
});