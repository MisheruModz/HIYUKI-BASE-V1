//MisheruModz</> - Função de upload para imgbb V2
const axios = require('axios')
const FormData = require('form-data')
const crypto = require('crypto')
const { fromBuffer } = require('file-type')

const Misheruzin = () => "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
async function MisheruSlakk(buffer) {
const { ext, mime } = (await fromBuffer(buffer)) || { ext: 'bin', mime: 'application/octet-stream' }
const filename = crypto.randomBytes(8).toString('hex') + '.' + ext
const form = new FormData()
form.append('source', buffer, { filename, contentType: mime })
form.append('type', 'file')
form.append('action', 'upload')
const headers = {
...form.getHeaders(),
'User-Agent': Misheruzin(),
'Accept': 'application/json',
'Accept-Encoding': 'gzip, deflate, br, zstd',
'sec-ch-ua-platform': '"Android"',
'sec-ch-ua': '"Chromium";v="136", "Android WebView";v="136", "Not.A/Brand";v="99"',
'sec-ch-ua-mobile': '?1',
'origin': 'https://imgbb.com',
'x-requested-with': 'mark.via.gp',
'sec-fetch-site': 'same-origin',
'sec-fetch-mode': 'cors',
'sec-fetch-dest': 'empty',
'referer': 'https://imgbb.com/',
'accept-language': 'pt-BR,pt;q=0.9',
'priority': 'u=1, i'
}
const res = await axios.post('https://imgbb.com/json', form, { headers })
return {url: res.data.image?.url, nome: filename, raw: res.data
}}

module.exports = MisheruSlakk //MisheruModz</>