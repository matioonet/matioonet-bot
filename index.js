const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply('به ربات رسمی MATIOONET خوش اومدی!\nیکی از گزینه‌ها رو انتخاب کن:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🚀 خرید اشتراک', callback_data: 'buy' }],
        [{ text: '📄 تعرفه‌ها', callback_data: 'pricing' }],
        [{ text: '🧑‍💻 پشتیبانی', url: 'https://t.me/YOUR_SUPPORT' }]
      ]
    }
  });
});

bot.action('buy', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('برای خرید اشتراک یکی از پلن‌های زیر رو انتخاب کن:\n\n1. اقتصادی - ۳۰ هزار تومان\n2. نامحدود - ۵۵ هزار تومان\n3. VIP - ۹۰ هزار تومان');
});

bot.action('pricing', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('📄 تعرفه‌ها:\n\n💼 اقتصادی: ۲۰ گیگ / ۳۰ هزار تومان\n🔥 نامحدود: ۳۰ روز / ۵۵ هزار تومان\n👑 VIP: سرعت بالا / ۹۰ هزار تومان');
});

bot.launch();
