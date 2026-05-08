const { cmd } = require('../command');
const axios = require('axios');

const getContextInfo = (sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

const AXIOS_DEFAULTS = {
    timeout: 45000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
    }
};

// Main think command
cmd({
    pattern: "think",
    alias: ["copilot-think", "deepthink", "reasoning", "analyze", "consider", "ponder"],
    react: "🧠",
    desc: "Deep AI thinking and analysis",
    category: "ai",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, q, l }) => {
    try {
        if (!q || !q.trim()) {
            return reply(`╭┄┄┄🌸🌹 *DEEP AI THINKER* 🌹🌸┄┄┄⊷\n┃ 🧠 Ask questions deeply\n┃\n┃ Use: .think your question\n┃\n┃ Aliases:\n┃ • .think\n┃ • .deepthink\n┃ • .reasoning\n┃ • .analyze\n┃\n┃ Examples:\n┃ • .think Is AI a consciousness?\n┃ • .analyze How light affects plants\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
        }

        const thinkMsg = await conn.sendMessage(from, {
            text: `🧠 Deep thinking...\n⏳ Please wait for analysis...`
        }, { quoted: mek });

        try {
            const apiUrl = `https://api.yupra.my.id/api/ai/copilot-think?text=${encodeURIComponent(q.trim())}`;
            const response = await axios.get(apiUrl, AXIOS_DEFAULTS);

            if (!response.data) {
                throw new Error('No response from API');
            }

            let aiResponse = response.data.response || response.data.result || response.data.data || response.data.message || JSON.stringify(response.data);

            if (aiResponse.length > 4096) {
                aiResponse = aiResponse.substring(0, 4090) + '...';
            }

            const formattedResponse = aiResponse
                .split('\n')
                .map(line => `┃ ${line}`)
                .join('\n');

            const finalMsg = `╭┄┄┄🌸🌹 *AI DEEP ANALYSIS* 🌹🌸┄┄┄⊷\n┃\n${formattedResponse}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

            await conn.sendMessage(from, { delete: thinkMsg.key });

            await conn.sendMessage(from, {
                text: finalMsg,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });

        } catch (apiErr) {
            console.error('API Error:', apiErr);
            await conn.sendMessage(from, { delete: thinkMsg.key });

            let errorMsg = 'AI ANALYSIS ERROR';

            if (apiErr.response?.status === 429) {
                errorMsg = 'Rate limited - wait a minute';
            } else if (apiErr.response?.status === 500) {
                errorMsg = 'AI malfunctioning';
            } else if (apiErr.code === 'ECONNABORTED') {
                errorMsg = 'Request timed out';
            }

            return reply(errorMsg);
        }

    } catch (e) {
        console.error('Think command error:', e);
        reply(`ANALYSIS ERROR\n\nTry again later`);
        if (l) l(e);
    }
});

// Multi-step reasoning command
cmd({
    pattern: "reason",
    alias: ["logic", "explain", "breakdown", "steps"],
    react: "🔍",
    desc: "Step-by-step reasoning and logic",
    category: "ai",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, q, l }) => {
    try {
        if (!q || !q.trim()) {
            return reply(`╭┄┄┄🌸🌹 *STEP-BY-STEP REASONING* 🌹🌸┄┄┄⊷\n┃ 🔍 Analyze questions step by step\n┃\n┃ Use: .reason complex question\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
        }

        const loadMsg = await conn.sendMessage(from, {
            text: `🔍 Analyzing...\n⏳ Breaking down steps...`
        }, { quoted: mek });

        try {
            const reasonPrompt = `Explain this step by step with clear reasoning: ${q.trim()}`;
            const apiUrl = `https://api.yupra.my.id/api/ai/copilot-think?text=${encodeURIComponent(reasonPrompt)}`;
            const response = await axios.get(apiUrl, AXIOS_DEFAULTS);

            if (!response.data) {
                throw new Error('No response from API');
            }

            let aiResponse = response.data.response || response.data.result || response.data.data || response.data.message || JSON.stringify(response.data);

            if (aiResponse.length > 4096) {
                aiResponse = aiResponse.substring(0, 4090) + '...';
            }

            const formattedResponse = aiResponse
                .split('\n')
                .map(line => `┃ ${line}`)
                .join('\n');

            const finalMsg = `╭┄┄┄🌸🌹 *STEP-BY-STEP ANALYSIS* 🌹🌸┄┄┄⊷\n┃\n${formattedResponse}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

            await conn.sendMessage(from, { delete: loadMsg.key });

            await conn.sendMessage(from, {
                text: finalMsg,
                contextInfo: getContextInfo(sender)
            }, { quoted: mek });

        } catch (apiErr) {
            console.error('API Error:', apiErr);
            await conn.sendMessage(from, { delete: loadMsg.key });
            return reply(`ANALYSIS ERROR\nTry again`);
        }

    } catch (e) {
        console.error('Reason command error:', e);
        reply(`ERROR`);
        if (l) l(e);
    }
});