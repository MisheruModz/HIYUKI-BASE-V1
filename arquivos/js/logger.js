const colors = require('colors')

const GrayLog = (msg) => console.log(colors.gray(`[LOG] ${msg}`))
const BlueLog = (msg) => console.log(colors.blue(`[INPUT] ${msg}`))
const CyanLog = (msg) => console.log(colors.cyan(`[INFO] ${msg}`))
const GreenLog = (msg) => console.log(colors.green(`[SUCCESS] ${msg}`))
const RedLog = (msg) => console.log(colors.red(`[ERROR] ${msg}`))
const YellowLog = (msg) => console.log(colors.yellow(`[WARNING] ${msg}`))
const MagentaLog = (msg) => console.log(colors.magenta(`[EVENT] ${msg}`))

module.exports = { GrayLog, BlueLog, CyanLog, GreenLog, RedLog, YellowLog, MagentaLog }