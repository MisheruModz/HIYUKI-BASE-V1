/*   ⚠ ANTES DE TUDO QUERO QUE LEMBRE QUE NAO DEIXO DAREM CONTINUIDADE NA COLUMBINA NEM NA HIYUKI, POIS A COLUMBINA É MINHA BOT ATUAL QUE JÁ ESTÁ NA V2 QUE INCLUSIVE ESSA É A VERSÃO BASE DELA. JÁ A HIYUKI É OUTRA BOT MINHA QUE USEI PRA TEMA DA BASE E PRETENDO DAR CONTINUIDADE POR EU MESMO! ENTÃO USE A BASE PARA FAZER SEU PRÓPRIO BOT COM SEU PRÓPRIO TEMA. ⚠️

            HIYUKI SUPREME V1 

[=====/=====/=====/=====/=====/=====/=====/]
Uma base de bot criada totalmente do zero por mim, MisheruModz</>, focada em desempenho, organizacao e facilidade na criacao de comandos via plugins.

A estrutura foi desenvolvida para deixar tudo mais simples e pratico, permitindo adicionar novas funcoes sem baguncar o sistema. Cada comando funciona em modulos/plugins independentes, deixando a base mais limpa, rapida e facil de editar.

Uma base feita para quem quer criar e evoluir sua bot sem complicacao.

Tudo que peço é que deixem os direitos autorais da base usada na criação do seu/sua bot e o devido criador da base vulgo MisheruModz</>

Criador: MisheruModz</>
Numero: +55 12 98804-7370

Faça um bom proveito da base 😉🌸
[=====/=====/=====/=====/=====/=====/=====/]
*/
const fs = require('fs')
const path = require('path')
const colors = require('colors')
const moment = require('moment')
const { exec } = require('child_process')
const chokidar = require('chokidar')
const axios = require('axios')

const config = JSON.parse(fs.readFileSync('./database/config.json'))
const GerenciadorDeCmds = require('./comandos.js')
const startConnection = require('./conexao.js')
const { AddWhatsAppuser, convertWhatsAppUser, getname } = require('./arquivos/js/userManager.js')
const { getGroupAdmins, getMembros, getPhoneNumberFromId, getMemberName, getFileBuffer, sleep, fetchJson, getRandom, addNumberMais, identArroba, inputToJid } = require('./arquivos/js/exports.js')
const { CyanLog, RedLog, GreenLog } = require('./arquivos/js/logger.js')
const { sendImageAsSticker2, sendVideoAsSticker2 } = require('./arquivos/js/exif2.js')

const gerenciadorComandos = new GerenciadorDeCmds()
gerenciadorComandos.carregarPlugins()

const donoJid = identArroba(config.NumeroDoDono)

let columbina = null

/*MONITORAMENTO DE ARQUIVOS CRÍTICOS (REINICIA O BOT)*/
const criticalFiles = [
'./index.js',
'./database/config.json',
'./conexao.js',
'./arquivos/js/exports.js',
'./comandos.js',
'./arquivos/js/userManager.js',
'./arquivos/js/logger.js',
'./arquivos/js/exif2.js'
]

const criticalWatcher = chokidar.watch(criticalFiles, { 
persistent: true, 
ignoreInitial: true,
awaitWriteFinish: true
})

criticalWatcher.on('change', (filePath) => {
const fileName = path.basename(filePath)
CyanLog(`❄️Arquivo critico alterado: ${fileName}`)
CyanLog(`🌸 Reiniciando Hiyuki em 2 segundos para aplicar mudancas...`) 

if (columbina) {
try {
const donoId = donoJid || (columbina.user?.id?.split(':')[0] + '@s.whatsapp.net')
columbina.sendMessage(donoId, {text: `🔄 *ARQUIVO CRITICO ALTERADO*\n\n📁 Arquivo: \`${fileName}\`\n⏰ Hiyuki sera reiniciada em 2 segundos.\n\n📌 Use \`sh start.sh\` ou \`sh start.sh cod\` para iniciar novamente.` 
}).catch(() => {})
} catch(e) {}
}

setTimeout(() => {
CyanLog(`🧊 Encerrando processo para reiniciar...`)
process.exit(0)
}, 2000)
})

criticalWatcher.on('add', (filePath) => {
if (criticalFiles.includes(filePath)) {
CyanLog(`📁 Arquivo crítico adicionado: ${path.basename(filePath)}`)
setTimeout(() => process.exit(0), 2000)
}
})

