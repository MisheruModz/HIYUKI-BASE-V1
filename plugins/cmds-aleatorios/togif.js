const fs = require('fs')
const path = require('path')

const { getFileBuffer } = require('../../arquivos/js/exports.js')
const { webp2mp4File } = require('../../arquivos/js/uploader.js')

module.exports = {
name: 'togif',
description: 'Converte figurinha animada em GIF',
category: 'cmds-aleatorios',
aliases: ['tovideo', 'gif'],

async execute({columbina, from, info, reply, isQuotedSticker}) {

if (!info || !info.message) {
return reply('❌ Erro: mensagem não encontrada!')
}

const quotedMsg =
info.message?.extendedTextMessage?.contextInfo?.quotedMessage

if (!quotedMsg || !isQuotedSticker) {
return reply('❌ Marque uma figurinha animada!\n\nExemplo: responda uma figurinha com .togif')
}

const stickerMsg = quotedMsg.stickerMessage
if (!stickerMsg) {
return reply('❌ Isso não é uma figurinha válida!')
}
try {
reply('⏳ Convertendo figurinha...')
const buffer = await getFileBuffer(stickerMsg, 'sticker')
const tempFile = path.join(__dirname, `tmp_${Date.now()}.webp`)
fs.writeFileSync(tempFile, buffer)
const convert = await webp2mp4File(tempFile)
if (fs.existsSync(tempFile)) {
fs.unlinkSync(tempFile)
}
if (!convert.status || !convert.result) {
return reply('❌ Falha ao converter figurinha!')
}

await columbina.sendMessage(from, {video: {url: convert.result}, gifPlayback: true, caption: ''}, {quoted: info})
} catch (err) {
console.error('Erro togif:', err)
reply(`❌ Erro ao converter figurinha:\n${err.message || err}`)
}}}