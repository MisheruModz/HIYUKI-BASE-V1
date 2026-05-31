module.exports = {
name: 'botoff',
description: 'Desliga o bot (bloqueia comandos para todos exceto o dono)',
category: 'dono',
aliases: ['desligar', 'shutdown'],
async execute({ columbina, from, info, reply, isDono }) {
if (!isDono) return reply('❌ Apenas o dono pode usar este comando!')
global.botLigado = false
await reply('🌑 *COLUMBINA HYPOSELENIA V2 OFF* 🌑\n\nApenas o dono pode usar comandos agora.\nUse `boton` para reativar(se vc for o dono né).')
try {
const donoId = columbina.user.id?.split(':')[0] + '@s.whatsapp.net'
await columbina.sendMessage(donoId, {text: `🌑 *COLUMBINA HYPOSELENIA V2 OFF* 🌑\n\nComandos bloqueados para todos os usuários.\nApenas você pode usar comandos agora.\n\nUse *boton* para reativar.`})
} catch(e) {}
}
}