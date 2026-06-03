/*   ⚠ ANTES DE TUDO QUERO QUE LEMBRE QUE NAO DEIXO DAREM CONTINUIDADE NA COLUMBINA NEM NA HIYUKI, POIS A COLUMBINA É MINHA BOT ATUAL QUE JÁ ESTÁ NA V2 QUE INCLUSIVE ESSA É A VERSÃO BASE DELA. JÁ A HIYUKI É OUTRA BOT MINHA QUE USEI PRA TEMA DA BASE E PRETENDO DAR CONTINUIDADE POR EU MESMO! ENTÃO USE A BASE PARA FAZER SEU PRÓPRIO BOT COM SEU PRÓPRIO TEMA. ⚠️

            HIYUKI SUPREME V1 

[=====/=====/=====/=====/=====/=====/=====/]
Uma base de bot criada totalmente do zero por mim, MisheruModz</>, focada em desempenho, organizacao e facilidade na criacao de comandos via plugins.

A estrutura foi desenvolvida para deixar tudo mais simples e pratico, permitindo adicionar novas funcoes sem baguncar o sistema. Cada comando funciona em modulos/plugins independentes, deixando a base mais limpa, rapida e facil de editar.

Uma base feita para quem quer criar e evoluir sua bot sem complicacao.

Tudo que peço é que deixem os direitos autorais da base usada na criação do seu/sua bot e o devido criador da base vulgo MisheruModz</>

Criador: MisheruModz</>
Numero: +55 12 98804-7370

Faça um bom proveito da base 😉🌸
[=====/=====/=====/=====/=====/=====/=====/]
*/

const fs = require('fs')
const path = require('path')
const colors = require('colors')
const { CyanLog, RedLog } = require('./arquivos/js/logger.js')
const { convertWhatsAppUser } = require('./arquivos/js/userManager.js')

