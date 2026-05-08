const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

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

const OWNER_PATH = path.join(__dirname, "../assets/sudo.json");

const ensureOwnerFile = () => {
  if (!fs.existsSync(OWNER_PATH)) {
    fs.writeFileSync(OWNER_PATH, JSON.stringify([]));
  }
};

// Command: Add a temporary owner
cmd({
    pattern: "setsudo",
    alias: ["addsudo", "addowner"],
    desc: "Add a temporary owner",
    category: "owner",
    react: "😇",
    filename: __filename
}, async (conn, mek, m, { from, args, q, isCreator, reply, sender }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";

        if (!isCreator) {
            return reply("_❗This Command Can Only Be Used By My Owner!_\n\n> ® Powered by Tyrex Tech");
        }

        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        if (!target) {
            return reply("Please provide a number or tag/reply a user.\n\n> ® Powered by Tyrex Tech");
        }

        ensureOwnerFile();
        let owners = JSON.parse(fs.readFileSync(OWNER_PATH, "utf-8"));

        if (owners.includes(target)) {
            return reply("This user is already a temporary owner.\n\n> ® Powered by Tyrex Tech");
        }

        owners.push(target);
        const uniqueOwners = [...new Set(owners)];
        fs.writeFileSync(OWNER_PATH, JSON.stringify(uniqueOwners, null, 2));

        const successMsg = "✅ Successfully Added User As Temporary Owner";

        await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg" },
            caption: `${successMsg}\n\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("Error: " + err.message + "\n\n> ® Powered by Tyrex Tech");
    }
});

// Command: Remove a temporary owner
cmd({
    pattern: "delsudo",
    alias: ["delowner", "deletesudo"],
    desc: "Remove a temporary owner",
    category: "owner",
    react: "🫩",
    filename: __filename
}, async (conn, mek, m, { from, args, q, isCreator, reply, sender }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";

        if (!isCreator) {
            return reply("_❗This Command Can Only Be Used By My Owner!_\n\n> ® Powered by Tyrex Tech");
        }

        let target = m.mentionedJid?.[0] 
            || (m.quoted?.sender ?? null)
            || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");

        if (!target) {
            return reply("Please provide a number or tag/reply a user.\n\n> ® Powered by Tyrex Tech");
        }

        ensureOwnerFile();
        let owners = JSON.parse(fs.readFileSync(OWNER_PATH, "utf-8"));

        if (!owners.includes(target)) {
            return reply("User not found in owner list.\n\n> ® Powered by Tyrex Tech");
        }

        const updated = owners.filter(x => x !== target);
        fs.writeFileSync(OWNER_PATH, JSON.stringify(updated, null, 2));

        const successMsg = "✅ Successfully Removed User As Temporary Owner";

        await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg" },
            caption: `${successMsg}\n\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("Error: " + err.message + "\n\n> ® Powered by Tyrex Tech");
    }
});

// Command: List all temporary owners
cmd({
    pattern: "listsudo",
    alias: ["listowner"],
    desc: "List all temporary owners",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply, sender }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";

        if (!isCreator) {
            return reply("_❗This Command Can Only Be Used By My Owner!_\n\n> ® Powered by Tyrex Tech");
        }

        ensureOwnerFile();
        let owners = JSON.parse(fs.readFileSync(OWNER_PATH, "utf-8"));
        owners = [...new Set(owners)];

        if (owners.length === 0) {
            return reply("No temporary owners found.\n\n> ® Powered by Tyrex Tech");
        }

        let listMessage = "`🤴 List of Sudo Owners:`\n\n";
        owners.forEach((owner, i) => {
            listMessage += `${i + 1}. ${owner.replace("@s.whatsapp.net", "")}\n`;
        });

        listMessage += "\n> ® Powered by Tyrex Tech";

        await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg" },
            caption: listMessage,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });

    } catch (err) {
        console.error(err);
        reply("Error: " + err.message + "\n\n> ® Powered by Tyrex Tech");
    }
});