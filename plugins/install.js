 const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

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

// Plugin Install Command
cmd({
  pattern: 'install',
  alias: ['addplugin','installplugin'],
  react: '📥',
  desc: 'Install plugins from Gist URLs',
  category: 'plugin',
  filename: __filename,
  use: '<gist_url>',
  owner: true
}, async (conn, mek, m, { reply, args, from, sender }) => {
  try {
    const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!args[0]) {
      return reply(`Please provide a Gist URL\nExample: *${config.PREFIX}install https://gist.github.com/username/gistid*\n\n> ® Powered by Tyrex Tech`);
    }

    const url = args[0];
    const gistId = url.match(/(?:\/|gist\.github\.com\/)([a-fA-F0-9]+)/)?.[1];
    if (!gistId) {
      return reply('Invalid Gist URL format\n\n> ® Powered by Tyrex Tech');
    }

    const { data } = await axios.get(`https://api.github.com/gists/${gistId}`);
    
    const jsFile = Object.values(data.files).find(f => f.filename.endsWith('.js'));
    if (!jsFile) {
      return reply('No JavaScript file found in Gist\n\n> ® Powered by Tyrex Tech');
    }

    const pluginsDir = path.join(__dirname, '..', 'plugins');
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir);
    }

    const pluginPath = path.join(pluginsDir, jsFile.filename);
    if (fs.existsSync(pluginPath)) {
      return reply(`Plugin *${jsFile.filename}* already exists!\nUse *${config.PREFIX}pluginlist* to see plugin list\n\n> ® Powered by Tyrex Tech`);
    }

    await fs.promises.writeFile(pluginPath, jsFile.content);
    
    await conn.sendMessage(from, { 
      text: `✅ Plugin *${jsFile.filename}* installed successfully!\n\nUse *${config.PREFIX}restart* to load it\n\n> ® Powered by Tyrex Tech`, 
      contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
    }, { quoted: mek });

  } catch (error) {
    console.error('Install error:', error);
    reply(`Failed to install plugin:\n${error.message}\n\nMake sure:\n1. Gist exists and is public\n2. URL is correct\n\n> ® Powered by Tyrex Tech`);
  }
});

// Plugin List Command
cmd({
  pattern: 'pluginlist',
  alias: ['listplugins'],
  react: '✳️',
  desc: 'List installed plugins',
  category: 'plugin',
  filename: __filename
}, async (conn, mek, m, { reply, from, sender }) => {
  try {
    const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    const pluginsDir = path.join(__dirname, '..', 'plugins');
    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));
    
    if (!files.length) {
      return reply('No plugins installed\n\n> ® Powered by Tyrex Tech');
    }
    
    let msg = '📋 *Installed Plugins*:\n\n';
    files.forEach((file, i) => {
      msg += `${i+1}. ${file}\n`;
    });
    
    msg += `\nTotal: ${files.length} plugins\n\n> ® Powered by Tyrex Tech`;
    
    await conn.sendMessage(from, { 
      text: msg,
      contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
    }, { quoted: mek });
    
  } catch (error) {
    reply('Failed to list plugins\n\n> ® Powered by Tyrex Tech');
  }
});

// Plugin Delete Command
cmd({
  pattern: 'deleteplugin',
  alias: ['removeplugin', 'uninstall'],
  react: '🗑️',
  desc: 'Delete an installed plugin',
  category: 'plugin',
  filename: __filename,
  use: '<plugin_name>',
  owner: true
}, async (conn, mek, m, { reply, args, from, sender }) => {
  try {
    const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!args[0]) {
      return reply(`Please specify a plugin name\nExample: *${config.PREFIX}deleteplugin example.js*\n\n> ® Powered by Tyrex Tech`);
    }

    let pluginName = args[0];
    if (!pluginName.endsWith('.js')) pluginName += '.js';

    const pluginsDir = path.join(__dirname, '..', 'plugins');
    const pluginPath = path.join(pluginsDir, pluginName);

    if (!fs.existsSync(pluginPath)) {
      return reply(`Plugin *${pluginName}* not found\nUse *${config.PREFIX}pluginlist* to see installed plugins\n\n> ® Powered by Tyrex Tech`);
    }

    fs.unlinkSync(pluginPath);
    
    await conn.sendMessage(from, { 
      text: `✅ Plugin *${pluginName}* deleted successfully!\n\nUse *${config.PREFIX}restart* to apply changes\n\n> ® Powered by Tyrex Tech`, 
      contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
    }, { quoted: mek });

  } catch (error) {
    console.error('Delete plugin error:', error);
    reply(`Failed to delete plugin:\n${error.message}\n\n> ® Powered by Tyrex Tech`);
  }
});
