require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;
bot.use(session());

// پیام شروع
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
    [Markup.button.callback('۲ ماهه نامحدود ۱ کاربر ۲۹۰ تومان', 'plan2')],
    [Markup.button.callback('۳ ماهه نامحدود ۱ کاربر ۳۵۰ تومان', 'plan3')]
  ]));
});

// پاسخ به انتخاب پلن‌ها
bot.on('callback_query', (ctx) => {
  const plans = {
    plan1: '۱ ماهه نامحدود ۱ کاربر - ۲۰۰ هزار تومان',
    plan2: '۲ ماهه نامحدود ۱ کاربر - ۲۹۰ هزار تومان',
    plan3: '۳ ماهه نامحدود ۱ کاربر - ۳۵۰ هزار تومان'
  };
  const selected = ctx.callbackQuery.data;
  ctx.answerCbQuery();
  ctx.reply(`پلن انتخابی: ${plans[selected]}\n\nبرای پرداخت از دکمه‌های زیر استفاده کن.`);
});

// روش پرداخت
bot.hears('💳 روش پرداخت', (ctx) => {
  ctx.reply('برای پرداخت از یکی از روش‌های زیر استفاده کن:\n\n' +
    '1. لینک پرداخت مستقیم:\nhttps://aqayepardakht.ir/matioonet\n\n' +
    '2. کارت به کارت:\n6219 8619 4735 2083\nبه نام: یونسی راد');
});

// آماده دریافت رسید
bot.hears('✅ ارسال رسید پرداخت', (ctx) => {
  ctx.session.expectingReceipt = true;
  ctx.reply('لطفاً عکس یا متن رسید پرداخت رو همینجا ارسال کن.');
});

// دریافت و ارسال رسید به ادمین
bot.on(['photo', 'text'], async (ctx) => {
  if (ctx.session.expectingReceipt) {
    try {
      await ctx.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
      await ctx.telegram.sendMessage(ADMIN_ID, `رسید جدید از ${ctx.from.username || ctx.from.first_name}`);
      await ctx.reply('رسیدت دریافت شد. به زودی بررسی میشه.');
    } catch (err) {
      await ctx.reply('ارسال رسید با خطا مواجه شد.');
    }
    ctx.session.expectingReceipt = false;
  }
});

// پشتیبانی و همکاری
bot.hears('🤝 همکاری در فروش', (ctx) => ctx.reply('برای همکاری در فروش به آیدی زیر پیام بده:\n@admiiiinnet'));
bot.hears('🆘 پشتیبانی', (ctx) => ctx.reply('برای پشتیبانی با آیدی زیر در تماس باش:\n@admiiiinnet'));

bot.launch();
