module.exports = {
name: 'grupo',
description: 'Abre ou fecha o grupo (só admins enviam mensagens)',
category: 'admin',
aliases: ['group'],
async execute({ columbina, from, args, reply, reagir, isGroup, isAdm, isBotAdm, isDono }) {
if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos!')
if (!isAdm && !isDono) return reply('❌ Apenas administradores podem usar este comando!')
if (!isBotAdm) return reply('❌ O bot precisa ser administrador para isso!')
await reagir('🌓')
if (args[0] === 'a' || args[0] === 'abrir') {
await columbina.groupSettingUpdate(from, 'not_announcement')
reply('✅ Grupo aberto com sucesso! Todos podem enviar mensagens.')
} else if (args[0] === 'f' || args[0] === 'fechar') {
await columbina.groupSettingUpdate(from, 'announcement')
reply('✅ Grupo fechado com sucesso! Apenas administradores podem enviar mensagens.')
} else {
reply('Use: grupo a (abrir) ou grupo f (fechar)')
}
}
}