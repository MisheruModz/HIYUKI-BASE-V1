module.exports = {
name: 'setprefixgp',
description: 'Altera o prefixo do bot APENAS neste grupo específico',
category: 'dono',
aliases: ['prefixgp'],
async execute({ columbina, from, info, args, q, reply, isGroup, isDono, commandManager, prefix }) {
if (!isDono) return reply('❌ Apenas o dono pode usar este comando!')
if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos!')

if (!q || args[0] === 'reset') {
const removido = commandManager.RemoverPrefixoGrupo(from)
if (removido) {
return reply(`✅ Prefixo personalizado REMOVIDO deste grupo!\n\nVoltou ao padrão: \`${prefix}\``)
} else {
return reply(`❌ Este grupo não possui um prefixo personalizado.`)
}
}

const novoPrefix = (q || args[0]).trim()
if (novoPrefix.length !== 1) {
return reply('❌ O prefixo deve ser um único caractere!\n\nExemplos: `!`, `#`, `$`, `%`, `&`, `/`')
}
if (novoPrefix === prefix) {
return reply(`❌ Este já é o prefixo padrão!\n\nPara remover o personalizado, use: \`${prefix}setprefixgp reset\``)
}
const sucesso = commandManager.DefinirPrefixoGrupo(from, novoPrefix)
if (sucesso) {
await reply(`✅ Prefixo deste grupo alterado com sucesso!\n\n• Prefixo ANTIGO: \`${prefix}\`\n• Prefixo NOVO: \`${novoPrefix}\`\n\nUse \`${novoPrefix}menu\` para ver os comandos!\n\n⚠️ Os outros grupos continuam com o prefixo padrão \`${prefix}\``)
} else {
reply('❌ Erro ao alterar o prefixo!')
}
}
}