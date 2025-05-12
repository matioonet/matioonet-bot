const { Telegraf } = require('telegraf');

const bot = new Telegraf('7796226856:AAEcPujXpNs7Tq7Ztw6EmOfonJVp02xpuBs');

bot.start((ctx) => {
  console.log('دستور /start اجرا شد برای کاربر:', ctx.from.id);
  ctx.reply('سلام! ربات تست شد. اگه این پیام رو دیدی، ربات کار می‌کنه!').catch((err) => {
    console.error('خطا در ارسال پیام:', err.message);
  });
});

bot.launch().then(() => {
  console.log('ربات با موفقیت شروع شد.');
}).catch((err) => {
  console.error('خطا در شروع ربات:', err.message);
});

process.once('SIGINT', () => {
  console.log('ربات متوقف شد.');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  console.log('ربات متوقف شد.');
  bot.stop('SIGTERM');
});
