require("dotenv").config();
const TeleBot = require("telebot");
const path = require("path");

const { ps } = require("./lib/docker-bot");
const blockWords = require("./lib/profanity");
const commander = require("./lib/powershell");
const { cveDetails, cveGraphic } = require("./lib/CVE");

const bot = new TeleBot(process.env.TELEBOT_TOKEN);

bot.on("text", msg => {
  if (blockWords(msg.text)) {
    bot.deleteMessage(msg.chat.id, msg.message_id);
    bot.sendMessage(
      msg.chat.id,
      `Respeite o grupo ${msg.from.first_name}-${msg.from.username}`
    );
  }
});

bot.on("/location", msg => {
  console.log(msg);
  bot.sendLocation(msg.chat.id, [-1.198034, -47.175172]);
});

bot.on("/ps", async msg => {
  const { id, first_name, username } = msg.from;
  const result = await ps(id, first_name, username);
  bot.sendMessage(msg.chat.id, `${result}`);
});

bot.on("/cmd", async msg => {
  const { id, first_name, username } = msg.from;
  const command = msg.text.split("/cmd");
  const result = await commander(command[1], id, first_name, username);
  bot.sendMessage(msg.chat.id, "```" + result + "```", {
    parseMode: "Markdown"
  });
});

bot.on("/cve", async msg => {
  const cve = msg.text.split("/cve")[1].trim();
  const result = await cveDetails(cve);
  bot.sendMessage(msg.chat.id, `${result}`, {
    parseMode: "Markdown"
  });
});

bot.on("/cveGraphic", async msg => {
  const image = await cveGraphic();
  bot.sendPhoto(msg.chat.id, image);
});
bot.start();
