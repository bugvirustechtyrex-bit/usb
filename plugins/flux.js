 const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");

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
  pattern: "fluxai",
  alias: ["flux", "imagine"],
  react: "🚀",
  desc: "Generate an image using AI.",
  category: "ai",
  filename: __filename
}, async (conn, mek, m, { q, reply, from, sender }) => {
  try {
    if (!q) {
      return reply("Please provide a prompt for the image.\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendMessage(from, { 
      text: "> *CREATING IMAGE ...🔥*",
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Error: The API did not return a valid image. Try again later.\n\n> ® Powered by Tyrex Tech");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(from, {
      image: imageBuffer,
      caption: `🚀 *TYREX MD AI*\n✨ Prompt: *${q}*\n\n> ® Powered by Tyrex Tech`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

  } catch (error) {
    console.error("FluxAI Error:", error);
    reply(`An error occurred: ${error.message || "Unknown error"}\n\n> ® Powered by Tyrex Tech`);
  }
});

cmd({
  pattern: "stablediffusion",
  alias: ["sdiffusion", "imagine2"],
  react: "🚀",
  desc: "Generate an image using AI.",
  category: "ai",
  filename: __filename
}, async (conn, mek, m, { q, reply, from, sender }) => {
  try {
    if (!q) {
      return reply("Please provide a prompt for the image.\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendMessage(from, { 
      text: "> *CREATING IMAGE ...🔥*",
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const apiUrl = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Error: The API did not return a valid image. Try again later.\n\n> ® Powered by Tyrex Tech");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(from, {
      image: imageBuffer,
      caption: `🚀 *TYREX MD AI*\n✨ Prompt: *${q}*\n\n> ® Powered by Tyrex Tech`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

  } catch (error) {
    console.error("StableDiffusion Error:", error);
    reply(`An error occurred: ${error.message || "Unknown error"}\n\n> ® Powered by Tyrex Tech`);
  }
});

cmd({
  pattern: "stabilityai",
  alias: ["stability", "imagine3"],
  react: "🚀",
  desc: "Generate an image using AI.",
  category: "ai",
  filename: __filename
}, async (conn, mek, m, { q, reply, from, sender }) => {
  try {
    if (!q) {
      return reply("Please provide a prompt for the image.\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendMessage(from, { 
      text: "> *CREATING IMAGE ...🔥*",
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const apiUrl = `https://api.siputzx.my.id/api/ai/stabilityai?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Error: The API did not return a valid image. Try again later.\n\n> ® Powered by Tyrex Tech");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(from, {
      image: imageBuffer,
      caption: `🚀 *TYREX MD AI*\n✨ Prompt: *${q}*\n\n> ® Powered by Tyrex Tech`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

  } catch (error) {
    console.error("StabilityAI Error:", error);
    reply(`An error occurred: ${error.message || "Unknown error"}\n\n> ® Powered by Tyrex Tech`);
  }

});