criticalWatcher.on('unlink', (filePath) => {
if (criticalFiles.includes(filePath)) {
CyanLog(`🗑️ Arquivo critico removido: ${path.basename(filePath)}`)
setTimeout(() => process.exit(0), 2000)
}
})

/*CHOKIDAR PARA PLUGINS*/
const watcher = chokidar.watch('./plugins', { 
persistent: true, 
ignoreInitial: true,
depth: 99,
awaitWriteFinish: true
})

watcher.on('add', (filePath) => {
if (filePath.endsWith('.js')) {
CyanLog(`📁 Plugin adicionado: ${path.basename(filePath)}`)
Object.keys(require.cache).forEach(key => {
if (key.includes(filePath)) delete require.cache[key]
})
gerenciadorComandos.carregarPlugins()
}
})

watcher.on('change', (filePath) => {
if (filePath.endsWith('.js')) {
CyanLog(`📝 Plugin alterado: ${path.basename(filePath)}`)
Object.keys(require.cache).forEach(key => {
if (key.includes(filePath)) delete require.cache[key]
})
gerenciadorComandos.carregarPlugins()
}
})

watcher.on('unlink', (filePath) => {
if (filePath.endsWith('.js')) {
CyanLog(`🗑️ Plugin removido: ${path.basename(filePath)}`)
gerenciadorComandos.carregarPlugins()
}
})

/*LOGS COLORIDOS*/
const logMessage = (type, data) => {
const agora = new Date()
const dataStr = agora.toLocaleDateString('pt-BR')
const horaStr = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

const logTemplate = (nome, grupo, pv, comando, mensagem) => {
const NomeColorido = `\x1b[34m${nome}\x1b[0m`
const GrupoColorido = grupo ? `\x1b[32m${grupo}\x1b[0m` : ''
const PvColorido = pv ? `\x1b[34mPV\x1b[0m` : ''
const ComandoColorido = comando ? `\x1b[33m${comando}\x1b[0m` : ''
const MensagemColorida = mensagem ? `\x1b[34m${mensagem}\x1b[0m` : ''
const DataColorida = `\x1b[34m${dataStr}\x1b[0m`
const HoraColorida = `\x1b[34m${horaStr}\x1b[0m`

if (type === 'comando_grupo') {
console.log(`
╭──────────────────᯽
│🌕╭─────────────ᝰ
│🌕│NOME: ${NomeColorido}
│🌕│GRUPO: ${GrupoColorido}
│🌕│COMANDO: ${ComandoColorido}
│🌕│DATA: ${DataColorida}
│🌕│HORA: ${HoraColorida}
│🌕╰────────────ᝰ
╰──────────────────᯽`)
} else if (type === 'comando_pv') {
console.log(`
╭──────────────────᯽
│🌕╭─────────────ᝰ
│🌕│NOME: ${NomeColorido}
│🌕│PV: ${PvColorido}
│🌕│COMANDO: ${ComandoColorido}
│🌕│DATA: ${DataColorida}
│🌕│HORA: ${HoraColorida}
│🌕╰────────────ᝰ
╰──────────────────᯽`)
} else if (type === 'msg_grupo') {
console.log(`
╭──────────────────᯽
│🌕╭─────────────ᝰ
│🌕│NOME: ${NomeColorido}
│🌕│GRUPO: ${GrupoColorido}
│🌕│MENSAGEM: ${MensagemColorida}
│🌕│DATA: ${DataColorida}
│🌕│HORA: ${HoraColorida}
│🌕╰────────────ᝰ
╰──────────────────᯽`)
} else if (type === 'msg_pv') {
console.log(`
╭──────────────────᯽
│🌕╭─────────────ᝰ
│🌕│NOME: ${NomeColorido}
│🌕│PV: ${PvColorido}
│🌕│MENSAGEM: ${MensagemColorida}
│🌕│DATA: ${DataColorida}
│🌕│HORA: ${HoraColorida}
│🌕╰────────────ᝰ
╰──────────────────᯽`)
}
}

if (type === 'comando_grupo') {
logTemplate(data.nome, data.grupo, null, data.comando, null)
} else if (type === 'comando_pv') {
logTemplate(data.nome, null, 'PV', data.comando, null)
} else if (type === 'msg_grupo') {
logTemplate(data.nome, data.grupo, null, null, data.mensagem)
} else if (type === 'msg_pv') {
logTemplate(data.nome, null, 'PV', null, data.mensagem)
}
}

