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
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const NodeCache = require('node-cache')
const readline = require('readline')
const pino = require('pino')
const fs = require('fs')
const path = require('path')
const colors = require('colors')
const moment = require('moment')
const { CyanLog, GreenLog, RedLog, MagentaLog } = require('./arquivos/js/logger.js')

const msgRetryCounterCache = new NodeCache()
const groupCache = new NodeCache({ stdTTL: 300, useClones: false })
const AUTH_DIR = './database/Hiyuki-QR'

if (!fs.existsSync('./temp')) fs.mkdirSync('./temp', { recursive: true })
if (!fs.existsSync('./database/users')) fs.mkdirSync('./database/users', { recursive: true })
if (!fs.existsSync('./arquivos/json')) fs.mkdirSync('./arquivos/json', { recursive: true })
if (!fs.existsSync('./plugins')) {
for (const cat of ['admin', 'dono', 'cmds-aleatorios', 'resenha', 'downloads', 'efeitos', 'midias', 'inteligencia-ia', 'rpg']) {
fs.mkdirSync(`./plugins/${cat}`, { recursive: true })
}
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

/*VARIAVEL PARA CONTROLAR REINICIALIZACAO*/
let isReconnecting = false
let reconnectTimer = null

async function startConnection(NucleoDeCmds, config) {

if (isReconnecting) {
CyanLog('🌸❄️Reconexão já em andamento, aguarde...')
return null
}

isReconnecting = true
  
const usePairingCode = process.argv.includes('--code')
const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)
const { version } = await fetchLatestBaileysVersion()
const logger = pino({ level: 'silent' })

const columbina = makeWASocket({
version, logger,
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, logger)
},
printQRInTerminal: !usePairingCode,
browser: Browsers.windows('Chrome'),
msgRetryCounterCache,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
emitOwnEvents: true,
fireInitQueries: false,
generateHighQualityLinkPreview: true,
markOnlineOnConnect: true,
syncFullHistory: false,
cachedGroupMetadata: async (jid) => groupCache.get(jid),
getMessage: async (key) => {
return undefined
}
})

if (usePairingCode && !state.creds.registered) {
let phoneNumber = await question('Digite o numero do WhatsApp no qual vc conectará a bot (com DDD, ex: 5512988047370):')
phoneNumber = phoneNumber.replace(/\D/g, '')
if (!phoneNumber || phoneNumber.length < 12) {
  console.log(colors.red('Numero invalido! Use formato tipo: 5512988047370'))
  process.exit(0)
}
console.log(colors.yellow(`Solicitando codigo para: ${phoneNumber}`))
let code = await columbina.requestPairingCode(phoneNumber)
code = code?.match(/.{1,4}/g)?.join('-') || code
console.log(colors.green(`Codigo de pareamento: ${code}`))
rl.close()
}

columbina.ev.on('creds.update', saveCreds)

columbina.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect, qr } = update
if (qr && !usePairingCode) {
console.log(colors.yellow('QR Code gerado, escaneie com o WhatsApp:'))
const qrcode = require('qrcode-terminal')
qrcode.generate(qr, { small: true })
}

if (connection === 'open') {
GreenLog(`✅ ${config.NomeDoBot} conectado com sucesso!`)
const botNumber = columbina.user.id.split(':')[0]
GreenLog(`📱 Bot Numero: ${botNumber}`)
  
if (!fs.existsSync('./arquivos/json/welkon.json')) {
fs.writeFileSync('./arquivos/json/welkon.json', JSON.stringify([]))
}
if (!fs.existsSync('./arquivos/json/legendas.json')) {
fs.writeFileSync('./arquivos/json/legendas.json', JSON.stringify({}))
}
  
/*Reseta flag de reconexao quando conecta*/
isReconnecting = false
if (reconnectTimer) {
clearTimeout(reconnectTimer)
reconnectTimer = null
}
}

if (connection === 'close') {
const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode
RedLog(`Conexao fechada - Codigo: ${statusCode}`)

if (statusCode !== DisconnectReason.loggedOut) {
RedLog('🌸 Reiniciando a Hiyuki Supreme em 3 segundos devido a falha na conexao... 🔄')

/*Isso aqui abaixo foi uma tentativa de enviar uma mensagem de aviso para o dono se possivel. Mas falhou miseravelmente... Claro, dava pra eu arrumar pra isso de fato acontecer, mas deu preguiça! então vai ficar assim msm.*/
try {
const donoJid = config.NumeroDoDono?.replace(/\D/g, '') + '@s.whatsapp.net'
await columbina.sendMessage(donoJid, {text: `⚠️ *HIYUKI SUPREME REINICIANDO*\n\nMotivo: Conexao fechada (codigo ${statusCode})\n⏰ A Hiyuki sera reiniciada automaticamente em 3 segundos.`
}).catch(() => {})
} catch(e) {}

/*se existir, limpa timer anterior*/
if (reconnectTimer) clearTimeout(reconnectTimer)

/*Aguarda 3 segundos e REINICIA O PROCESSO INTEIRO*/
reconnectTimer = setTimeout(() => {
CyanLog('🌸🧧Encerrando processo para reiniciar completamente...')
process.exit(0)/* sai do processo - o start.sh reiniciara automaticamente*/
}, 3000)
} else {
RedLog('🌸🧊 Sessao expirada! Exclua a pasta Hiyuki-QR e reinicie a Hiyuki manualmente.')
RedLog('❄️Reiniciando para gerar novo QR Code em 5 segundos...')

if (reconnectTimer) clearTimeout(reconnectTimer)
reconnectTimer = setTimeout(() => {
process.exit(0)
}, 5000)
}
}
})

/*EVENTO DE GRUPO*/
columbina.ev.on('group-participants.update', async (update) => {
const { id, participants, action } = update

if (!fs.existsSync('./arquivos/json/welkon.json')) return
const welcomeGroups = JSON.parse(fs.readFileSync('./arquivos/json/welkon.json'))
if (!welcomeGroups.includes(id)) return

if (participants[0] === columbina.user.id?.split(':')[0]) return

let groupMetadata
try {
groupMetadata = await columbina.groupMetadata(id)
} catch (e) { return }

const legendasPath = './arquivos/json/legendas.json'

let legendas = {}
if (fs.existsSync(legendasPath)) {
legendas = JSON.parse(fs.readFileSync(legendasPath))
}

const legenda = legendas[id] || 'Bem-vindo(a) ao grupo!'

const part = participants[0]
const jid = part?.phoneNumber || part?.id || part?.jid
if (!jid) return
const numeroParticipante = jid.split("@")[0]

if (action === 'add') {
await columbina.sendMessage(id, {
image: { url: 'https://files.catbox.moe/mjxxwp.jpeg' },
caption: `╭᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╮
            𝗕𝗲𝗺-𝘃𝗶𝗻𝗱𝗼(𝗮):
@${numeroParticipante}!

*Legenda:* ${legenda}

╰᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╯`,
mentions: [jid]
})
} else if (action === 'remove') {
await columbina.sendMessage(id, {
image: { url: 'https://files.catbox.moe/9i38ij.jpeg' },
caption: `╭᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╮
            *SAYŌNARA*
@${numeroParticipante}

╰᯽༊·˚༊·˚˚₊‧꒰ა ᯽ ໒꒱ ‧₊˚˚༊·˚༊᯽╯`,
mentions: [jid]
})
}
})

isReconnecting = false
return columbina
}

module.exports = startConnection