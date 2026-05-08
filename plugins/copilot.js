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
	timeout: 30000,
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		'Accept': 'application/json'
	}
};

async function getCopilotResponse(query) {
	const apiUrl = `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(query)}`;
	const res = await axios.get(apiUrl, AXIOS_DEFAULTS);
	if (res?.data?.status && res?.data?.result?.response) {
		return res.data.result.response;
	}
	throw new Error('No response from AI');
}

cmd({
	pattern: 'copilot',
	alias: ['ai', 'tyrexai', 'ask', 'query', 'gpt', 'tyrexcop'],
	react: '🤖',
	desc: 'Ask AI Copilot anything',
	category: 'Ai',
	filename: __filename
},
async (conn, mek, m, { from, sender, reply, q }) => {
	try {
		if (!q) {
			return reply(`╭┄┄┄🌸🌹 *TYREX MD AI COPILOT* 🌹🌸┄┄┄⊷\n┃ 🤖 Ask me anything\n┃\n┃ Use: .ai your question\n┃\n┃ Aliases:\n┃ • .ai\n┃ • .ask\n┃ • .copilot\n┃ • .tyrexai\n┃\n┃ Examples:\n┃ • .ai what is economics\n┃ • .ask how to learn programming\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
		}

		const thinkMsg = await conn.sendMessage(from, {
			text: `Thinking about your question...`
		}, { quoted: mek });

		let response;
		try {
			response = await getCopilotResponse(q);
		} catch (apiErr) {
			console.error('API Error:', apiErr);
			await conn.sendMessage(from, { delete: thinkMsg.key });
			return reply(`❌ Yupra AI API error\nTry again later\n\n> ® Powered by Tyrex Tech`);
		}

		if (!response) {
			await conn.sendMessage(from, { delete: thinkMsg.key });
			return reply(`❌ No response received\n\n> ® Powered by Tyrex Tech`);
		}

		let formattedResponse = response;
		if (response.length > 4096) {
			formattedResponse = response.substring(0, 4093) + '...';
		}

		const finalMsg = `╭┄┄┄🌸🌹 *TYREX MD COPILOT* 🌹🌸┄┄┄⊷\n┃ 🤖 Here's my answer:\n┃\n${formattedResponse.split('\n').map(line => `┃ ${line}`).join('\n')}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

		await conn.sendMessage(from, { delete: thinkMsg.key });
		await conn.sendMessage(from, {
			text: finalMsg,
			contextInfo: getContextInfo(sender)
		}, { quoted: mek });

	} catch (err) {
		console.error('Copilot error:', err);
		reply(`❌ Error processing command\nTry again\n\n> ® Powered by Tyrex Tech`);
	}
});

// Advanced copilot command with more options
cmd({
	pattern: 'aix',
	alias: ['copilotx', 'aiexplain', 'explain'],
	react: '🧠',
	desc: 'Advanced AI explanation',
	category: 'main',
	filename: __filename
},
async (conn, mek, m, { from, sender, reply, q }) => {
	try {
		if (!q) {
			return reply(`╭┄┄┄🌸🌹 *AI EXPLAIN* 🌹🌸┄┄┄⊷\n┃ 🧠 Ask me to explain anything\n┃\n┃ Use: .aix your topic\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
		}

		const prompt = `Explain this in detail: ${q}`;

		const loadMsg = await conn.sendMessage(from, {
			text: `Loading explanation...`
		}, { quoted: mek });

		let response;
		try {
			response = await getCopilotResponse(prompt);
		} catch (apiErr) {
			console.error('API Error:', apiErr);
			await conn.sendMessage(from, { delete: loadMsg.key });
			return reply(`❌ API error\n\n> ® Powered by Tyrex Tech`);
		}

		if (!response) {
			await conn.sendMessage(from, { delete: loadMsg.key });
			return reply(`❌ No results\n\n> ® Powered by Tyrex Tech`);
		}

		const explainMsg = `╭┄┄┄🌸🌹 *DETAILED EXPLANATION* 🌹🌸┄┄┄⊷\n┃\n${response.substring(0, 4000).split('\n').map(line => `┃ ${line}`).join('\n')}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

		await conn.sendMessage(from, { delete: loadMsg.key });
		await conn.sendMessage(from, {
			text: explainMsg,
			contextInfo: getContextInfo(sender)
		}, { quoted: mek });

	} catch (err) {
		console.error('AIX error:', err);
		reply(`❌ Error processing\n\n> ® Powered by Tyrex Tech`);
	}

});