const AudioMisheru = async (source, quotedMsg, from) => {
if (!columbina || !from) return
try {
if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')
let inputFile
if (source.includes("http")) {
const response = await axios({ url: source, method: 'GET', responseType: 'arraybuffer' })
inputFile = `./temp/src_${Date.now()}.mp3`
fs.writeFileSync(inputFile, response.data)
} else {
inputFile = path.resolve(source)
}
const outputFile = `./temp/voice_${Date.now()}.ogg`
await new Promise((resolve, reject) => {
exec(`ffmpeg -i "${inputFile}" -vn -c:a libopus -b:a 128k "${outputFile}"`, (err) => {
if (err) return reject(err)
resolve()
})
})
const audioBuffer = fs.readFileSync(outputFile)
await columbina.sendMessage(from, {audio: audioBuffer, mimetype: 'audio/ogg; codecs=opus', ptt: true}, {quoted: quotedMsg})
if (inputFile.includes('./temp/') && fs.existsSync(inputFile)) fs.unlinkSync(inputFile)
if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile)
} catch (err) { RedLog(`AudioMisheru error: ${err}`) }
}

const reagir = async (emj, from, info) => {
if (!columbina || !from) return
try {
await columbina.sendMessage(from, {react: {text: emj, key: info.key}})
} catch (e) {}
}

const reply = (text, from, info) => {
if (!columbina || !from) return
columbina.sendMessage(from, {text}, {quoted: info})
}

const enviar = reply

const mencionarIMG = async (teks, Url, ms, from, columbina) => {
let memberr = []
let vy = teks.includes('\n') ? teks.split('\n') : [teks]
for (let vz of vy) {
for (let zn of vz.split(' ')) {
if (zn.includes('@')) memberr.push(identArroba(zn.split('@')[1]))
}
}
await columbina.sendMessage(from, {image: {url: Url}, caption: teks.trim(), mentions: memberr}, {quoted: ms})
}

const getBotNumber = () => columbina?.user?.id?.split(':')[0] || ''

const isDono = (sender) => {
const senderNum = sender?.split('@')[0]
const donoNum = donoJid?.split('@')[0]
return senderNum === donoNum
}

const isAdm = (sender, groupAdmins) => {
if (isDono(sender)) return true
return groupAdmins?.includes(sender) || false
}

process.on('uncaughtException', (err) => RedLog(`Uncaught Exception: ${err.message}`))
process.on('unhandledRejection', (reason) => RedLog(`Unhandled Rejection: ${reason}`))

