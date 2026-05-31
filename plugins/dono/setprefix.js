const fs = require('fs')
const path = require('path')

module.exports = {
name: 'setprefix',
description: 'Altera o prefixo global do bot no config.json',
category: 'dono',
aliases: ['prefixo'],
async execute({ q, reply, isDono, prefix }) {
if (!isDono) return reply('❌ Apenas o dono pode usar este comando!')

const novoPrefix = q.trim()
if (!novoPrefix || novoPrefix.length !== 1) {
return reply('❌ Informe um único caractere para ser o novo prefixo global!\n\nExemplo: `!setprefix #`')
}

if (novoPrefix === prefix) {
return reply('❌ Este já é o prefixo global atual!')
}

try {
const configPath = path.resolve('./database/config.json')
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

config.prefix = novoPrefix
fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

return reply(`✅ *PREFIXO GLOBAL ALTERADO!*\n\n• Novo Prefixo: \`${novoPrefix}\`\n\nO bot será reiniciado em instantes para aplicar a mudança em todos os comandos.`)
} catch (e) {
return reply(`❌ Erro ao alterar o config.json: ${e.message}`)
}
}
}
