const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('خوش اومدی به ربات MATIOONET! برای خرید اشتراک دستور /buy رو بزن.');
});

bot.launch();