async function processMessage(upsert, conn) {
columbina = conn

const isBotLigado = global.botLigado !== undefined ? global.botLigado : true

const messages = upsert.messages
const info = messages[0]

if (!info.message || info.key?.fromMe) return

const pushname = info.pushName || 'Usuário'
const from = info.key.remoteJid
const isGroup = from?.endsWith('@g.us') || false
const type = Object.keys(info.message)[0]

const botNumber = getBotNumber()

let prefix = config.prefix
if (isGroup) {
const groupPrefix = gerenciadorComandos.ObterPrefixoGrupo(from)
if (groupPrefix) prefix = groupPrefix
}

const quotedMsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
const isQuotedSticker = !!quotedMsg?.stickerMessage
const isQuotedImage = !!quotedMsg?.imageMessage
const isQuotedVideo = !!quotedMsg?.videoMessage
const isQuotedAudio = !!quotedMsg?.audioMessage
const isQuotedDocument = !!quotedMsg?.documentMessage

let body = ""

try {
body =
info.message?.conversation || info.message?.extendedTextMessage?.text || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || info.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || info.message?.viewOnceMessageV2?.message?.imageMessage?.caption || info.message?.viewOnceMessageV2?.message?.videoMessage?.caption || info.message?.viewOnceMessage?.message?.imageMessage?.caption || info.message?.viewOnceMessage?.message?.videoMessage?.caption || info.message?.buttonsResponseMessage?.selectedButtonId || info.message?.listResponseMessage?.singleSelectReply?.selectedRowId || info.message?.templateButtonReplyMessage?.selectedId || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || info.message?.editedMessage?.message?.protocolMessage?.editedMessage?.imageMessage?.caption || JSON.parse(info.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || '{}')?.id || JSON.parse(info.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || '{}')?.selectedId || info?.text ||
""
} catch {
body = ""
}

const bodyOriginal = body || ""

const budy = bodyOriginal
.normalize('NFD')
.replace(/[\u0300-\u036f]/g,'')

const sender = info?.key?.participantAlt || info?.key?.remoteJidAlt || conn?.user?.id || info?.key?.participant || info?.key?.remoteJid

let groupMetadata = null
let groupName = ''
let groupDesc = ''
let groupMembers = []
let groupAdmins = []
let somembros = []
let isBotGroupAdmins = false
let isGroupAdmins = false

try {
if (isGroup) {
groupMetadata = await columbina.groupMetadata(from)
groupName = groupMetadata.subject
groupDesc = groupMetadata.desc || ''
groupMembers = groupMetadata.participants
groupAdmins = getGroupAdmins(groupMembers)
somembros = getMembros(groupMembers)

const botNumberPure = botNumber.split('@')[0].replace(/[^0-9]/g, '')
isBotGroupAdmins = groupAdmins.some(admin => {
const adminPure = admin.toString().split('@')[0].replace(/[^0-9]/g, '')
return adminPure === botNumberPure
})

const senderPure = sender.split('@')[0].replace(/[^0-9]/g, '')
isGroupAdmins = groupAdmins.some(admin => {
const adminPure = admin.toString().split('@')[0].replace(/[^0-9]/g, '')
return adminPure === senderPure
})

if (isDono(sender)) {
isGroupAdmins = true
}
}
} catch (e) {
console.log('Erro ao pegar metadata do grupo:', e)
}

await AddWhatsAppuser(columbina, info)

/*SISTEMA DE EVAL*/

if (
budy.startsWith('>') &&
!budy.startsWith('>>') &&
!budy.startsWith('(>')
) {
if (!isDono(sender)) return
try {
const evalCode = budy.slice(1).trim()
if (!evalCode) return
let result = eval(evalCode)
if (result instanceof Promise) {
result = await result
}
let output =
typeof result === 'object'
? JSON.stringify(result, null, 2)
: String(result)
if (output === undefined) output = 'undefined'
if (output === '') output = '(empty)'
await reply(output, from, info)
await reagir('✅', from, info)
} catch (e) {
await reply(e.stack || e.message, from, info)
await reagir('❌', from, info)
}
return
}

if (budy.startsWith('(>')) {
if (!isDono(sender)) return
try {
const evalCode = budy.slice(2).trim()
if (!evalCode) return
const asyncResult = await eval(`(async () => {
${evalCode}
})()`)
if (asyncResult !== undefined) {
let output =
typeof asyncResult === 'object'
? JSON.stringify(asyncResult, null, 2)
: String(asyncResult)
if (output === undefined) output = 'undefined'
if (output === '') output = '(empty)'
await reply(output, from, info)
} else {
await reply('executado', from, info)
}
await reagir('✅', from, info)
} catch (e) {
await reply(e.stack || e.message, from, info)
await reagir('❌', from, info)
}
return
}
/*FIM DO SISTEMA DE EVAL*/

const isCommand = bodyOriginal.startsWith(prefix)

if (!isCommand) {
if (isGroup) {
logMessage('msg_grupo', {
nome: pushname,
grupo: groupName,
mensagem: body.length > 50 ? body.substring(0, 50) + '...' : body
})
} else {
logMessage('msg_pv', {
nome: pushname,
mensagem: body.length > 50 ? body.substring(0, 50) + '...' : body
})
}
return
}

const fullCommand = bodyOriginal.slice(prefix.length)
const args = fullCommand.split(' ')
const command = (args.shift() || '').toLowerCase()
const q = args.join(' ')
let qOriginal = ''
try {
const bodyOriginal = 
info.message?.conversation || info.message?.extendedTextMessage?.text || info.message?.imageMessage?.caption || info.message?.videoMessage?.caption || ""

if (bodyOriginal && bodyOriginal.startsWith(prefix)) {
const fullCommandOriginal = bodyOriginal.slice(prefix.length)
const argsOriginal = fullCommandOriginal.split(' ')
argsOriginal.shift()
qOriginal = argsOriginal.join(' ')
}
} catch(e) {
qOriginal = q
}

/*LOG DE COMANDO*/
if (isGroup) {
logMessage('comando_grupo', {
nome: pushname,
grupo: groupName,
comando: command
})
} else {
logMessage('comando_pv', {
nome: pushname,
comando: command
})
}

if (!isBotLigado && !isDono(sender)) {
return reply('❄️Hiyuki esta desligada! Apenas o dono pode usar comandos.', from, info)
}

const targetPlugin = gerenciadorComandos.ObterComando(command)

if (!targetPlugin) {

await AudioMisheru(
'./arquivos/audio/cmdinexistente.mp3',
info,
from
).catch(() => {})

await columbina.sendMessage(
from,
{
image: {
url: './arquivos/imagem/menu.jpg'
},
caption:
`╭𓆩˚༺🧊༻˚₊𓆩🌸𓆪₊˚༺🧊༻˚𓆪╮
      𝐂𝐎𝐌𝐀𝐍𝐃𝐎 𝐈𝐍𝐄𝐗𝐈𝐒𝐓𝐄𝐍𝐓𝐄 

  👤 User: @${pushname}
  ⭕ Comando usado: ${command || 'Nenhum'}
  💡 Utilize: ${prefix}menu
  
╰𓆩˚༺🧊༻˚₊𓆩🌸𓆪₊˚༺🧊༻˚𓆪╯`,
mentions: [sender],

contextInfo: {
forwardingScore: 100000,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: '120363403916707447@newsletter',
newsletterName: '🎐 𝗖𝗢𝗟𝗨𝗠𝗕𝗜𝗡𝗔 ᝰ 𝗛𝗬𝗣𝗢𝗦𝗘𝗟𝗘𝗡𝗜𝗔 🎐',
serverMessageId: -1
}
}}, {quoted: info})
return
}

