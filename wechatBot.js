// 微信机器人类
import { WechatyBuilder } from "wechaty";
import qrcodeTerminal from "qrcode-terminal";
import { extractSymbolAndWord } from "./tools/reg.js";

export class WechatBot {
  wechatBot = null;
  keywords = ["猫粮"];
  allRoomList = [];
  targetRoomTopic = "测试群";
  sendToRoomTopic = "测试接受群";
  targetRoom = "";
  sendToRoom = "";
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
      this.allRoomList.forEach((room) => console.log(room.topic(), room.id));
      console.log(`目标群聊：`);
      this.targetRoom = await this.wechatBot.Room.find({
        topic: this.targetRoomTopic,
      });
      this.sendToRoom = await this.wechatBot.Room.find({
        topic: this.sendToRoomTopic,
      });
    });

    this.wechatBot.on("message", this.onMessage.bind(this));
    this.wechatBot.start();
  }
  async onMessage(message) {
    // 监听消息回调函数
    const talker = message.talker();
    const room = message.room();
    const text = await message.mentionText(); // 消息内容

    // type: 群聊
    if (room) {
      const roomName = await room.topic();
      // 0. 无关键词或无内容时，不显示群聊
      if (this.keywords.length <= 0 || !text) {
        return;
      }
      // 1. 设置/查看关键词
      const { symbol, keyword } = extractSymbolAndWord(text) || {};
      if (symbol) {
        console.log("捕获到新增关键词：", keyword, "操作为：", symbol);
        switch (symbol) {
          case "+":
            this.keywords.push(keyword);
            break;
          case "-":
            this.keywords = this.keywords.filter((word) => keyword === word);
            break;
          case "*":
            await this.sendToRoom.say(`已设置关键词：${this.keywords}`);
          default:
            break;
        }
        return;
      }
      // 2. 触发关键词
      let matchedKeyword = "";
      const containsAny = this.keywords.some((word) => {
        if (text.includes(word)) {
          matchedKeyword = word; // 如果匹配到关键词，则存储该关键词
          return true;
        }
        return false;
      });
      if (containsAny) {
        console.log(`群聊: ${roomName} 获取到关键词！`);
        console.log(`用户${talker.name()}: ${text}`);
        await this.sendToRoom.say(
          `【检测到关键词：${matchedKeyword}】: ${text}`
        );
      }
    }
  }
}
