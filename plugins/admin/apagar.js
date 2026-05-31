module.exports = {
name: 'apagar',
description: 'Apaga uma mensagem do grupo',
category: 'admin',
aliases: ['del', 'delete', 'd'],
async execute({ columbina, from, info, reply, reagir, isGroup, isAdm, isBotAdm, isDono }) {
if (!isGroup) return reply('❌ Este comando só pode ser usado em grupos!')
if (!isAdm && !isDono) return reply('❌ Apenas administradores podem usar este comando!')
if (!isBotAdm) return reply('❌ O bot precisa ser administrador para isso!')
  
const quoted = info.message?.extendedTextMessage?.contextInfo
  
if (!quoted) return reply('❌ Responda a mensagem que deseja apagar!')
  
try {
await columbina.sendMessage(from, {
delete: {
remoteJid: from,
fromMe: false,
id: quoted.stanzaId,
participant: quoted.participant
}})
await reagir('🗑️')
} catch (e) {
reply('❌ Não foi possível apagar a mensagem!')
}}}