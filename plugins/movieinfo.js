const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');

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

const movieSelections = {};

cmd({
  pattern: "movieinfo",
  desc: "Search and download movies with selection",
  category: "media",
  react: "🎞️",
  filename: __filename
},
async (conn, mek, m, { from, args, sender, reply }) => {
  try {
    const query = args.join(" ");
    if (!query) {
      return reply("Please provide a movie name.\nExample: .movieinfo avatar\n\n> ® Powered by Tyrex Tech");
    }

    const searching = await conn.sendMessage(from, { 
      text: `🔍 *Searching for:* _${query}_ ...`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const res = await fetch(`https://movieapi.giftedtech.co.ke/api/search/${encodeURIComponent(query)}`);
    const json = await res.json();

    if (!json.results || !json.results.items || json.results.items.length === 0) {
      return reply(`No movies found for *${query}*\n\n> ® Powered by Tyrex Tech`);
    }

    const results = json.results.items.slice(0, 5);

    let textMsg = `╭┄┄┄🌸🌹 *MOVIE FINDER* 🌹🌸┄┄┄⊷\n┃\n┃ *Results for:* _${query}_\n┃\n┃ Reply with a number *(1-5)* to choose a movie.\n┃\n`;

    results.forEach((v, i) => {
      textMsg += `┃ *${i + 1}. ${v.title}* (${v.year})\n`;
    });

    textMsg += `┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

    movieSelections[sender] = results;

    await conn.sendMessage(from, {
      text: textMsg,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

  } catch (e) {
    console.log(e);
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
  }
});

// LISTENER FOR USER NUMBER REPLY (1–5)
cmd({
  on: "text",
},
async (conn, mek, m, { from, body, sender, reply }) => {
  try {
    if (!movieSelections[sender]) return;

    const msg = body.trim();
    const choice = parseInt(msg);

    if (isNaN(choice) || choice < 1 || choice > 5) return;

    const selectedMovie = movieSelections[sender][choice - 1];
    delete movieSelections[sender];

    const movieId = selectedMovie.subjectId;

    const info = await fetch(`https://movieapi.giftedtech.co.ke/api/info/${movieId}`);
    const infoJson = await info.json();
    const subject = infoJson.results.subject;

    const src = await fetch(`https://movieapi.giftedtech.co.ke/api/sources/${movieId}`);
    const srcJson = await src.json();
    const sources = srcJson.results;

    if (!sources || sources.length === 0) {
      return reply(`No download available for *${subject.title}*\n\n> ® Powered by Tyrex Tech`);
    }

    const best = sources.sort((a, b) => parseInt(b.quality) - parseInt(a.quality))[0];

    await conn.sendMessage(from, {
      image: { url: subject.cover },
      caption:
        `╭┄┄┄🌸🌹 *MOVIE INFO* 🌹🌸┄┄┄⊷\n┃\n┃ *${subject.title}*\n┃\n┃ 📆 Released: ${subject.releaseDate}\n┃ ⭐ Rating: ${subject.rating}\n┃ ⏳ Duration: ${Math.floor(subject.duration / 60)} min\n┃\n┃ 📝 Description:\n┃ ${subject.description}\n┃\n┃ 📺 Selected Quality: ${best.quality}\n┃\n┃ Preparing your download... ⬇️\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    await conn.sendMessage(from, {
      document: { url: best.download_url },
      mimetype: "application/octet-stream",
      fileName: `${subject.title}-${best.quality}.mp4`,
      caption: `🎞️ *${subject.title}* • ${best.quality}\n\n> ® Powered by Tyrex Tech`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

  } catch (e) {
    console.log(e);
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
  }
});