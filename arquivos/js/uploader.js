let axios = require('axios')
let BodyForm = require('form-data')
let { fromBuffer } = require('file-type')
let fetch = require('node-fetch')
let fs = require('fs')
let cheerio = require('cheerio')
let util = require('util')

function TelegraPh (Path) {
	return new Promise (async (resolve, reject) => {
		if (!fs.existsSync(Path)) return reject(new Error("File not Found"))
		try {
			const form = new BodyForm();
			form.append("file", fs.createReadStream(Path))
			const data = await  axios({
				url: "https://telegra.ph/upload",
				method: "POST",
				headers: {
					...form.getHeaders()
				},
				data: form
			})
			return resolve("https://telegra.ph" + data.data[0].src)
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

async function UploadFileUgu (input) {
	return new Promise (async (resolve, reject) => {
			const form = new BodyForm();
			form.append("files[]", fs.createReadStream(input))
			await axios({
				url: "https://uguu.se/upload.php",
				method: "POST",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
					...form.getHeaders()
				},
				data: form
			}).then((data) => {
				resolve(data.data.files[0])
			}).catch((err) => reject(err))
	})
}

async function uppload(buff) {
	return new Promise(async (resolve, reject) => {
		const form = new BodyForm();
		form.append("files[]", fs.createReadStream(buff))
		await axios({
			url: "https://uguu.se/upload.php",
			method: "POST",
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
				...form.getHeaders()
			},
			data: form
		}).then((data) => {
			resolve(data.data.files[0])
		}).catch((err) => reject(err))
	})
}

async function webp2mp4File(path) {
	return new Promise(async (resolve, reject) => {
		try {
			const bodyForm = new BodyForm();
			let anu = await uppload(path)
			bodyForm.append('new-image-url', util.format(anu.url));
			bodyForm.append('upload', 'Upload!');
			
			const { data: data1 } = await axios({
				method: 'post',
				url: 'https://ezgif.com/webp-to-mp4',
				data: bodyForm,
				headers: {
					'Content-Type': `multipart/form-data; boundary=${bodyForm._boundary}`,
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
				}
			})
			
			const bodyFormThen = new BodyForm()
			const $ = cheerio.load(data1)
			const file = $('form.ajax-form input[name="file"]').attr('value')
			
			if (!file) return reject('Falha ao obter o arquivo')
			
			bodyFormThen.append('file', file)
			bodyFormThen.append('convert', 'Convert WebP to MP4!')
			
			const { data: data2 } = await axios({
				method: 'post',
				url: 'https://ezgif.com/webp-to-mp4/' + file,
				data: bodyFormThen,
				headers: {
					'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
				}
			})
			
			const $$ = cheerio.load(data2)
			const src = $$('div#output > p.outfile > video > source').attr('src')
			
			if (!src) return reject('Falha ao obter URL do vídeo')
			
			const result = 'https:' + src
			resolve({
				status: true,
				message: "Created By MRHRTZ",
				result: result
			})
		} catch (err) {
			reject(err)
		}
	})
}

async function floNime(medianya, options = {}) {
const { ext } = await fromBuffer(medianya) || options.ext
        var form = new BodyForm()
        form.append('file', medianya, 'tmp.'+ext)
        let jsonnya = await fetch('https://flonime.my.id/upload', {
                method: 'POST',
                body: form
        })
        .then((response) => response.json())
        return jsonnya
}

module.exports = { TelegraPh, UploadFileUgu, webp2mp4File, floNime }