const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('YOUR_BOT_TOKEN_HERE');
const ADMIN_ID = 'YOUR_ADMIN_ID_HERE';

// Start message with reply keyboard
bot.start((ctx) => {
  ctx.reply('به ربات رسمی MATIOO.NET خوش اومدی.\nسرویس پرسرعت، پشتیبانی حرفه‌ای، اتصال فوری.',
    Markup.keyboard([
      ['🛒 خرید اشتراک', '📋 مشاهده تعرفه‌ها'],
      ['💳 روش پرداخت', '✅ ارسال رسید پرداخت'],
      ['🤝 همکاری در فروش', '🆘 پشتیبانی']
    ]).resize()
  );
});

// Buy Subscription Categories
bot.hears('🛒 خرید اشتراک', (ctx) => {
  ctx.reply('نوع اشتراک مورد نظر رو انتخاب کن:', Markup.inlineKeyboard([
    [Markup.button.callback('💥 پلن‌های VIP', 'vip_plans')],
    [Markup.button.callback('📶 سرویس‌های نامحدود', 'unlimited_plans')],
    [Markup.button.callback('📦 بسته‌های حجمی', 'volume_plans')]
  ]));
});

// VIP Plans
bot.action('vip_plans', (ctx) => {
  ctx.editMessageText('انتخاب کن:', Markup.inlineKeyboard([
    [Markup.button.callback('۱ ماهه VIP - ۵ کاربر - ۵۵۰,۰۰۰ تومان', 'vip_1')],
    [Markup.button.callback('۲ ماهه VIP - ۵ کاربر - ۷۹۰,۰۰۰ تومان', 'vip_2')],
    [Markup.button.callback('۳ ماهه VIP - ۵ کاربر - ۸۴۰,۰۰۰ تومان', 'vip_3')]
  ]));
});

// Unlimited Plans
bot.action('unlimited_plans', (ctx) => {
  ctx.editMessageText('سرویس‌های نامحدود - ۱ کاربره:', Markup.inlineKeyboard([
    [Markup.button.callback('۱ ماهه - ۱۴۵,۰۰۰ تومان', 'unl_1')],
    [Markup.button.callback('۲ ماهه - ۱۹۹,۰۰۰ تومان', 'unl_2')],
    [Markup.button.callback('۳ ماهه - ۲۴۹,۰۰۰ تومان', 'unl_3')]
  ]));
});

// Volume Plans
bot.action('volume_plans', (ctx) => {
  ctx.editMessageText('بسته‌های حجمی - ۲ کاربره:', Markup.inlineKeyboard([
    [Markup.button.callback('۶۰ گیگ - ۲۹۰,۰۰۰ تومان (۶۰ روزه)', 'vol_60')],
    [Markup.button.callback('۱۰۰ گیگ - ۴۴۰,۰۰۰ تومان (۶۰ روزه)', 'vol_100')]
  ]));
});

// Payment method
bot.hears('💳 روش پرداخت', (ctx) => {
  ctx.reply(`برای پرداخت، یکی از روش‌های زیر رو انتخاب کن:

۱. پرداخت آنلاین:
https://aqayepardakht.ir/matioonet

۲. کارت‌به‌کارت:
شماره کارت: 6219-8619-4735-2083
به نام: یونسی راد

بعد از پرداخت، از گزینه «✅ ارسال رسید پرداخت» استفاده کن.`);
});

// Submit receipt
bot.hears('✅ ارسال رسید پرداخت', (ctx) => {
  ctx.reply('لطفاً رسید پرداخت خود را (عکس یا متن) ارسال کنید.');
});

// Forward receipt to admin
bot.on(['photo', 'text'], (ctx) => {
  if (ctx.message.text && ctx.message.text.startsWith('/')) return;
  ctx.forwardMessage(ADMIN_ID);
  ctx.reply('رسید شما دریافت شد. پس از بررسی، کانفیگ برات ارسال میشه.');
});

// Support & Collaboration
bot.hears('🤝 همکاری در فروش', (ctx) => {
  ctx.reply('برای همکاری در فروش، به آی‌دی زیر پیام بده:
@admiiiinnet');
});
bot.hears('🆘 پشتیبانی', (ctx) => {
  ctx.reply('برای پشتیبانی، با آی‌دی زیر در ارتباط باش:
@admiiiinnet');
});

bot.launch();
console.log("Bot is running...");
