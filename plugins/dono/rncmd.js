const MenuSystem = require('../../arquivos/js/menuSystem.js')

module.exports = {
name: 'rncmd',
description: 'Restaura um comando oculto no menu',
category: 'dono',
aliases: ['showcmd', 'restaurarcmd', 'unhidecmd'],
async execute({ columbina, from, info, args, q, reply, reagir, isDono, commandManager, prefix }) {
if (!isDono) return reply('❌ Apenas o dono pode usar este comando!')

if (!q && !args[0]) {
return reply(`❌ Use: ${prefix}rncmd <nome_do_comando>

Exemplo: ${prefix}rncmd play_audio

📌 O comando voltará a aparecer nos menus.`)
}

const nomeComando = (q || args[0]).toLowerCase()

let categoriaEncontrada = null

const menuSystem = new MenuSystem(commandManager)

for (const [categoria, comandos] of Object.entries(menuSystem.hiddenCommands)) {
if (comandos.includes(nomeComando)) {
categoriaEncontrada = categoria
}
}

if (!categoriaEncontrada) {
return reply(`❌ Comando "${nomeComando}" não está oculto no momento!`)
}

const sucesso = menuSystem.restaurarComando(categoriaEncontrada, nomeComando)

if (sucesso) {
await reagir('✅')
await reply(`✅ Comando \`${prefix}${nomeComando}\` foi restaurado ao menu!

📌 Agora ele aparece normalmente nos menus.`)
} else {
reply(`❌ Erro ao restaurar o comando!`)
}
}
}