class NucleoDeCmds {
constructor() {
this.commands = new Map()
this.categories = ['admin', 'dono', 'cmds-aleatorios', 'resenha', 'downloads', 'efeitos', 'midias', 'inteligencia-ia', 'rpg', 'premium', 'menu']
this.ResenhaAtiva = new Map()
this.UsuariosPremium = new Set()
this.CarregarPremium()
this.CarregarPrefixosGrupo()
}

CarregarPremium() {
try {
if (fs.existsSync('./arquivos/json/premium.json')) {
const data = JSON.parse(fs.readFileSync('./arquivos/json/premium.json'))
const users = data.users || []
this.UsuariosPremium.clear()
for (const user of users) {
if (user && user.endsWith('@s.whatsapp.net')) {
this.UsuariosPremium.add(user)
}
}
CyanLog(`🌸 Premium carregado: ${this.UsuariosPremium.size} usuarios`)
} else {
fs.writeFileSync('./arquivos/json/premium.json', JSON.stringify({ users: [] }, null, 2))
}
} catch (e) {
RedLog('Erro ao carregar premium.json')
this.UsuariosPremium = new Set()
}
}

SalvarPremium() {
try {
const usersToSave = Array.from(this.UsuariosPremium)
fs.writeFileSync('./arquivos/json/premium.json', JSON.stringify({ users: usersToSave }, null, 2))
CyanLog(`💾 Premium salvo: ${usersToSave.length} usuarios`)
} catch (e) {
RedLog('Erro ao salvar premium.json')
}
}

normalizar(userId) {
if (!userId) return null
if (userId.endsWith('@s.whatsapp.net')) {
return userId
}
try {
const convertido = convertWhatsAppUser(userId, 'jid')
if (convertido && typeof convertido === 'string' && convertido.endsWith('@s.whatsapp.net')) {
return convertido
}
} catch(e) {}
if (userId.endsWith('@lid')) {
const numero = userId.replace('@lid', '')
if (numero && numero.length >= 10) {
return `${numero}@s.whatsapp.net`
}
}
if (!userId.includes('@') && userId.length >= 10) {
return `${userId}@s.whatsapp.net`
}
return null
}

addPremium(userId) {
if (!userId) return false

let normalizedJid = userId
if (!userId.includes('@s.whatsapp.net')) {
normalizedJid = this.normalizar(userId)
if (!normalizedJid) {
RedLog(`Formato invalido para premium: ${userId}`)
return false
}
}

if (!this.UsuariosPremium.has(normalizedJid)) {
this.UsuariosPremium.add(normalizedJid)
this.SalvarPremium()
CyanLog(`✨ Usuario premium adicionado: ${normalizedJid}`)
return true
}
return false
}

removePremium(userId) {
if (!userId) return false
const normalizedJid = this.normalizar(userId)
if (!normalizedJid) {
return false
}
if (this.UsuariosPremium.has(normalizedJid)) {
this.UsuariosPremium.delete(normalizedJid)
this.SalvarPremium()
CyanLog(`🗑️ Usuario premium removido: ${normalizedJid}`)
return true
}
return false
}

isPremium(userId, donoId) {
if (!userId) return false
const normalizedUserId = this.normalizar(userId)
if (!normalizedUserId) return false
let normalizedDonoId = donoId
if (donoId && !donoId.includes('@')) {
normalizedDonoId = `${donoId}@s.whatsapp.net`
}
if (normalizedUserId === normalizedDonoId) return true
return this.UsuariosPremium.has(normalizedUserId)
}

getPremiumUsers() {
return Array.from(this.UsuariosPremium)
}

CarregarPrefixosGrupo() {
try {
if (fs.existsSync('./arquivos/json/prefixos_grupo.json')) {
const data = JSON.parse(fs.readFileSync('./arquivos/json/prefixos_grupo.json'))
this.prefixosGrupo = data
CyanLog(`📋 Carregados ${Object.keys(this.prefixosGrupo).length} prefixos de grupos`)
} else {
this.prefixosGrupo = {}
fs.writeFileSync('./arquivos/json/prefixos_grupo.json', JSON.stringify({}, null, 2))
}
} catch (e) {
RedLog('Erro ao carregar prefixos_grupo.json')
this.prefixosGrupo = {}
}
}

SalvarPrefixosGrupo() {
try {
fs.writeFileSync('./arquivos/json/prefixos_grupo.json', JSON.stringify(this.prefixosGrupo, null, 2))
} catch (e) {
RedLog('Erro ao salvar prefixos_grupo.json')
}
}

ObterPrefixoGrupo(groupId) {
return this.prefixosGrupo[groupId] || null
}

DefinirPrefixoGrupo(groupId, prefixo) {
if (!prefixo || prefixo.length !== 1) {
return false
}
this.prefixosGrupo[groupId] = prefixo
this.SalvarPrefixosGrupo()
return true
}

RemoverPrefixoGrupo(groupId) {
if (this.prefixosGrupo[groupId]) {
delete this.prefixosGrupo[groupId]
this.SalvarPrefixosGrupo()
return true
}
return false
}

carregarPlugins() {
CyanLog('📂 Carregando plugins...')
this.commands.clear()
let totalCarregado = 0
const carregarDaPasta = (dir, category) => {
if (!fs.existsSync(dir)) return
const files = fs.readdirSync(dir)
for (const file of files) {
const fullPath = path.join(dir, file)
const stat = fs.statSync(fullPath)
if (stat.isDirectory()) {
carregarDaPasta(fullPath, category)
} else if (file.endsWith('.js')) {
try {
delete require.cache[require.resolve(fullPath)]
const plugin = require(fullPath)
if (plugin.name && plugin.execute) {
this.commands.set(plugin.name, {
...plugin,
category,
file: fullPath
})
if (plugin.aliases && Array.isArray(plugin.aliases)) {
for (const alias of plugin.aliases) {
if (!this.commands.has(alias)) {
this.commands.set(alias, {
...plugin,
name: alias,
category,
file: fullPath,
isAlias: true,
originalName: plugin.name
})
}
}
}
CyanLog(`🌸 Comando carregado: ${plugin.name} (${category})`)
totalCarregado++
} else {
RedLog(`❌ Plugin invalido: ${file} - faltando name ou execute`)
}
} catch (e) {
RedLog(`❌ Erro ao carregar ${file}: ${e.message}`)
}
}
}
}
for (const category of this.categories) {
const pluginDir = path.join(__dirname, 'plugins', category)
carregarDaPasta(pluginDir, category)
}
CyanLog(`🌸🎐 Total de comandos carregados: ${totalCarregado} ❄️🧊`)
}

ResenhaAtiva(grupoId) {
return this.ResenhaAtiva.get(grupoId) === true
}

DefinirResenhaAtiva(grupoId, ativa) {
this.ResenhaAtiva.set(grupoId, ativa)
}

ObterComando(cmd) {
return this.commands.get(cmd)
}

ObterTodosComandos() {
return Array.from(this.commands.values())
}

ObterComandosPorCategoria(category) {
return this.ObterTodosComandos().filter(cmd => cmd.category === category && !cmd.isAlias)
}
}

module.exports = NucleoDeCmds
