// Command ya kujifanya bot iwe admin (kama inawezekana)
cmd({
    pattern: "makebotadmin",
    alias: ["botadmin"],
    react: "🤖",
    desc: "Make bot admin (if you are group owner)",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, sender, isCreator, botNumber, reply}) => {
try{
    if (!isGroup) return;
    
    // Check if sender is group owner or super admin
    const groupMetadata = await conn.groupMetadata(from);
    const isOwner = groupMetadata.owner === sender || groupMetadata.owner === sender.split('@')[0];
    
    if (!isOwner && !isCreator) {
        return await conn.sendMessage(from, {
            text: `❌ Only group owner can make bot admin`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    const botJid = botNumber + '@s.whatsapp.net';
    
    // Try to make bot admin
    await conn.groupParticipantsUpdate(from, [botJid], 'promote');
    
    await conn.sendMessage(from, {
        text: `✅ Bot has been made admin successfully!`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
    await conn.sendMessage(from, {
        text: `❌ Failed to make bot admin. Please do it manually.`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
}
});
