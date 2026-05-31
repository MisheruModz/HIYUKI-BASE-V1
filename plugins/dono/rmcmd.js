const MenuSystem = require('../../arquivos/js/menuSystem.js')

module.exports = {
name: 'rmcmd',
description: 'Remove um comando do menu (mas continua funcionando)',
category: 'dono',
aliases: ['hidecmd', 'ocultarcmd'],
async execute({ columbina, from, info, args, q, reply, reagir, isDono, commandManager, prefix }) {
if (!isDono) return reply('❌ Apenas o dono pode usar este comando!')

if (!q && !args[0]) {
return reply(`❌ Use: ${prefix}rmcmd <nome_do_comando>

Exemplo: ${prefix}rmcmd play_audio

📌 O comando continuará funcionando normalmente,
   mas não aparecerá mais nos menus.`)
}

const nomeComando = (q || args[0]).toLowerCase()

let categoriaEncontrada = null
let comandoEncontrado = null

const categorias = ['admin', 'dono', 'cmds-aleatorios', 'resenha', 'downloads', 'efeitos', 'midias', 'inteligencia-ia', 'rpg', 'premium']

for (const cat of categorias) {
const comandos = commandManager.ObterComandosPorCategoria(cat)
const cmd = comandos.find(c => (c.name || c.originalName) === nomeComando)
if (cmd) {
categoriaEncontrada = cat
comandoEncontrado = cmd
break
}
}

if (!comandoEncontrado) {
return reply(`❌ Comando "${nomeComando}" não encontrado!`)
}

const menuSystem = new MenuSystem(commandManager)
const sucesso = menuSystem.ocultarComando(categoriaEncontrada, nomeComando)

if (sucesso) {
await reagir('✅')
await reply(`✅ Comando \`${prefix}${nomeComando}\` foi ocultado do menu!

📌 Ele continua funcionando normalmente
🔄 Use \`${prefix}rncmd ${nomeComando}\` para restaurar`)
} else {
reply(`❌ Comando já está oculto do menu!`)
}
}
}