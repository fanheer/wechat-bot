const { WechatyBuilder } = require('wechaty');
const qrcodeTerminal = require('qrcode-terminal');

const wechaty = WechatyBuilder.build();

wechaty.on('scan', (qrcode, status) => {
	console.log(`扫码登录: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`)
	qrcodeTerminal.generate(qrcode, { small: true })
})
wechaty.on('login', user => console.log(`当前登录用户：<${user}>`))

wechaty.on('message', async message => {
	const talker = message.talker()
	const text = message.text()
	const room = message.room()

	if (room) {
		// 群聊
		const roomName = await room.topic()
		if(text){
			console.log(`群聊: ${roomName}`)
			console.log(`>>>>>>>>>>> 用户${talker.name()}: ${text}`)
		}
	} else {
		// 联系人
		// 目前不需要
		// console.log(`>>>>>>>>>>> 用户${talker.name()}: ${text}`)
	}
})


wechaty.start()
	.then(() => console.log('Bot started'))
	.catch(e => console.error(e))