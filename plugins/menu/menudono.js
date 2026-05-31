const fs = require('fs')
const path = require('path')
const MenuSystem = require('../../arquivos/js/menuSystem.js')

module.exports = {
name: 'menudono',
description: 'Mostra todos os comandos do dono',
category: 'menu',
aliases: ['dono', 'ownermenu', 'donomenu'],
async execute({ columbina, from, info, prefix, reply, reagir, commandManager, isDono }) {
if (!isDono) return reply('❌ Apenas o dono pode usar este comando!')

await reagir('👑')

const menuSystem = new MenuSystem(commandManager)
/* PUXA TODOS OS COMANDOS DA PASTA plugins/dono/ */
const comandos = menuSystem.getCommandsByFolder('dono')

const menuTexto = menuSystem.gerarMenuCustom(comandos, prefix, 'MENU DONO', '👑')

const imageUrl = path.join(__dirname, '../../arquivos/imagem/menu.jpg')

try {
await columbina.sendMessage(from, {
image: fs.readFileSync(imageUrl),
caption: menuTexto,
contextInfo: {
forwardingScore: 100000,
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: '120363403916707447@newsletter',
newsletterName: '🎐 𝗖𝗢𝗟𝗨𝗠𝗕𝗜𝗡𝗔 ᝰ 𝗛𝗬𝗣𝗢𝗦𝗘𝗟𝗘𝗡𝗜𝗔 🎐',
serverMessageId: -1
}
}
}, { quoted: info })
} catch (err) {
console.error(err)
reply('❌ Erro ao carregar a imagem do menu. Verifique se o arquivo existe em: ' + imageUrl)
}
}
}
