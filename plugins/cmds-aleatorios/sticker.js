const fs = require('fs')
const { sendImageAsSticker2, sendVideoAsSticker2 } = require('../../arquivos/js/exif2.js')

module.exports = {
name: 'sticker',
description: 'Cria figurinha a partir de imagem ou vídeo',
category: 'cmds-aleatorios',
aliases: ['s','fig','sticker'],
async execute({ columbina, from, info, reply, reagir, getFileBuffer, pushname }) {

if (!info || !info.message) {
return reply('❌ Erro: mensagem não encontrada!')
}

var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage
var imagem = RSM?.imageMessage || info.message?.imageMessage || RSM?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessageV2?.message?.imageMessage || info.message?.viewOnceMessage?.message?.imageMessage || RSM?.viewOnceMessage?.message?.imageMessage
var video = RSM?.videoMessage || info.message?.videoMessage || RSM?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessageV2?.message?.videoMessage || info.message?.viewOnceMessage?.message?.videoMessage || RSM?.viewOnceMessage?.message?.videoMessage

const agora = new Date()
const data = agora.toLocaleDateString('pt-BR')
const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
const packin = `⛩🌸 Hiyuki Supreme ● MisheruModz </> 🌸⛩`
const author = `Figurinha criada em ${data} às ${hora}`

if (imagem) {
await reagir('⏰')
try {
const buffer = await getFileBuffer(imagem, 'image')
await sendImageAsSticker2(columbina, from, buffer, info, { packname: packin, author: author })
await reagir('✅')
} catch (err) {
console.error('Erro sticker image:', err)
reply(`❌ Erro ao criar figurinha: ${err.message}`)
}
} 
else if (video && video.seconds <= 13) {
await reagir('⏰')
try {
const buffer = await getFileBuffer(video, 'video')
await sendVideoAsSticker2(columbina, from, buffer, info, { packname: packin, author: author })
await reagir('✅')
} catch (err) {
console.error('Erro sticker video:', err)
reply(`❌ Erro ao criar figurinha: ${err.message}`)
}
} 
else if (video && video.seconds > 13) {
reply('❌ O vídeo deve ter no máximo 13 segundos!')
} 
else {
reply('❌ Envie ou marque uma imagem/vídeo com o comando!')
}

}
}