const isOwnerCmd = targetPlugin.category === 'dono'
const isAdminCmd = targetPlugin.category === 'admin'
const isResenhaCmd = targetPlugin.category === 'resenha'
const isPremiumCmd = targetPlugin.category === 'premium'

if (isOwnerCmd && !isDono(sender)) {
return reply('🌸 Este comando é apenas para o dono do bot!', from, info)
}

if (isAdminCmd && !isGroup) {
return reply('🧊 Este comando só pode ser usado em grupos!', from, info)
}

if (isAdminCmd && !isGroupAdmins && !isDono(sender)) {
return reply('❄️ Este comando é apenas para administradores do grupo!', from, info)
}

if (isResenhaCmd && !gerenciadorComandos.ResenhaAtiva(from)) {
return reply('🎐 O modo resenha não está ativo neste grupo!', from, info)
}

if (isPremiumCmd && !gerenciadorComandos.isPremium(sender, donoJid)) {
return reply('🎐🧧 Este comando é apenas para usuarios premium!', from, info)
}

if (targetPlugin.needBotAdmin && !isBotGroupAdmins) {
return reply('🌸🎐 Hiyuki precisa ser administradora do grupo para executar este comando!\n\nAdicione Hiyuki como ADMIN no grupo e tente novamente.', from, info)
}

try {
await targetPlugin.execute({
columbina, from, info, args, q, qOriginal, command, prefix,
reply: (text) => reply(text, from, info),
enviar: (text) => reply(text, from, info),
reagir: (emj) => reagir(emj, from, info),
mencionarIMG: (teks, Url) => mencionarIMG(teks, Url, info, from, columbina),
AudioMisheru: (source) => AudioMisheru(source, info, from),
isGroup, isDono: () => isDono(sender), 
isAdm: isGroupAdmins, 
isBotAdm: isBotGroupAdmins,
sender, pushname, groupName, groupDesc, groupMembers, groupAdmins,
botNumber, donoJid, getFileBuffer, sleep, fetchJson, getRandom,
getMemberName, getPhoneNumberFromId, convertWhatsAppUser, getname,
isQuotedSticker, isQuotedImage, isQuotedVideo, isQuotedAudio, isQuotedDocument,
commandManager: gerenciadorComandos, config, inputToJid
})
} catch (err) {
RedLog(`Erro no comando ${command}: ${err.message}`)
reply(`🧊 Erro ao executar comando: ${err.message}`, from, info)
}
}

async function main() {
columbina = await startConnection(gerenciadorComandos, config)

if (!columbina) {
RedLog('Vish pae, falha ao conectar')
setTimeout(main, 5000)
return
}

columbina.ev.on('messages.upsert', async (upsert) => {
if (upsert.type === 'notify' || upsert.type === 'append') {
await processMessage(upsert, columbina)
}
})
}

main()