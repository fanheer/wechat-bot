import { WechatBot } from './wechatBot.js'
(async () => {
    try {
      new WechatBot();
    } catch (e) {
      console.error(e);
    }
})();