const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')

module.exports = {
name: 'gerarlink',
description: 'Gera link de imagem ou vídeo usando Catbox',
category: 'cmds-aleatorios',
aliases: ['catbox', 'upload'],
async execute({ columbina, from, info, reply, reagir, getFileBuffer }) {

if (!info || !info.message) {
return reply('❌ Erro: mensagem não encontrada!')
}

var RSM = info.message?.extendedTextMessage?.contextInfo?.quotedMessage

var imagem = RSM?.imageMessage || 
info.message?.imageMessage || 
RSM?.viewOnceMessageV2?.message?.imageMessage || 
info.message?.viewOnceMessageV2?.message?.imageMessage || 
info.message?.viewOnceMessage?.message?.imageMessage || 
RSM?.viewOnceMessage?.message?.imageMessage

var video = RSM?.videoMessage || 
info.message?.videoMessage || 
RSM?.viewOnceMessageV2?.message?.videoMessage || 
info.message?.viewOnceMessageV2?.message?.videoMessage || 
info.message?.viewOnceMessage?.message?.videoMessage || 
RSM?.viewOnceMessage?.message?.videoMessage

async function uploadCatbox(buffer, ext) {
const tempPath = path.join(__dirname, `temp_${Date.now()}.${ext}`)

fs.writeFileSync(tempPath, buffer)

try {
const form = new FormData()

form.append('reqtype', 'fileupload')
form.append('fileToUpload', fs.createReadStream(tempPath))

const { data } = await axios.post(
'https://catbox.moe/user/api.php',
form,
{
headers: form.getHeaders()
}
)

fs.unlinkSync(tempPath)

return data
} catch (err) {
if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
throw err
}
}

try {

if (imagem) {
await reagir('⏰')

const buffer = await getFileBuffer(imagem, 'image')

let mimetype = imagem.mimetype || 'image/png'
let ext = mimetype.split('/')[1]

const link = await uploadCatbox(buffer, ext)

await reagir('✅')

return reply(`🖼️ Link da imagem:\n${link}`)
}

else if (video) {
await reagir('⏰')

const buffer = await getFileBuffer(video, 'video')

let mimetype = video.mimetype || 'video/mp4'
let ext = mimetype.split('/')[1]

const link = await uploadCatbox(buffer, ext)

await reagir('✅')

return reply(`🎥 Link do vídeo:\n${link}`)
}

else {
return reply('❌ Envie ou marque uma imagem/vídeo com o comando!')
}

} catch (err) {
console.error('Erro gerarlink:', err)
reply(`❌ Erro ao gerar link:\n${err.message}`)
}

}
}