const TelegramBot = require("node-telegram-bot-api");
const { Settings } = require("./utils.js");
const fs = require("fs");

const data = fs.readFileSync("/app/src/data.json", "utf-8");
const obj = JSON.parse(data);

const banlist = ["7100235696"];

const utils = new Settings();

const bot = new TelegramBot(utils.token, { polling: true });

bot.on("message", (msg) => {
  if (msg.chat.type != "private") return;
  if(banlist.includes(msg.from.id)) {
    bot.sendMessage(msg.chat.id, `ИДИ НАХУЙ`);
    return;
  }
  if (!msg.photo) {
    bot.sendMessage(msg.chat.id, `Не прикреплена фотография!`);
    return;
  }
  if (!msg.caption) {
    bot.sendMessage(msg.chat.id, `Нет текста сообщения!`);
    return;
  }
  for (let i = 0; i < obj.table.length; i++) {
    if (msg.caption.includes(obj.table[i].typology)) {
      if (msg.caption == obj.table[i].typology) {
        bot.sendMessage(msg.chat.id, `Нет имени персонажа!`);
        return;
      }
      hashtags = obj.table[i].typology
        .split(" ")
        .map((s) => "\\#" + s)
        .join(" ");
      try {
        bot.copyMessage(-1002218816805, msg.chat.id, msg.message_id, {
          caption: `${msg.caption.replace(obj.table[i].typology, "").slice(0, -1)}\n${obj.table[i].typology}\n>${hashtags}\n@nasralishe\\_tipov\\_bot \\| @nasralishe\\_tipov`,
          parse_mode: "MarkdownV2",
        });
        bot.sendMessage(msg.chat.id, `Пост отправлен!`);
      } catch (err) {
        bot.sendMessage(msg.chat.id, `Возникла ошибка: ${err}`);
      }
    }
  }
});

bot.on("polling_error", (err) => {
  console.log("--------------------------------------------------");
  console.log("Что-то создает скриптовые ошибки: " + err.stack);
  console.log("--------------------------------------------------");
});
