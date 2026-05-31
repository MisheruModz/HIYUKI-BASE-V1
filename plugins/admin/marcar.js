module.exports = {
name: 'marcar',
description: 'Marca todos os membros do grupo',
category: 'admin',
aliases: ['tagall', 'todos'],
async execute({ columbina, from, info, args, q, reply, isGroup, isAdm, isDono, groupMembers, sender }) {
if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos!')
if (!isAdm && !isDono) return reply('❌ Apenas administradores podem usar este comando!')
const membros = groupMembers.filter(m => !m.admin).map(m => m.id || m.jid || m.lid)
if (!membros.length) return reply('❌ O grupo só possui administradores!')
let texto = `🌙 *Marcando membros do grupo*`
if (q) texto += `\n\n📝 *Mensagem:* ${q}\n`
texto += `\n${membros.map(u => `» @${u?.split('@')[0] || u}`).join("\n")}`
await columbina.sendMessage(from, { text: texto, mentions: membros }, { quoted: info })
}
}