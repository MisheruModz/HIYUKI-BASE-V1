const { existsLidData, userLid, saveUserID } = require('../../arquivos/js/userManager.js')

module.exports = {
name: 'premium',
description: 'Gerencia usuarios premium',
category: 'dono',
aliases: ['addpremium', 'removepremium'],
async execute({ columbina, from, info, args, q, reply, reagir, isDono, commandManager, prefix, sender, groupMembers, isGroup }) {

if (!isDono) {
await reagir('❌')
return reply('❌ Apenas o dono pode usar este comando!')
}

const quoted = info.message?.extendedTextMessage?.contextInfo
let target = quoted?.participant || quoted?.mentionedJid?.[0]

const subCommand = (args[0] || '').toLowerCase()

const pegarPhoneNumberReal = (input) => {
if (!input) return null

if (input.match(/^\d+$/) && !input.includes('@')) {
return `${input}@s.whatsapp.net`
}

if (input.includes('@s.whatsapp.net') && input.match(/^\d{10,15}@/)) {
return input
}

const lidLimpo = input.replace('@lid', '').split(':')[0]

if (isGroup && groupMembers && groupMembers.length > 0) {
const membro = groupMembers.find(m => 
m.id === input || 
m.id === lidLimpo + '@lid' ||
m.id === lidLimpo
)
if (membro && membro.phoneNumber) {
console.log(`✅ PhoneNumber encontrado no groupMembers: ${membro.phoneNumber}`)
return membro.phoneNumber
}
}

const lidCompleto = lidLimpo + '@lid'
if (existsLidData(lidCompleto)) {
const dados = userLid(lidCompleto)
if (dados && dados.jid && dados.jid.match(/^\d{10,15}@s\.whatsapp\.net$/)) {
console.log(`✅ PhoneNumber encontrado nos dados: ${dados.jid}`)
return dados.jid
}
}

if (isGroup && groupMembers && groupMembers.length > 0) {
for (const membro of groupMembers) {
if (membro.id === input || membro.id === lidLimpo + '@lid') {
if (membro.phoneNumber) {
return membro.phoneNumber
}
}
}
}

return null
}

if (subCommand === 'add') {
if (!target) {
return reply(`❌ Marque o usuario!\n\nExemplo: ${prefix}premium add @usuario`)
}

await reagir('⏳')

const phoneReal = pegarPhoneNumberReal(target)

if (!phoneReal) {
await reagir('❌')
return reply(`❌ Não foi possível identificar o número do usuário!\n\nCertifique-se que ele está no grupo.`)
}

const success = commandManager.addPremium(phoneReal)
if (success) {
const numeroMostrar = phoneReal.split('@')[0]
await reagir('✅')
await reply(`✅ Usuario adicionado ao premium!\n\n📌 Número: ${numeroMostrar}`, from, info)
} else {
await reply(`❌ Falha ao adicionar!`, from, info)
}

} else if (subCommand === 'remove') {
if (!target) {
return reply(`❌ Marque o usuario!\n\nExemplo: ${prefix}premium remove @usuario`)
}

const phoneReal = pegarPhoneNumberReal(target)

if (!phoneReal) {
await reagir('❌')
return reply(`❌ Erro ao identificar o usuario!`)
}

const success = commandManager.removePremium(phoneReal)
if (success) {
await reagir('✅')
await reply(`✅ Usuario removido do premium!`, from, info)
} else {
await reply(`❌ Usuario nao estava na lista premium!`, from, info)
}

} else if (subCommand === 'list') {
const users = commandManager.getPremiumUsers()
if (users.length === 0) {
await reply('📊 Nenhum usuario premium cadastrado!')
} else {
let text = '📊 *LISTA DE USUARIOS PREMIUM*\n\n'
text += `Total: ${users.length}\n\n`
const mentions = []
users.forEach((u, i) => {
const numero = u.split('@')[0]
text += `${i+1}°. @${numero}\n`
mentions.push(u)
})
await columbina.sendMessage(from, { text, mentions }, { quoted: info })
}
await reagir('📋')

} else {
await reply(`❌ COMANDOS PREMIUM:
▸ ${prefix}premium add @usuario
▸ ${prefix}premium remove @usuario
▸ ${prefix}premium list

Exemplo: ${prefix}premium add @usuario

💡 O bot usa o phoneNumber do groupMembers para adicionar!`)
}
}
}