require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;

// Start
bot.start((ctx) => {
  ctx.reply('سلام! به ربات رسمی MATIOONET خوش اومدی.', Markup.keyboard([
    ['🛒 خرید اشتراک', '📋 تعرفه‌ها'],
    ['💳 روش پرداخت', '✅ ارسال رسید پرداخت'],
    ['🤝 همکاری در فروش', '🆘 پشتیبانی']
  ]).resize());
});

// خرید
bot.hears('🛒 خرید اشتراک', (ctx) => {
  ctx.reply('پلن مورد نظر رو انتخاب کن:', Markup.inlineKeyboard([
    [Markup.button.callback('۱ ماهه نامحدود ۱ کاربر ۲۰۰ تومان', 'plan1')],
    [Markup.button.callback('۲ ماهه نامحدود ۱ کاربر ۲۹۰ تومان', 'plan2')]
  ]));
});

// پرداخت
bot.hears('💳 روش پرداخت', (ctx) => {
  ctx.reply('برای پرداخت، از لینک زیر استفاده کن:\nhttps://aqayepardakht.ir/matioonet\nیا کارت به کارت:\n6219-8619-4735-2083\nیونسی راد');
});

// رسید
bot.hears('✅ ارسال رسید پرداخت', (ctx) => {
  ctx.reply('لطفاً عکس یا متن رسید پرداخت رو همینجا ارسال کن.');
});

// فوروارد برای ادمین
bot.on(['photo', 'text'], (ctx) => {
  if (ctx.message.text && ctx.message.text.startsWith('/')) return;
  ctx.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
  ctx.reply('رسیدت دریافت شد. به زودی بررسی میشه.');
});

// سایر دکمه‌ها
bot.hears('🤝 همکاری در فروش', (ctx) => ctx.reply('به @admiiiinnet پیام بده.'));
bot.hears('🆘 پشتیبانی', (ctx) => ctx.reply('برای پشتیبانی، با @admiiiinnet در ارتباط باش.'));

bot.launch();
