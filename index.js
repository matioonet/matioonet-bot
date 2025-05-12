const { Telegraf, Markup, session } = require('telegraf');

const bot = new Telegraf('7796226856:AAEcPujXpNs7Tq7Ztw6EmOfonJVp02xpuBs');
const ADMIN_ID = '@admiiiinnet';

bot.use(session());

// پیام شروع
bot.start((ctx) => {
  ctx.reply(
    'سلام! به ربات رسمی MATIOONET خوش اومدی.\n' +
    'با ما می‌تونی اشتراک پرسرعت و امن تهیه کنی.\n\n' +
    'یکی از گزینه‌های زیر رو انتخاب کن:',
    Markup.keyboard([
      ['🛒 خرید اشتراک', '📋 تعرفه‌ها'],
      ['💳 روش پرداخت', '✅ ارسال رسید پرداخت'],
      ['🤝 همکاری در فروش', '🆘 پشتیبانی']
    ]).resize()
  );
});

// خرید اشتراک
bot.hears('🛒 خرید اشتراک', (ctx) => {
  ctx.reply(
    'دسته‌بندی پلن‌های اشتراک رو انتخاب کن:',
    Markup.inlineKeyboard([
      [Markup.button.callback('💥 VIP - Rocket Tunnel', 'buy_vip')],
      [Markup.button.callback('📦 حجمی ویژه', 'buy_volume')],
      [Markup.button.callback('🔋 نامحدود ویژه', 'buy_unlimited')],
      [Markup.button.callback('💡 نامحدود بصرفه', 'buy_saver')],
      [Markup.button.callback('⚖️ نامحدود منصفانه', 'buy_fair')]
    ])
  );
});

// تعرفه‌ها
bot.hears('📋 تعرفه‌ها', (ctx) => {
  ctx.reply(
    'برای دیدن تعرفه‌ هر دسته، انتخاب کن:',
    Markup.inlineKeyboard([
      [Markup.button.callback('💥 اشتراک VIP', 'buy_vip')],
      [Markup.button.callback('📦 حجمی ویژه', 'buy_volume')],
      [Markup.button.callback('🔋 نامحدود ویژه', 'buy_unlimited')],
      [Markup.button.callback('💡 نامحدود بصرفه', 'buy_saver')],
      [Markup.button.callback('⚖️ نامحدود منصفانه', 'buy_fair')]
    ])
  );
});

// راهنمای پرداخت
bot.hears('💳 روش پرداخت', (ctx) => {
  ctx.reply(
    `برای پرداخت، یکی از روش‌های زیر رو انتخاب کن:\n\n` +
    `💳 درگاه پرداخت:\nhttps://aqayepardakht.ir/matioonet\n\n` +
    `🏦 کارت‌به‌کارت:\n6219 8619 4735 2083\nبه‌نام: یونسی راد\n\n` +
    `بعد از پرداخت، رسید رو در ربات ارسال کن.`,
    Markup.inlineKeyboard([
      [Markup.button.url('💳 پرداخت آنلاین', 'https://aqayepardakht.ir/matioonet')]
    ])
  );
});

// همکاری در فروش
bot.hears('🤝 همکاری در فروش', (ctx) => {
  ctx.reply('برای همکاری در فروش پیام بده به:\n@admiiiinnet');
});

// پشتیبانی
bot.hears('🆘 پشتیبانی', (ctx) => {
  ctx.reply('پشتیبانی ۲۴ ساعته:\n@admiiiinnet');
});

// ارسال رسید دستی
bot.hears('✅ ارسال رسید پرداخت', (ctx) => {
  ctx.session.awaitingReceipt = true;
  ctx.reply('لطفاً فیش پرداخت رو به‌صورت عکس، متن یا فایل ارسال کن.');
});

// تعرفه‌ها با توضیح کامل
const planMessages = {
  buy_vip:
    '💥 اشتراک VIP - Rocket Tunnel:\n' +
    '۱ ماهه، نامحدود، ۱ کاربر: 160,000 تومان\n' +
    '۲ ماهه، نامحدود، ۲ کاربر: 220,000 تومان\n' +
    '۳ ماهه، نامحدود، ۲ کاربر: 330,000 تومان',

  buy_volume:
    '📦 اشتراک حجمی:\n' +
    '۱۰ گیگ، ۱ ماهه، ۱ کاربر: 40,000 تومان\n' +
    '۲۰ گیگ، ۱ ماهه، ۱ کاربر: 80,000 تومان\n' +
    '۵۰ گیگ، ۲ ماهه، ۲ کاربر: 160,000 تومان',

  buy_unlimited:
    '🔋 اشتراک نامحدود ویژه:\n' +
    '۱ ماهه، ۱ کاربر: 120,000 تومان\n' +
    '۳ ماهه، ۲ کاربر: 320,000 تومان',

  buy_saver:
    '💡 اشتراک نامحدود بصرفه:\n' +
    '۱ ماهه، ۱ کاربر: 75,000 تومان\n' +
    '۲ ماهه، ۱ کاربر: 145,000 تومان\n' +
    '۳ ماهه، ۲ کاربر: 199,000 تومان',

  buy_fair:
    '⚖️ نامحدود منصفانه:\n' +
    '۱ ماهه، ۱ کاربر: 49,000 تومان'
};

// کلیک روی تعرفه‌ها
Object.entries(planMessages).forEach(([action, message]) => {
  bot.action(action, (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(`${message}\n\nبرای پرداخت، از دکمه زیر استفاده کن:`,
      Markup.inlineKeyboard([
        [Markup.button.url('💳 پرداخت آنلاین', 'https://aqayepardakht.ir/matioonet')],
        [Markup.button.callback('✅ ارسال رسید پرداخت', 'go_receipt')]
      ])
    );
  });
});

// دکمه ارسال رسید پرداخت
bot.action('go_receipt', (ctx) => {
  ctx.answerCbQuery();
  ctx.session.awaitingReceipt = true;
  ctx.reply('لطفاً فیش پرداخت رو همین‌جا بفرست.');
});

// دریافت و ارسال رسید به ادمین
bot.on('message', async (ctx) => {
  if (ctx.session.awaitingReceipt) {
    ctx.reply('✅ رسیدت دریافت شد. در حال بررسی هستیم.');

    const userInfo = `📥 رسید پرداخت از کاربر: @${ctx.from.username || ctx.from.id}`;

    if (ctx.message.photo) {
      const file = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      await bot.telegram.sendPhoto(ADMIN_ID, file, {
        caption: userInfo
      });
    } else if (ctx.message.document) {
      await bot.telegram.sendDocument(ADMIN_ID, ctx.message.document.file_id, {
        caption: userInfo
      });
    } else if (ctx.message.text) {
      await bot.telegram.sendMessage(ADMIN_ID, `${userInfo}\n\n${ctx.message.text}`);
    }

    ctx.session.awaitingReceipt = false;
  }
});

bot.launch();
