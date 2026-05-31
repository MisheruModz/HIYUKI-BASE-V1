module.exports = {
name: 'info',
description: 'Mostra informações detalhadas de um comando',
category: 'cmds-aleatorios',
aliases: ['cmdinfo', 'comandoinfo', 'sobre'],
async execute({ columbina, from, info, args, q, reply, reagir, prefix, commandManager }) {
if (!q && !args[0]) {
return reply(`❌ Use: ${prefix}info <nome_do_comando>

Exemplo: ${prefix}info ban

📌 Mostra descrição e detalhes do comando.`)
}

const nomeComando = (q || args[0]).toLowerCase()

let comandoEncontrado = null
let categoriaEncontrada = null

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

const nomeExibicao = comandoEncontrado.name || comandoEncontrado.originalName
const descricao = comandoEncontrado.description || 'Sem descrição'
const aliases = comandoEncontrado.aliases || []
const precisaBotAdmin = comandoEncontrado.needBotAdmin || false

let output = `╭🌸─━⛩─━❄━─⛩━─🌸╮

    『 ℹ️ INFO COMANDO 』

╰🌸─━⛩─━❄━─⛩━─🌸╯
        ❱❱ ${prefix}${nomeExibicao} ❰❰
╭🌸━─━─━─🌸─━─━─━─🌸╮
│❄╭─⛩༺ヒユキ༻⛩─╮
│❄│ 📝 Nome: ${nomeExibicao}
│❄│ 📂 Categoria: ${categoriaEncontrada}`

if (aliases.length > 0) {
output += `\n│❄│ 🔄 Aliases: ${aliases.map(a => `${prefix}${a}`).join(', ')}`
}

output += `\n│❄│ 📖 Descrição: ${descricao}`

if (precisaBotAdmin) {
output += `\n│❄│ ⚠️ Precisa ser admin: Sim`
}

output += `\n│❄│ 💡 Exemplo: ${prefix}${nomeExibicao}
│❄╰─⛩༺ヒユキ༻⛩─╯
╰🌸━─━─━─🌸─━─━─━─🌸╯`

await reagir('ℹ️')
await reply(output, from, info)
}
}