/*
SAIBA QUE AQUI VC PODE ALTERAR O ESTILO DO MENU! SÓ FAÇA ISSO SE SOUBER OQ VC MESMO ESTÁ FAZENDO.
*/
const fs = require('fs')
const path = require('path')

class MenuSystem {
constructor(commandManager) {
this.commandManager = commandManager
this.hiddenCommandsFile = './arquivos/json/commandos_ocultos.json'
this.carregarComandosOcultos()
}

carregarComandosOcultos() {
try {
if (fs.existsSync(this.hiddenCommandsFile)) {
this.hiddenCommands = JSON.parse(fs.readFileSync(this.hiddenCommandsFile))
} else {
this.hiddenCommands = {}
fs.writeFileSync(this.hiddenCommandsFile, JSON.stringify({}, null, 2))
}
} catch (e) {
this.hiddenCommands = {}
}
}

salvarComandosOcultos() {
fs.writeFileSync(this.hiddenCommandsFile, JSON.stringify(this.hiddenCommands, null, 2))
}

ocultarComando(categoria, nomeComando) {
if (!this.hiddenCommands[categoria]) {
this.hiddenCommands[categoria] = []
}
if (!this.hiddenCommands[categoria].includes(nomeComando)) {
this.hiddenCommands[categoria].push(nomeComando)
this.salvarComandosOcultos()
return true
}
return false
}

restaurarComando(categoria, nomeComando) {
if (this.hiddenCommands[categoria]) {
const index = this.hiddenCommands[categoria].indexOf(nomeComando)
if (index !== -1) {
this.hiddenCommands[categoria].splice(index, 1)
this.salvarComandosOcultos()
return true
}
}
return false
}

isComandoOculto(categoria, nomeComando) {
return this.hiddenCommands[categoria] && this.hiddenCommands[categoria].includes(nomeComando)
}

getCommandsByFolder(folderName) {
const todosComandos = this.commandManager.ObterComandosPorCategoria(folderName)
return todosComandos.filter(cmd => {
const nomeCmd = cmd.name || cmd.originalName
return !this.isComandoOculto(folderName, nomeCmd)
})
}

gerarMenuCustom(commands, prefix, titulo, icone) {
if (!commands || commands.length === 0) {
return `╭${icone}─━⛩─━❄━─⛩━─${icone}╮

    『 𝗛𝗜𝗬𝗨𝗞𝗜 𝗦𝗨𝗣𝗥𝗘𝗠𝗘 𝐕𝟏 』

╰${icone}─━⛩─━❄━─⛩━─${icone}╯
        ❱❱ ${titulo} ❰❰
╭${icone}━─━─━─${icone}─━─━─━─${icone}╮
│❄╭─⛩༺ヒユキ༻⛩─╮
│❄│ ❌ NENHUM COMANDO
│❄╰─⛩༺ヒユキ༻⛩─╯
╰${icone}━─━─━─${icone}─━─━─━─${icone}╯`
}

let output = `╭${icone}─━⛩─━❄━─⛩━─${icone}╮

    『 𝗛𝗜𝗬𝗨𝗞𝗜 𝗦𝗨𝗣𝗥𝗘𝗠𝗘 𝐕𝟏 』

╰${icone}─━⛩─━❄━─⛩━─${icone}╯
        ❱❱ ${titulo} ❰❰
╭${icone}━─━─━─${icone}─━─━─━─${icone}╮
│❄╭─⛩༺ヒユキ༻⛩─╮`

for (let i = 0; i < commands.length; i++) {
const cmd = commands[i]
const nomeComando = cmd.name || cmd.originalName
output += `\n│❄│${prefix}${nomeComando}`
}

output += `\n│❄╰─⛩༺ヒユキ༻⛩─╯
╰${icone}━─━─━─${icone}─━─━─━─${icone}╯`

return output
}

gerarMenuDesigner(commands, prefix, titulo, iconeEsq = '🌸', iconeDir = '🌸') {
if (!commands || commands.length === 0) {
return `╭${iconeEsq}─━⛩─━❄━─⛩━─${iconeDir}╮

    『 𝗛𝗜𝗬𝗨𝗞𝗜 𝗦𝗨𝗣𝗥𝗘𝗠𝗘 𝐕𝟏 』

╰${iconeEsq}─━⛩─━❄━─⛩━─${iconeDir}╯
        ❱❱ ${titulo} ❰❰
╭${iconeEsq}━─━─━─${iconeEsq}─━─━─━─${iconeDir}╮
│❄╭─⛩༺ヒユキ༻⛩─╮
│❄│ ❌ NENHUM COMANDO
│❄╰─⛩༺ヒユキ༻⛩─╯
╰${iconeEsq}━─━─━─${iconeEsq}─━─━─━─${iconeDir}╯`
}

let output = `╭${iconeEsq}─━⛩─━❄━─⛩━─${iconeDir}╮

    『 𝗛𝗜𝗬𝗨𝗞𝗜 𝗦𝗨𝗣𝗥𝗘𝗠𝗘 𝐕𝟏 』

╰${iconeEsq}─━⛩─━❄━─⛩━─${iconeDir}╯
        ❱❱ ${titulo} ❰❰
╭${iconeEsq}━─━─━─${iconeEsq}─━─━─━─${iconeDir}╮
│❄╭─⛩༺ヒユキ༻⛩─╮`

for (let i = 0; i < commands.length; i++) {
const cmd = commands[i]
const nomeComando = cmd.name || cmd.originalName
output += `\n│❄│${prefix}${nomeComando}`
}

output += `\n│❄╰─⛩༺ヒユキ༻⛩─╯
╰${iconeEsq}━─━─━─${iconeEsq}─━─━─━─${iconeDir}╯`

return output
}
}

module.exports = MenuSystem