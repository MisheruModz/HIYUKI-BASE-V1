module.exports = {
name: 'batche',
description: 'Exemplo de comando premium',
category: 'premium',
async execute({ from, info, reply, sender }) {
  reply(`✨ Comando premium executado com sucesso, @${sender.split('@')[0]}!`)
}
}