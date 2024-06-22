// 微信机器人类
import { WechatyBuilder } from "wechaty";
import qrcodeTerminal from "qrcode-terminal";

export class WechatBot {
  wechatBot = null;
  keywords = ["猫粮"];
  allRoomList = [];
  targetRoomTopic = '区区,柚子OvO';
  sendToRoomTopic = '打卡群（打卡失败发5块红包）';
  targetRoom = ''
  sendToRoom = '';
  constructor() {
    this.allRoomList = [];
    this.wechatBot = WechatyBuilder.build();
    this.wechatBot.on("scan", (qrcode, status) => {
      console.log(`扫码登录: ${status}\n 或点击链接进入${qrcode}`);
      qrcodeTerminal.generate(qrcode, { small: true });
    });
    this.wechatBot.on("login", async (user) => {
      console.log(`当前登录用户：${user}`);
      // 在登录成功后获取并缓存群聊列表
      this.allRoomList = await this.wechatBot.Room.findAll();
      console.log(`当前群聊列表：`);
      this.allRoomList.forEach(room => console.log(room.topic(), room.id));
      console.log(`目标群聊：`);
      this.targetRoom = await this.wechatBot.Room.find({topic: this.targetRoomTopic})
      this.sendToRoom = await this.wechatBot.Room.find({topic: this.sendToRoomTopic})
    });

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
      const containsAny = this.keywords.some((word) => text.includes(word));
      if (containsAny) {
        console.log("获取到关键词！");
        console.log(`群聊: ${roomName}`);
        console.log(`>>>>>>>>>>> 用户${talker.name()}: ${text}`);
        await this.sendToRoom.say(`【检测到关键词：】: ${text}`);
      }
    }
  }
}
