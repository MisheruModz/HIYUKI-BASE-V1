const fs = require('fs')
const path = require('path')

module.exports = {
name: 'bemvindo',
description: 'Ativa/desativa ou configura a mensagem de boas-vindas no grupo',
category: 'admin',
aliases: ['welcome', 'boasvindas', 'w'],

async execute({ columbina, from, info, args, q, reply, reagir, isGroup, isAdm, isDono, prefix }) {

if (!isGroup) return reply('❌ Este comando so pode ser usado em grupos!')
if (!isAdm && !isDono) return reply('❌ Apenas administradores podem usar este comando!')

const welkonPath = './arquivos/json/welkon.json'
const legendasPath = './arquivos/json/legendas.json'

if (!fs.existsSync(welkonPath)) fs.writeFileSync(welkonPath, JSON.stringify([]))
if (!fs.existsSync(legendasPath)) fs.writeFileSync(legendasPath, JSON.stringify({}))

let welcomeGroups = JSON.parse(fs.readFileSync(welkonPath))
let legendas = JSON.parse(fs.readFileSync(legendasPath))

const subCommand = (args[0] || '').toLowerCase()

if (subCommand === 'on' || subCommand === '1' || subCommand === 'ativar') {
if (welcomeGroups.includes(from)) {
return reply('🌕 Sistema de boas-vindas ja esta ATIVO neste grupo!')
}

welcomeGroups.push(from)
fs.writeFileSync(welkonPath, JSON.stringify(welcomeGroups, null, 2))

await reagir('✅')
await reply(`🌕 SISTEMA DE BOAS-VINDAS ATIVADO!

🎐 Uma mensagem de boas-vindas sera enviada quando novos membros entrarem.
🎐 Uma mensagem de despedida sera enviada quando membros sairem.

Para personalizar a legenda, use: ${prefix}bemvindo legenda Sua mensagem aqui`)

} else if (subCommand === 'off' || subCommand === '0' || subCommand === 'desativar') {
if (!welcomeGroups.includes(from)) {
return reply('❄️ Sistema de boas-vindas ja esta DESATIVADO neste grupo!')
}

welcomeGroups = welcomeGroups.filter(grupo => grupo !== from)
fs.writeFileSync(welkonPath, JSON.stringify(welcomeGroups, null, 2))

await reagir('✅')
await reply('❄️ SISTEMA DE BOAS-VINDAS DESATIVADO!\n\nNao enviarei mais mensagens de entrada/saida.')

} else if (subCommand === 'legenda' || subCommand === 'set' || subCommand === 'definir') {
const novaMsg = q || args.slice(1).join(' ')

if (!novaMsg || novaMsg.trim() === '') {
if (legendas[from]) {
delete legendas[from]
fs.writeFileSync(legendasPath, JSON.stringify(legendas, null, 2))
await reagir('✅')
await reply(`📝 LEGENDA PERSONALIZADA REMOVIDA!\n\nAgora sera usada a mensagem padrao: "Bem-vindo(a) ao grupo!"`)
} else {
await reply(`📝 Nenhuma legenda personalizada esta ativa no momento!\n\nUse: ${prefix}bemvindo legenda Sua mensagem aqui`)
}
return
}

if (novaMsg.length > 300) {
return reply('❌ A mensagem deve ter no maximo 300 caracteres!')
}

legendas[from] = novaMsg
fs.writeFileSync(legendasPath, JSON.stringify(legendas, null, 2))

await reagir('✅')
await reply(`📝 LEGENDA PERSONALIZADA DEFINIDA!\n\nNova mensagem:\n"${novaMsg}"\n\nExemplo de uso quando alguem entrar:\n@usuario, ${novaMsg}`)

} else if (subCommand === 'test' || subCommand === 'testar') {
const legendaAtual = legendas[from] || 'Bem-vindo(a) ao grupo!'
const testJid = info.key.participant || info.key.remoteJid
const numeroTeste = testJid.split('@')[0]

await columbina.sendMessage(from, {
image: { url: 'https://files.catbox.moe/mjxxwp.jpeg' },
caption: `╭᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╮
            𝗕𝗲𝗺-𝘃𝗶𝗻𝗱𝗼(𝗮):
@${numeroTeste}!

*Legenda:* ${legendaAtual}

╰᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╯`,
mentions: [testJid]
})

await reagir('✅')

} else if (subCommand === 'status') {
const ativo = welcomeGroups.includes(from) ? '✅ ATIVADO' : '❌ DESATIVADO'
const legendaAtual = legendas[from] || 'Bem-vindo(a) ao grupo! (padrao)'

await reply(`📊 STATUS DO SISTEMA DE BOAS-VINDAS

🔘 Estado: ${ativo}
📝 Legenda: "${legendaAtual}"

COMANDOS DISPONIVEIS:
▸ ${prefix}bemvindo on - Ativar
▸ ${prefix}bemvindo off - Desativar
▸ ${prefix}bemvindo legenda <msg> - Definir legenda
▸ ${prefix}bemvindo legenda - Remover legenda personalizada
▸ ${prefix}bemvindo test - Testar mensagem
▸ ${prefix}bemvindo status - Ver status atual`)

} else {
const ativo = welcomeGroups.includes(from) ? 'ATIVADO' : 'DESATIVADO'
const legendaAtual = legendas[from] || 'Bem-vindo(a) ao grupo! (padrao)'

await reply(`🌕 SISTEMA DE BOAS-VINDAS

Status atual: ${ativo}
Legenda atual: "${legendaAtual}"

📌 COMANDOS:
▸ ${prefix}bemvindo on - Ativar
▸ ${prefix}bemvindo off - Desativar
▸ ${prefix}bemvindo legenda <msg> - Mudar legenda
▸ ${prefix}bemvindo legenda - Remover legenda
▸ ${prefix}bemvindo test - Testar legenda
▸ ${prefix}bemvindo status - Status completo

Exemplo: ${prefix}bemvindo legenda Seja muito bem-vindo(a)! 🌸`)
}
}
}