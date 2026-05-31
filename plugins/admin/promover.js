const { getPhoneNumberFromId } = require('../../arquivos/js/exports.js')
const { convertWhatsAppUser } = require('../../arquivos/js/userManager.js')

module.exports = {
name: 'promover',
description: 'Promove um membro a administrador',
category: 'admin',
aliases: ['promote'],
async execute({columbina, from, info, args, reply, reagir, isGroup, isAdm, isBotAdm, isDono, sender, groupMembers, botNumber, donoJid}) {
if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos!')
if (!isAdm && !isDono) return reply('❌ Apenas administradores podem usar este comando!')
if (!isBotAdm) return reply('❌ O bot precisa ser administrador para isso!')
const quoted = info.message?.extendedTextMessage?.contextInfo
let target = quoted?.participant || quoted?.mentionedJid?.[0]
if (!target && args[0]) {
target = args[0].replace('@','') + '@s.whatsapp.net'
}
if (!target) return reply('❗ Marque um usuário para promover!')
const targetJid = convertWhatsAppUser(target,'jid')
const botJid = convertWhatsAppUser(botNumber,'jid')
const senderJid = convertWhatsAppUser(sender,'jid')
const targetPhone = getPhoneNumberFromId(targetJid,groupMembers)
const botPhone = getPhoneNumberFromId(botJid,groupMembers)
const senderPhone = getPhoneNumberFromId(senderJid,groupMembers)
if (targetPhone === botPhone || targetJid === botJid) {
await reagir('❌')
await reply('❌ EU NÃO POSSO ME PROMOVER!')
return
}
let userExists = false
let isTargetAdmin = false
let targetRealJid = null
for (const member of groupMembers) {
const memberId = member.id || member.jid || member.lid
const memberPhone = getPhoneNumberFromId(memberId,groupMembers)
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
if (isTargetAdmin) {
await reagir('❌')
await reply('❌ Este usuário já é administrador!')
return
}
try {
await reagir('⚠️')
await columbina.groupParticipantsUpdate(from,[targetRealJid],'promote')
await columbina.sendMessage(from,{
text:`✅ @${targetRealJid.split('@')[0]} foi promovido a administrador!`,
mentions:[targetRealJid]
},{quoted:info})
await reagir('✅')
} catch (error) {
await reagir('❌')
await reply(`❌ Erro ao tentar promover: ${error.message}`)
}
}
}