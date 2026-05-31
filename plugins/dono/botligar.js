module.exports = {
name: 'boton',
description: 'Liga o bot (reativa comandos para todos)',
category: 'dono',
aliases: ['ligar', 'start'],
async execute({ columbina, from, info, reply, isDono }) {
if (!isDono) return reply('❌ Apenas o dono pode usar este comando!')
global.botLigado = true
await reply('🌕 *COLUMBINA HYPOSELENIA V2 OPERANDO NOVAMENTE* 🌕')
try {
const donoId = columbina.user.id?.split(':')[0] + '@s.whatsapp.net'
await columbina.sendMessage(donoId, {text: `🌕 *COLUMBINA HYPOSELENIA V2 OPERANDO NORMALMENTE* 🌕 \n\nComandos reativados para todos os usuários.`})
} catch(e) {}
}
}