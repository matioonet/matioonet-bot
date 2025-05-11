const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = '@admiiiinnet';

const tariffs = [
  { label: 'نامحدود ویژه', price: '120,000 تومان' },
  { label: 'حجمی ۳۰ روزه', price: '60,000 تومان' },
  { label: 'حجمی ۶۰ روزه', price: '100,000 تومان' },
  { label: 'حجمی ۹۰ روزه', price: '140,000 تومان' },
  { label: 'VIP تک‌نفره', price: '150,000 تومان' },
  { label: 'VIP سه‌نفره', price: '300,000 تومان' },
  { label: 'VIP پنج‌نفره', price: '450,000 تومان' },
  { label: 'VIP هشت‌نفره', price: '600,000 تومان' }
];

bot.start((ctx) => {
  return ctx.reply('به ربات رسمی MATIOONET خوش آمدی. نوع اشتراک موردنظر رو انتخاب کن:', Markup.inlineKeyboard([
    [Markup.button.callback('🚀 خرید اشتراک', 'buy_main')],
    [Markup.button.callback('📄 تعرفه‌ها', 'show_tariffs')],
    [Markup.button.url('🧑‍💻 پشتیبانی', 'https://t.me/admiiiinnet')]
  ]));
});

bot.action('buy_main', (ctx) => {
  return ctx.editMessageText('لطفاً نوع اشتراک را انتخاب کن:', Markup.inlineKeyboard([
    [Markup.button.callback('💥 نامحدود ویژه', 'plan_0')],
    [Markup.button.callback('📦 حجمی ۳۰ روزه', 'plan_1')],
    [Markup.button.callback('📦 حجمی ۶۰ روزه', 'plan_2')],
    [Markup.button.callback('📦 حجمی ۹۰ روزه', 'plan_3')],
    [Markup.button.callback('👤 VIP تک‌نفره', 'plan_4')],
    [Markup.button.callback('👥 VIP سه‌نفره', 'plan_5')],
    [Markup.button.callback('👥 VIP پنج‌نفره', 'plan_6')],
    [Markup.button.callback('👥 VIP هشت‌نفره', 'plan_7')],
    [Markup.button.callback('🔙 بازگشت', 'back_home')]
  ]));
});

tariffs.forEach((item, index) => {
  bot.action('plan_' + index, (ctx) => {
    ctx.reply(`اشتراک انتخابی شما: ${item.label}
قیمت: ${item.price}
برای پرداخت روی دکمه زیر کلیک کن:`,
      Markup.inlineKeyboard([
        [Markup.button.url('💳 پرداخت آنلاین', 'https://zarinp.al/matioonet')],
        [Markup.button.callback('✅ ارسال رسید پرداخت', 'send_receipt')],
        [Markup.button.callback('🔙 بازگشت', 'buy_main')]
      ]));
  });
});

bot.action('show_tariffs', (ctx) => {
  let msg = '*تعرفه‌های MATIOONET:*

';
  tariffs.forEach(t => {
    msg += `• ${t.label}: ${t.price}
`;
  });
  ctx.replyWithMarkdown(msg);
});

bot.action('send_receipt', (ctx) => {
  ctx.reply('لطفاً رسید پرداخت خود را به‌صورت عکس یا متن همین‌جا ارسال کن.');
  ctx.session = { awaitingReceipt: true };
});

bot.on('message', async (ctx) => {
  if (ctx.session && ctx.session.awaitingReceipt) {
    ctx.reply('رسیدت دریافت شد. پس از بررسی بهت پیام میدیم.');
    await bot.telegram.sendMessage(ADMIN_ID, `یک رسید پرداخت جدید ارسال شده توسط کاربر @${ctx.from.username || ctx.from.id}:

${ctx.message.text || ''}`);
    if (ctx.message.photo) {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      await bot.telegram.sendPhoto(ADMIN_ID, fileId, { caption: 'رسید پرداخت بالا مربوط به همین کاربر است.' });
    }
    ctx.session.awaitingReceipt = false;
  }
});

bot.launch();
