module.exports = {
name: 'resenha',
description: 'Ativa/desativa o modo resenha no grupo',
category: 'dono',
aliases: ['modoresenha'],
async execute({ columbina, from, info, args, q, reply, isGroup, isDono, commandManager, prefix }) {
if (!isDono) return reply('❌ Apenas o dono pode usar este comando!')
if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos!')

const resenhaMap = commandManager.ResenhaAtiva

if (args[0] === 'on' || args[0] === '1' || args[0] === 'ativar') {
commandManager.ResenhaAtiva.set(from, true)
reply('✅ Modo resenha ATIVADO neste grupo!\n\nTodos os comandos da pasta resenha agora estão disponíveis!')
} else if (args[0] === 'off' || args[0] === '0' || args[0] === 'desativar') {
commandManager.ResenhaAtiva.set(from, false)
reply('❌ Modo resenha DESATIVADO neste grupo!')
} else {
const status = commandManager.ResenhaAtiva.get(from) ? 'ATIVADO' : 'DESATIVADO'
reply(`📊 Status do modo resenha: ${status}\n\nUse:\n${prefix}resenha on - Ativar\n${prefix}resenha off - Desativar`)
}
}
}
