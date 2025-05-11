const { Telegraf } = require('telegraf');

const bot = new Telegraf('7796226856:AAEcPujXpNs7Tq7Ztw6EmOfonJVp02xpuBs');

bot.start((ctx) => {
  ctx.reply('خوش اومدی به ربات MATIOONET! برای خرید اشتراک دستور /buy رو بزن.');
});

bot.launch();
