module.exports = {
name: 'getquoted',
description: 'Mostra as informações da mensagem marcada',
category: 'dono',
aliases: ['getinfo','get'],
async execute({ info, reply }) {
try {
reply(JSON.stringify(info.message.extendedTextMessage.contextInfo, null, 3))
} catch (e) {
reply('Deu erro mano')
}
}
}