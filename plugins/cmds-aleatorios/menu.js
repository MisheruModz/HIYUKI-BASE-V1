const fs = require('fs')
const path = require('path')
const { prepareWAMessageMedia } = require('@whiskeysockets/baileys')

module.exports = {
name: 'menu',
description: 'Mostra o menu de comandos',
category: 'cmds-aleatorios',
aliases: ['comandos','help'],
async execute({ columbina, from, info, prefix, reply, reagir, AudioMisheru, pushname, sender, isGroup }) {
try {

await AudioMisheru('./arquivos/audio/menu.mp3').catch(() => {})
await reagir("🎐")

const caminhoMenu = path.join(__dirname,'../../arquivos/imagem/menu.jpg')
const bufferMenu = fs.existsSync(caminhoMenu) ? fs.readFileSync(caminhoMenu) : null

const mediaMenu = bufferMenu ? await prepareWAMessageMedia(
{ image: bufferMenu },
{ upload: columbina.waUploadToServer }
) : null

const menuTxt = `
╭🌸─━⛩─━❄━─⛩━─🌸╮

    『 𝗛𝗜𝗬𝗨𝗞𝗜 𝗦𝗨𝗣𝗥𝗘𝗠𝗘 𝐕𝟏 』

╰🌸─━⛩─━❄━─⛩━─🌸╯
        ❱❱ Hɪʏᴜᴋɪ Sᴜᴘʀᴇᴍᴇ V1 ❰❰
╭🌸━─━─━─🌸─━─━─━─🌸╮
│❄╭─⛩༺ヒユキ༻⛩─╮
│❄│ 𝐁𝐨𝐭: Hiyuki Supreme V1
│❄│ 𝐔𝐬𝐞𝐫: ${pushname}
│❄│ 𝐍𝐮𝐦𝐞𝐫𝐨: ${sender.split("@")[0]}
│❄│ 𝐆𝐫𝐮𝐩𝐨: ${isGroup ? 'Sim✅️' : 'Não❌️'}
│❄│ 𝐒𝐭𝐚𝐭𝐮𝐬: Online 🟢
│❄╰─⛩༺ヒユキ༻⛩─╯
╰🌸━─━─━─🌸─━─━─━─🌸╯`

const botoes = [{
name: "cta_url",
buttonParamsJson: JSON.stringify({
display_text: "⛩️🌸 𝐂𝐑𝐈𝐀𝐃𝐎𝐑 🌸⛩️",
url: "https://www.instagram.com/misherumodz?igsh=b2VmbDI0NGsybm9o",
merchant_url: "https://www.instagram.com/misherumodz?igsh=b2VmbDI0NGsybm9o"
})
},{
name: "single_select",
buttonParamsJson: JSON.stringify({
title: "🌸 𝐌𝐄𝐍𝐔 ❆ 𝐋𝐈𝐒𝐓𝐀 🌸",
sections: [{
title: "Escolha uma opção",
rows: [
{header:"𝗠𝗘𝗡𝗨 𝗔𝗗𝗠",title:"🛡️ Admin",description:"Comandos apenas para administradores",id:`${prefix}menuadm`}, {header:"𝗠𝗘𝗡𝗨 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦",title:"🗒 Comandos",description:"Comandos aleatorios",id:`${prefix}menucmd`},
{header:"𝗠𝗘𝗡𝗨 𝗗𝗢𝗡𝗢",title:"👑 Dono",description:"Comandos do dono da bot",id:`${prefix}menudono`},
{header:"𝗠𝗘𝗡𝗨 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗦",title:"⬇️ Downloads",description:"Comandos de downloads",id:`${prefix}menudownloads`},
{header:"𝗠𝗘𝗡𝗨 𝗘𝗙𝗘𝗜𝗧𝗢𝗦",title:"🎨 Efeitos",description:"Feitos de img e audio",id:`${prefix}menuefeitos`},
{header:"𝗠𝗘𝗡𝗨 𝗜𝗔",title:"🤖 IA",description:"Comandos de inteligência artificial",id:`${prefix}menuia`},
{header:"𝗠𝗘𝗡𝗨 𝗠𝗜𝗗𝗜𝗔𝗦",title:"🎬 Midias",description:"Comandos de Midias da bot",id:`${prefix}menumidias`},
{header:"𝗠𝗘𝗡𝗨 𝗣𝗥𝗘𝗠𝗜𝗨𝗠",title:"💎 Premium",description:"Comandos de premium",id:`${prefix}menupremium`},
{header:"𝗠𝗘𝗡𝗨 𝗥𝗘𝗦𝗘𝗡𝗛𝗔",title:"🎮 Jogos",description:"Todos os jogos e brincadeiras da bot",id:`${prefix}menubrincadeira`},
{header:"𝗠𝗘𝗡𝗨 𝗥𝗣𝗚",title:"⚔️ RPG",description:"Comandos de RPG da bot",id:`${prefix}menurpg`}
]
}]
})
}]

await columbina.relayMessage(from,{
interactiveMessage:{
contextInfo:{
stanzaId: info.key.id,
participant: info.key.participant || info.key.remoteJid,
quotedMessage: info.message,
mentionedJid:[sender]
},
body:{text:'⛩️🎐 _clique no botão abaixo para averiguar os menus._🎐⛩️'},
footer:{text:'MisheruModz </>'},
carouselMessage:{
cards:[{
header:{hasMediaAttachment:true,imageMessage: mediaMenu ? mediaMenu.imageMessage : undefined},
body:{text: menuTxt},
footer:{text:'© Hiyuki Supreme V1'},
nativeFlowMessage:{buttons: botoes}
}]
}
}
},{})
} catch(e){
console.error(e)
await reply('Erro ao abrir o menu.')
}
}
}