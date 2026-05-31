const fs = require('fs')
const path = require('path')

module.exports = {
name: 'limparqr',
description: 'Limpa arquivos temporários da pasta Hiyuki-QR',
category: 'dono',
aliases: ['clearqr', 'cleanqr'],

async execute({ reply, isDono }) {

if (!isDono) {
return reply('❌ Apenas o dono pode usar este comando!')
}

const caminhoQR = path.join(__dirname, '../../database/Hiyuki-QR')

const arquivosParaManter = ['creds.json']

if (!fs.existsSync(caminhoQR)) {
fs.mkdirSync(caminhoQR, { recursive: true })
return reply('⚠️ Pasta qr-code não existia, então ela foi criada.')
}

try {

const arquivos = await fs.promises.readdir(caminhoQR)

let removidos = 0
let mantidos = 0

for (const arquivo of arquivos) {

if (arquivosParaManter.includes(arquivo)) {
mantidos++
continue
}

if (
arquivo.startsWith('pre-key') ||
arquivo.startsWith('sender-key') ||
arquivo.startsWith('session-') ||
arquivo.startsWith('device-list') ||
arquivo.startsWith('lid-mapping') ||
arquivo.startsWith('app-state-sync-key') ||
arquivo.endsWith('.tmp') ||
arquivo.endsWith('.bak') ||
(arquivo.endsWith('.json') && arquivo !== 'creds.json')
) {

const caminhoArquivo = path.join(caminhoQR, arquivo)

try {
await fs.promises.unlink(caminhoArquivo)
removidos++
} catch(e) {}

}
}

await reply(`🌸 *LIMPEZA QR FINALIZADA* 🌸

🗑️ Arquivos removidos: ${removidos}
🔒 Arquivos mantidos: ${mantidos}

✅ Pasta qr-code otimizada com sucesso.`)

} catch (error) {

console.log(error)

await reply(`❌ Erro ao limpar a pasta qr-code:

${error.message}`)

}

}
}