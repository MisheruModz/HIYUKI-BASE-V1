module.exports = {
name: 'sair',
description: 'Faz o bot sair do grupo',
category: 'dono',
aliases: ['leave'],
async execute({ columbina, from, reply, isGroup, isDono }) {
if (!isDono) return reply('❌ Apenas o dono pode usar este comando!')
if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos!')
await reply('🌕 Saindo do grupo... Até mais!')
await columbina.groupLeave(from)
}
}