const { getPhoneNumberFromId, getMemberName } = require('../../arquivos/js/exports.js')
const { convertWhatsAppUser } = require('../../arquivos/js/userManager.js')

module.exports = {
name: 'ban',
description: 'Remove um membro do grupo',
category: 'admin',
aliases: ['kick', 'expulsar'],
async execute({ columbina, from, info, args, reply, reagir, isGroup, isAdm, isBotAdm, isDono, sender, groupMembers, botNumber, donoJid }) {
if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos!')
if (!isAdm && !isDono) return reply('❌ Apenas administradores podem usar este comando!')
if (!isBotAdm) return reply('❌ A Columbina precisa ser administradora para isso!')
const quoted = info.message?.extendedTextMessage?.contextInfo
let target = quoted?.participant || quoted?.mentionedJid?.[0]
if (!target && args[0]) {
target = args[0].replace('@', '') + '@s.whatsapp.net'
}
if (!target) return reply('❗ Marque um usuário para remover!')
const targetJid = convertWhatsAppUser(target, 'jid')
const botJid = convertWhatsAppUser(botNumber, 'jid')
const donoJid_normalizado = convertWhatsAppUser(donoJid, 'jid')
const senderJid = convertWhatsAppUser(sender, 'jid')
const targetPhone = getPhoneNumberFromId(targetJid, groupMembers)
const botPhone = getPhoneNumberFromId(botJid, groupMembers)
const donoPhone = getPhoneNumberFromId(donoJid_normalizado, groupMembers)
const senderPhone = getPhoneNumberFromId(senderJid, groupMembers)
if (targetPhone === botPhone || targetJid === botJid) {
await reagir('❌')
await reply(`❌ EU NÃO POSSO ME BANIR!\n\nSou a Columbina Hyposelenia 🌙`)
return
}
if (targetPhone === donoPhone || targetJid === donoJid_normalizado) {
await reagir('❌')
await reply(`❌ NÃO POSSO BANIR MEU CRIADOR!\n\nEle é meu dono e mestre 👑`)
return
}
if ((targetPhone === senderPhone || targetJid === senderJid) && !isDono) {
await reagir('❌')
await reply(`❌ VOCÊ NÃO PODE SE BANIR!\n\nUse o comando \`sair\` para sair do grupo.`)
return
}
let userExists = false
let isTargetAdmin = false
let targetRealJid = null
for (const member of groupMembers) {
const memberId = member.id || member.jid || member.lid
const memberPhone = getPhoneNumberFromId(memberId, groupMembers)

if (memberPhone === targetPhone || memberId === targetJid) {
userExists = true
targetRealJid = memberId
if (member.admin === 'admin' || member.admin === 'superadmin') {
isTargetAdmin = true
}
break
}
}
if (!userExists) {
await reagir('❌')
await reply('❌ Este usuário não está no grupo!')
return
}
if (isTargetAdmin && !isDono) {
await reagir('❌')
await reply(`❌ NÃO POSSO BANIR UM ADMINISTRADOR!\n\nPeça para o dono do grupo fazer isso.`)
return
}
try {
await reagir('⚠️')
const nomeTarget = getMemberName(targetRealJid, groupMembers) || 'Usuário'
await columbina.sendMessage(from, {text: `🌕 ${nomeTarget} está sendo removido do grupo...`, mentions: [targetRealJid]}, {quoted: info})
await new Promise(resolve => setTimeout(resolve, 1000))
await columbina.groupParticipantsUpdate(from, [targetRealJid], 'remove')
await reagir('✅')
} catch (error) {
await reagir('❌')
await reply(`❌ Erro ao tentar banir: ${error.message}`)
}
}
}