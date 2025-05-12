require("dotenv").config();
const { Telegraf, Markup, session } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;
bot.use(session());

// دکمه شروع
bot.start((ctx) => {
  ctx.reply("به ربات رسمی MATIOONET خوش اومدی. یکی از گزینه‌های زیر رو انتخاب کن:",
    Markup.keyboard([
      ["🛒 خرید اشتراک", "📋 مشاهده تعرفه‌ها"],
      ["💳 روش پرداخت", "✅ ارسال رسید پرداخت"],
      ["🤝 همکاری در فروش", "🆘 پشتیبانی"]
    ]).resize()
  );
});

// منوی خرید
bot.hears("🛒 خرید اشتراک", (ctx) => {
  ctx.reply("نوع اشتراک رو انتخاب کن:", Markup.inlineKeyboard([
    [Markup.button.callback("💥 پلن‌های VIP", "vip")],
    [Markup.button.callback("📶 سرویس‌های نامحدود", "unlimited")],
    [Markup.button.callback("📦 بسته‌های حجمی", "volume")]
  ]));
});

// VIP Plans
bot.action("vip", (ctx) => {
  ctx.editMessageText("پلن VIP مورد نظر رو انتخاب کن:", Markup.inlineKeyboard([
    [Markup.button.callback("۳ کاربر - ۱ ماهه - ۲۸۰,۰۰۰ تومان", "vip_3_1")],
    [Markup.button.callback("۵ کاربر - ۱ ماهه - ۵۵۰,۰۰۰ تومان", "vip_5_1")],
    [Markup.button.callback("۸ کاربر - ۱ ماهه - ۸۴۰,۰۰۰ تومان", "vip_8_1")]
  ]));
});

// Unlimited Plans
bot.action("unlimited", (ctx) => {
  ctx.editMessageText("پلن نامحدود تک‌کاربره:", Markup.inlineKeyboard([
    [Markup.button.callback("۱ ماهه بصرفه - ۷۵,۰۰۰ تومان", "unl_1_75")],
    [Markup.button.callback("۱ ماهه ویژه - ۱۴۵,۰۰۰ تومان", "unl_1_145")],
    [Markup.button.callback("۳ ماهه ویژه - ۲۴۹,۰۰۰ تومان", "unl_3_249")]
  ]));
});

// Volume Plans
bot.action("volume", (ctx) => {
  ctx.editMessageText("بسته‌های حجمی - ۲ کاربره:", Markup.inlineKeyboard([
    [Markup.button.callback("۶۰ گیگ - ۲۹۰,۰۰۰ تومان (۶۰ روزه)", "vol_60_2")],
    [Markup.button.callback("۱۰۰ گیگ - ۴۴۰,۰۰۰ تومان (۶۰ روزه)", "vol_100_2")],
    [Markup.button.callback("۳۰۰ گیگ - ۷۹۰,۰۰۰ تومان (۹۰ روزه)", "vol_300_3")]
  ]));
});

// منطق انتخاب پلن
bot.action(/.*/, (ctx) => {
  ctx.answerCbQuery();
  ctx.session.selectedPlan = ctx.match.input;
  ctx.reply("برای پرداخت از دکمه زیر استفاده کن:", Markup.inlineKeyboard([
    [Markup.button.url("💳 پرداخت آنلاین", "https://aqayepardakht.ir/matioonet")],
    [Markup.button.callback("✅ ارسال رسید پرداخت", "send_receipt")]
  ]));
});

// فعال‌سازی حالت ارسال رسید
bot.action("send_receipt", (ctx) => {
  ctx.session.expectingReceipt = true;
  ctx.reply("لطفاً عکس یا متن رسید پرداختت رو همینجا بفرست.");
});

// فقط در حالت رسید → ارسال به ادمین
bot.on(["photo", "text"], async (ctx) => {
  if (ctx.session.expectingReceipt) {
    await ctx.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
    await ctx.telegram.sendMessage(ADMIN_ID, `رسید جدید از @${ctx.from.username || ctx.from.first_name}`);
    await ctx.reply("رسیدت دریافت شد. پس از بررسی، کانفیگ برات ارسال میشه.");
    ctx.session.expectingReceipt = false;
  }
});

// مشاهده تعرفه‌ها
bot.hears("📋 مشاهده تعرفه‌ها", (ctx) => {
  ctx.reply("دسته‌بندی تعرفه‌ها:", Markup.inlineKeyboard([
    [Markup.button.callback("💥 مشاهده VIP", "vip")],
    [Markup.button.callback("📶 مشاهده نامحدود", "unlimited")],
    [Markup.button.callback("📦 مشاهده حجمی", "volume")]
  ]));
});

// روش پرداخت
bot.hears("💳 روش پرداخت", (ctx) => {
  ctx.reply("روش‌های پرداخت:\n\n" +
    "۱. پرداخت آنلاین:\nhttps://aqayepardakht.ir/matioonet\n\n" +
    "۲. کارت به کارت:\n6219 8619 4735 2083\nبه نام: یونسی راد"
  );
});

// همکاری و پشتیبانی
bot.hears("🤝 همکاری در فروش", (ctx) => ctx.reply("برای همکاری در فروش، به آیدی زیر پیام بده:\n@admiiiinnet"));
bot.hears("🆘 پشتیبانی", (ctx) => ctx.reply("برای پشتیبانی، به آیدی زیر پیام بده:\n@admiiiinnet"));

bot.launch();
