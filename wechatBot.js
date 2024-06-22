// 微信机器人类
import { WechatyBuilder } from "wechaty";
import qrcodeTerminal from "qrcode-terminal";

export class WechatBot {
  wechatBot = null;
  keywords = ["猫粮"];
  constructor() {
    this.wechatBot = WechatyBuilder.build();
    this.wechatBot.on("scan", (qrcode, status) => {
      console.log(
        `扫码登录: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(
          qrcode
        )}`
      );
      qrcodeTerminal.generate(qrcode, { small: true });
    });
    this.wechatBot.on("login", (user) =>
      console.log(`当前登录用户：${user}`)
    );

    this.wechatBot.on("message", this.onMessage.bind(this));
    this.wechatBot.start();
  }
  async onMessage(message) {
    // 监听消息回调函数
    const talker = message.talker();
    const room = message.room();
    const text = await message.mentionText(); // 消息内容

    if (room) {
      // type: 群聊
      const roomName = await room.topic();
      // 无关键词或无内容时，不显示群聊
      if (this.keywords.length <= 0 || !text) {
        return;
      }
      // 有关键词时
      const containsAny = this.keywords.some(word => text.includes(word));
      if (containsAny) {
        console.log("获取到关键词！")
        console.log(`群聊: ${roomName}`);
        console.log(`>>>>>>>>>>> 用户${talker.name()}: ${text}`);
      }
    }
  }
}
