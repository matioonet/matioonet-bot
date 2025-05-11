const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

// آیدی ادمین برای فوروارد رسید
const ADMIN_ID = '@admiiiinnet';

// حافظه موقتی برای ذخیره انتخاب پلن هر کاربر
const userState = {};

// منوی اصلی
bot.start((ctx) => {
  return ctx.reply('به ربات رسمی MATIOONET خوش اومدی! یکی از گزینه‌ها رو انتخاب کن:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🚀 خرید اشتراک', callback_data: 'buy_main' }],
        [{ text: '📄 تعرفه‌ها', callback_data: 'pricing' }],
        [{ text: '🧑‍💻 پشتیبانی', url: 'https://t.me/YOUR_SUPPORT' }]
      ]
    }
  });
});

// مرحله 1: انتخاب دسته‌بندی پلن
bot.action('buy_main', (ctx) => {
  ctx.editMessageText('نوع اشتراک موردنظر رو انتخاب کن:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💥 نامحدود ویژه', callback_data: 'plan_unlimited' }],
        [{ text: '📦 حجمی ۳۰ روزه', callback_data: 'plan_30' }],
        [{ text: '📦 حجمی ۶۰ روزه', callback_data: 'plan_60' }],
        [{ text: '📦 حجمی ۹۰ روزه', callback_data: 'plan_90' }],
        [{ text: '👤 VIP تک‌کاربره', callback_data: 'plan_vip1' }],
        [{ text: '👥 VIP سه‌کاربره', callback_data: 'plan_vip3' }],
        [{ text: '👥 VIP پنج‌نفره', callback_data: 'plan_vip5' }],
        [{ text: '👥 VIP هشت‌نفره', callback_data: 'plan_vip8' }],
        [{ text: '↩️ بازگشت', callback_data: 'start' }]
      ]
    }
  });
});

// تعرفه ثابت (تست)
bot.action('pricing', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('برای مشاهده تعرفه‌ها، ابتدا از بخش خرید نوع پلن رو انتخاب کن.');
});

// تابع ساخت دکمه‌های تعرفه
function showPlans(ctx, title, options) {
  userState[ctx.from.id] = title;
  const buttons = options.map(opt => [{ text: opt.label, callback_data: opt.code }]);
  buttons.push([{ text: '↩️ بازگشت', callback_data: 'buy_main' }]);

  ctx.editMessageText(title, {
    reply_markup: {
      inline_keyboard: buttons
    }
  });
}

// پلن‌های مختلف
bot.action('plan_unlimited', (ctx) =>
  showPlans(ctx, 'پلن‌های نامحدود ویژه:', [
    { label: '۱ ماهه - ۱۴۵ هزار', code: 'pay_unlimited_1' },
    { label: '۲ ماهه - ۱۹۹ هزار', code: 'pay_unlimited_2' },
    { label: '۳ ماهه - ۲۴۹ هزار', code: 'pay_unlimited_3' }
  ])
);

bot.action('plan_vip3', (ctx) =>
  showPlans(ctx, 'پلن VIP سه‌کاربره:', [
    { label: '۱ ماهه - ۲۸۰,۰۰۰', code: 'pay_vip3_1' },
    { label: '۲ ماهه - ۳۹۰,۰۰۰', code: 'pay_vip3_2' },
    { label: '۳ ماهه - ۵۵۰,۰۰۰', code: 'pay_vip3_3' }
  ])
);

// سایر پلن‌ها رو مشابه بالا اضافه کن

// دکمه پرداخت
bot.action(/pay_.+/, (ctx) => {
  const userId = ctx.from.id;
  const plan = userState[userId] || 'پلن نامشخص';
  userState[userId + '_selectedPlan'] = ctx.match.input;

  ctx.editMessageText(`${plan}
برای پرداخت روی دکمه زیر بزنید.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '💳 پرداخت آنلاین', url: 'https://aqayepardakht.ir/matioonet' }],
        [{ text: '✅ ارسال رسید پرداخت', callback_data: 'confirm_payment' }]
      ]
    }
  });
});

// پس از پرداخت - ارسال رسید
bot.action('confirm_payment', (ctx) => {
  ctx.editMessageText('لطفاً رسید پرداخت خود را به‌صورت عکس، فایل یا متن همین‌جا ارسال کنید.');
});

// رسید عکس
bot.on('photo', async (ctx) => {
  await ctx.reply('✅ رسید شما دریافت شد. پس از تأیید، اشتراک براتون فعال میشه.');
  const user = ctx.from.username || 'بدون یوزرنیم';
  const time = new Date().toLocaleString('fa-IR');
  await ctx.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
  await ctx.telegram.sendMessage(ADMIN_ID, `رسید جدید از @${user}
زمان: ${time}`);
});

// رسید فایل
bot.on('document', async (ctx) => {
  await ctx.reply('✅ فایل رسید دریافت شد. منتظر تأیید باشید.');
  const user = ctx.from.username || 'بدون یوزرنیم';
  const time = new Date().toLocaleString('fa-IR');
  await ctx.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
  await ctx.telegram.sendMessage(ADMIN_ID, `فایل رسید از @${user}
زمان: ${time}`);
});

// رسید متنی
bot.on('text', async (ctx) => {
  const msg = ctx.message.text;
  if (msg.includes('رسید') || msg.includes('پرداخت') || msg.match(/\d{6,}/)) {
    await ctx.reply('✅ رسید متنی شما دریافت شد. بررسی خواهد شد.');
    const user = ctx.from.username || 'بدون یوزرنیم';
    const time = new Date().toLocaleString('fa-IR');
    await ctx.telegram.sendMessage(ADMIN_ID, `رسید متنی از @${user}
محتوا: ${msg}
زمان: ${time}`);
  }
});

bot.launch();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

app.listen(port, () => {
  console.log(`Web server is running on port ${port}`);
});
