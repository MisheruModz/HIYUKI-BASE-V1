const { getFileBuffer } = require('../../arquivos/js/exports.js')

module.exports = {
name: 'toimg',
description: 'Converte figurinha em imagem',
category: 'cmds-aleatorios',
aliases: ['toimage'],
async execute({ columbina, from, info, reply, isQuotedSticker }) {
if (!info || !info.message) {
return reply('❌ Erro: mensagem não encontrada!')
}
const quotedMsg = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
if (!quotedMsg || !isQuotedSticker) {
return reply('❌ Marque uma figurinha para converter!\n\nExemplo: responda a uma figurinha com .toimg')
}
const stickerMsg = quotedMsg.stickerMessage
if (!stickerMsg) {
return reply('❌ Isso não é uma figurinha válida!')
}
try {
const buffer = await getFileBuffer(stickerMsg, 'sticker')
await columbina.sendMessage(from, {image: buffer }, {quoted: info})
} catch (err) {
console.error('Erro toimg:', err)
reply(`❌ Erro ao converter figurinha: ${err.message}`)
}}}