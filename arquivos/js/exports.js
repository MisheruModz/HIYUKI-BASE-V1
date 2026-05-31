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
const axios = require('axios')
const { exec } = require('child_process')
const moment = require('moment')
const colors = require('colors')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
const { CyanLog, RedLog, GreenLog } = require('./logger.js')

/*FUNCOES DE ADMIN/MEMBRO*/
const getGroupAdmins = (participants) => {
if (!participants || !Array.isArray(participants)) return []
return participants.filter(p => p.admin === "admin" || p.admin === "superadmin")
.map(p => {
let base = p.phoneNumber ?? p.id ?? p.jid
if (!base) return null
if (base.endsWith("@lid") && p.phoneNumber) {
base = p.phoneNumber
}
return base
}).filter(Boolean)
}

const getMembros = (participants) => {
if (!participants || !Array.isArray(participants)) return []
return participants.filter(p => !p.admin)
.map(p => {
let raw = p.phoneNumber ?? p.id ?? p.jid
if (!raw) return null
if (raw.endsWith("@lid") && p.phoneNumber) {
raw = p.phoneNumber
}
return raw
}).filter(Boolean)
}

/*FUNCAO PARA PEGAR PHONE NUMBER*/
const getPhoneNumberFromId = (lidId, members) => {
if (!lidId || !members || !Array.isArray(members)) return lidId
if (lidId === null || lidId === undefined) return null  
if (lidId.includes('@s.whatsapp.net') && lidId.length < 35 && lidId.match(/^55\d{10,13}@/)) {
return lidId
}
/*Busca pelo id ou phoneNumber*/
const member = members.find(m => {
const idNum = m.id?.split('@')[0]
const phoneNum = m.phoneNumber?.split('@')[0]
const targetNum = lidId?.split('@')[0]
return m.id === lidId || 
m.phoneNumber === lidId ||
idNum === targetNum ||
phoneNum === targetNum
})

if (member?.phoneNumber) {
return member.phoneNumber
}
  
if (lidId && lidId.includes('@lid')) {
return lidId.replace('@lid', '@s.whatsapp.net')
}
return lidId
}

/*FUNCAO PARA PEGAR NOME DO MEMBRO*/
const getMemberName = (jid, members) => {
if (!jid || !members) return null
const phoneNumber = jid.split('@')[0]
const member = members.find(m => {
const phoneNum = m.phoneNumber?.split('@')[0]
return phoneNum === phoneNumber
})
return member?.name || member?.pushName || null
}

const getFileBuffer = async (mediaKey, mediaType) => {
if (!mediaKey) throw new Error('Mensagem nao fornecida')
try {
const stream = await downloadContentFromMessage(mediaKey, mediaType)
let buffer = Buffer.from([])
for await (const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
} catch (err) {
RedLog(`Erro no downloadContentFromMessage: ${err.message}`)
throw err
}
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const fetchJson = async (url, options = {}) => {
const response = await axios({url, ...options})
return response.data
}

const getRandom = (ext) => {
if (!fs.existsSync('./temp')) fs.mkdirSync('./temp', { recursive: true })
return `./temp/${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`
}

const addNumberMais = (numero) => {
if (!numero) return '0'
const num = numero.split('@')[0]
if (num.startsWith('55')) return `+${num}`
return num
}

const identArroba = (numero) => {
if (!numero) return ''
if (numero.includes('@')) return numero
return `${numero}@s.whatsapp.net`
}

const isJsonIncludes = (arr, item) => {
return arr.includes(item)
}

/*Funcao para normalizar JID*/
const inputToJid = (input) => {
if (!input) return null
let clean = input.toString().replace(/[^0-9]/g, '')
if (clean.length >= 10 && clean.length <= 13) {
return `${clean}@s.whatsapp.net`
}
return null
}

module.exports = {
  getGroupAdmins,
  getMembros,
  getPhoneNumberFromId,
  getMemberName,
  getFileBuffer,
  sleep,
  fetchJson,
  getRandom,
  addNumberMais,
  identArroba,
  isJsonIncludes,
  inputToJid
}