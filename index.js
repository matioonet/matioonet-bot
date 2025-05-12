require("dotenv").config();
const { Telegraf, Markup, session } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;
bot.use(session());

// منوی اصلی
bot.start((ctx) => {
  ctx.reply("به ربات رسمی MATIOONET خوش اومدی. یکی از گزینه‌های زیر رو انتخاب کن:",
    Markup.keyboard([
      ["🛒 خرید اشتراک", "📋 مشاهده تعرفه‌ها"],
      ["💳 روش پرداخت", "✅ ارسال رسید پرداخت"],
      ["🤝 همکاری در فروش", "🆘 پشتیبانی"]
    ]).resize()
  );
});

// دسته‌بندی خرید
bot.hears("🛒 خرید اشتراک", (ctx) => {
  ctx.reply("نوع اشتراک مورد نظرت رو انتخاب کن:", Markup.inlineKeyboard([
    [Markup.button.callback("💥 VIP - چندکاربره نامحدود", "vip")],
    [Markup.button.callback("📶 نامحدود - ویژه و بصرفه", "unlimited")],
    [Markup.button.callback("📦 حجمی - ۲ کاربره", "volume")]
  ]));
});

// پلن‌های VIP
bot.action("vip", (ctx) => {
  ctx.editMessageText("انتخاب کن:", Markup.inlineKeyboard([
    [Markup.button.callback("۳ کاربره - ۱ ماهه - ۲۸۰,۰۰۰ تومان", "vip_3_1")],
    [Markup.button.callback("۳ کاربره - ۲ ماهه - ۳۹۰,۰۰۰ تومان", "vip_3_2")],
    [Markup.button.callback("۳ کاربره - ۳ ماهه - ۵۵۰,۰۰۰ تومان", "vip_3_3")],
    [Markup.button.callback("۵ کاربره - ۱ ماهه - ۵۵۰,۰۰۰ تومان", "vip_5_1")],
    [Markup.button.callback("۵ کاربره - ۲ ماهه - ۷۹۰,۰۰۰ تومان", "vip_5_2")],
    [Markup.button.callback("۵ کاربره - ۳ ماهه - ۸۴۰,۰۰۰ تومان", "vip_5_3")],
    [Markup.button.callback("۸ کاربره - ۱ ماهه - ۸۴۰,۰۰۰ تومان", "vip_8_1")],
    [Markup.button.callback("۸ کاربره - ۲ ماهه - ۹۹۹,۰۰۰ تومان", "vip_8_2")],
    [Markup.button.callback("۸ کاربره - ۳ ماهه - ۱,۱۵۰,۰۰۰ تومان", "vip_8_3")]
  ]));
});

// پلن‌های نامحدود
bot.action("unlimited", (ctx) => {
  ctx.editMessageText("سرویس‌های نامحدود - ۱ کاربره:", Markup.inlineKeyboard([
    [Markup.button.callback("بصرفه - ۱ ماهه - ۷۵,۰۰۰ تومان", "unl_b_1")],
    [Markup.button.callback("بصرفه - ۲ ماهه - ۱۴۵,۰۰۰ تومان", "unl_b_2")],
    [Markup.button.callback("بصرفه - ۳ ماهه - ۱۹۹,۰۰۰ تومان", "unl_b_3")],
    [Markup.button.callback("ویژه - ۱ ماهه - ۱۴۵,۰۰۰ تومان", "unl_v_1")],
    [Markup.button.callback("ویژه - ۲ ماهه - ۱۹۹,۰۰۰ تومان", "unl_v_2")],
    [Markup.button.callback("ویژه - ۳ ماهه - ۲۴۹,۰۰۰ تومان", "unl_v_3")]
  ]));
});

// پلن‌های حجمی
bot.action("volume", (ctx) => {
  ctx.editMessageText("بسته‌های حجمی - ۲ کاربره:", Markup.inlineKeyboard([
    [Markup.button.callback("۶۰ گیگ - ۲۹۰,۰۰۰ (۶۰ روز)", "vol_60_2")],
    [Markup.button.callback("۱۰۰ گیگ - ۴۴۰,۰۰۰ (۶۰ روز)", "vol_100_2")],
    [Markup.button.callback("۱۵۰ گیگ - ۵۵۰,۰۰۰ (۶۰ روز)", "vol_150_2")],
    [Markup.button.callback("۲۰۰ گیگ - ۶۷۰,۰۰۰ (۶۰ روز)", "vol_200_2")],
    [Markup.button.callback("۳۰۰ گیگ - ۷۹۰,۰۰۰ (۹۰ روز)", "vol_300_3")]
  ]));
});

// پس از انتخاب هر پلن
bot.action(/^(vip|unl|vol)_.*$/, (ctx) => {
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
  ctx.reply("لطفاً رسید پرداخت (عکس یا متن) رو همین‌جا ارسال کن.");
});

// فوروارد رسید به ادمین
bot.on(["photo", "text"], async (ctx) => {
  if (ctx.session.expectingReceipt) {
    try {
      await ctx.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
      await ctx.telegram.sendMessage(ADMIN_ID, `رسید جدید از @${ctx.from.username || ctx.from.first_name}`);
      await ctx.reply("رسیدت دریافت شد. بررسی میشه و کانفیگ برات ارسال میشه.");
    } catch {
      await ctx.reply("خطا در ارسال رسید. دوباره امتحان کن.");
    }
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
bot.hears("🤝 همکاری در فروش", (ctx) => ctx.reply("برای همکاری در فروش به آیدی زیر پیام بده:\n@admiiiinnet"));
bot.hears("🆘 پشتیبانی", (ctx) => ctx.reply("برای پشتیبانی به آیدی زیر پیام بده:\n@admiiiinnet"));

bot.launch();
