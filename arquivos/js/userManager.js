const fs = require('fs')
const path = require('path')
const colors = require('colors')
const { CyanLog, GreenLog, RedLog, YellowLog } = require('./logger.js')

const userDir = './database/users'
if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true })

let allGroups = []
try {
if (fs.existsSync('../json/grupos.json')) {
let file = fs.readFileSync('../json/grupos.json','utf-8')
allGroups = file ? JSON.parse(file) : []
}
} catch (e) {
RedLog('Erro ao ler grupos.json: ' + e)
allGroups = []
}

const WhatsAppName = lid => `./database/users/${lid}.json`

function pushnames() {
const folderPath = WhatsAppName('teste').split('/teste.json')[0]
const allData = []
try {
const files = fs.readdirSync(folderPath)
const jsonFiles = files.filter(file => file.endsWith('.json'))
jsonFiles.forEach(file => {
const filePath = path.join(folderPath,file)
const fileContent = fs.readFileSync(filePath,'utf8')
try {
if (!fileContent) return
const jsonData = JSON.parse(fileContent)
allData.push(jsonData)
} catch(e) {
RedLog(`Erro ao fazer parse ${file}: ${e}`)
}
})
return allData
} catch (err) {
RedLog(`Erro ao ler pasta pushnames: ${err}`)
return []
}
}

const existsLidData = (lid,type='lid') => {
let jid = lid
if(type === 'lid') {
return fs.existsSync(WhatsAppName(lid))
} else if(type === 'jid') {
let list = pushnames()
if(list.length <= 0) return false
let data = list.filter(push => push.jid === jid)
return data.length > 0
}
return false
}

const userLid = (lid,type='lid') => {
let jid = lid
if(type === 'lid') {
try {
let file = fs.readFileSync(WhatsAppName(lid),'utf-8')
return file ? JSON.parse(file) : {}
} catch(e) {
RedLog('Erro ao ler user JSON: ' + e)
return {}
}
} else if(type === 'jid') {
let list = pushnames()
if(list.length <= 0) return false
let data = list.filter(push => push.jid === jid)
return data[0]
}
return {}
}

const convertWhatsAppUser = (testArray,type='jid') => {
if(testArray == undefined) return

let lidArray = Array.isArray(testArray) ? testArray : [testArray]
let finish = []

let onlyid = allGroups.flatMap(flat => flat.participants)
let someid = [...new Map(onlyid.map(o => [o.jid,o])).values()]

lidArray.forEach(lid => {
let detection = lid.endsWith('@lid') ? 'lid' : 'jid'
let jid = lid
let toseejson = false

let datauser = detection === 'lid'
? someid.filter(m => m.lid === lid)
: someid.filter(m => m.jid === jid)

if(datauser.length > 0) {
if(type === 'lid') finish.push(datauser[0].lid)
else if(type === 'jid') finish.push(datauser[0].jid)
else toseejson = true
} else {
toseejson = true
}

if(toseejson) {
let fromFile = existsLidData(lid,detection)
? userLid(lid,detection)
: { jid,lid }

if(type === 'lid') finish.push(fromFile.lid)
else if(type === 'jid') finish.push(fromFile.jid)
else finish.push(lid)
}
})

return Array.isArray(testArray) ? finish : finish[0]
}

function saveUserID(data,lid) {
let user = convertWhatsAppUser(lid,'lid')
fs.writeFileSync(WhatsAppName(user),JSON.stringify(data,null,2))
}

const templidpath = WhatsAppName('teste').split('teste')[0] + 'templid.json'

function saveTempLid(id) {
fs.writeFileSync(templidpath,JSON.stringify({
id,
date: Date.now()
},null,2))
}

let tempLid = { json:false }
try {
if (fs.existsSync(templidpath)) {
let file = fs.readFileSync(templidpath,'utf-8')
tempLid = file ? { json:true,...JSON.parse(file) } : { json:false }
}
} catch(e) {
RedLog('Erro ao ler templid: ' + e)
tempLid = { json:false }
}

async function AddWhatsAppuser(columbina,test,restart=1000*60*60) {
try {
let info = test?.key?.fromMe
? {
key:{
remoteJid: columbina?.user?.id || columbina?.user?.jid,
senderLid: columbina?.user?.lid
},
pushName: columbina?.user?.name || columbina?.user?.pushname || columbina?.user?.verifiedName
}
: test

if (!info?.key?.remoteJid) return

let from = info.key.remoteJid
let isGroup = from.endsWith('@g.us')
let name = info.pushName || test?.pushName || 'user'
let time = restart

let senderjid,senderlid

if (isGroup) {
senderjid = info?.key?.participant
if (!senderjid) return

if (!tempLid?.json || tempLid.id !== senderjid || Date.now() >= (tempLid.date + 2500)) {
let infoWA = (columbina && typeof columbina.onWhatsApp === 'function') ? await columbina.onWhatsApp(senderjid) : []
if (infoWA?.length > 0) {
saveTempLid(senderjid)
senderlid = infoWA[0]?.lid
} else return
} else {
senderlid = tempLid.id + '@lid'
}
} else {
senderjid = info.key.remoteJid
senderlid = info.key.senderLid
}

if (!senderjid || !senderlid || senderlid.includes('status')) return

let jid = senderjid.includes(':') ? senderjid.split(':')[0] + '@s.whatsapp.net' : senderjid
let lid = senderlid.includes(':') ? senderlid.split(':')[0] + '@lid' : senderlid

let date = Date.now()

let data = {
jid,
lid,
name,
date: date + time
}

if (!existsLidData(lid)) {
GreenLog(`NOVO USUÁRIO: ${jid} / ${lid}`)
return saveUserID(data,lid)
} else {
let old = userLid(lid)
if (date >= old.date) {
YellowLog(`ATUALIZANDO: ${jid} / ${lid}`)
return saveUserID(data,lid)
}
}
} catch (e) {
RedLog(`Erro AddWhatsAppuser: ${e}`)
}
}

function rmUserID(lid) {
let user = convertWhatsAppUser(lid,'lid')
if(existsLidData(lid)) {
fs.unlinkSync(WhatsAppName(user))
}
}

const getname = (lid,type='jid') =>
existsLidData(lid,type) ? userLid(lid,type).name : 'usuário'

module.exports = {
pushnames,
existsLidData,
userLid,
convertWhatsAppUser,
saveUserID,
AddWhatsAppuser,
rmUserID,
getname
}