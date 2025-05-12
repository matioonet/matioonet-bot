require("dotenv").config();
const { Telegraf, Markup, session } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;
bot.use(session());

// منوی اصلی
bot.start((ctx) => {
  ctx.reply("به ربات رسمی MATIOONET خوش اومدی. لطفاً یکی از گزینه‌های زیر رو انتخاب کن:",
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
    [Markup.button.callback("💥 پلن‌های VIP (چندکاربره - نامحدود)", "category_vip")],
    [Markup.button.callback("📶 پلن‌های نامحدود (تک کاربره)", "category_unlimited")],
    [Markup.button.callback("📦 پلن‌های حجمی (۲ کاربره)", "category_volume")]
  ]));
});

// پلن‌های VIP
bot.action("category_vip", (ctx) => {
  ctx.editMessageText("پلن VIP مورد نظر رو انتخاب کن:", Markup.inlineKeyboard([
    [Markup.button.callback("۳ کاربر - ۱ ماهه - ۲۸۰,۰۰۰", "vip_3_1")],
    [Markup.button.callback("۳ کاربر - ۲ ماهه - ۳۹۰,۰۰۰", "vip_3_2")],
    [Markup.button.callback("۳ کاربر - ۳ ماهه - ۵۵۰,۰۰۰", "vip_3_3")],
    [Markup.button.callback("۵ کاربر - ۱ ماهه - ۵۵۰,۰۰۰", "vip_5_1")],
    [Markup.button.callback("۵ کاربر - ۲ ماهه - ۷۹۰,۰۰۰", "vip_5_2")],
    [Markup.button.callback("۵ کاربر - ۳ ماهه - ۸۴۰,۰۰۰", "vip_5_3")],
    [Markup.button.callback("۸ کاربر - ۱ ماهه - ۸۴۰,۰۰۰", "vip_8_1")],
    [Markup.button.callback("۸ کاربر - ۲ ماهه - ۹۹۹,۰۰۰", "vip_8_2")],
    [Markup.button.callback("۸ کاربر - ۳ ماهه - ۱,۱۵۰,۰۰۰", "vip_8_3")]
  ]));
});

// پلن‌های نامحدود
bot.action("category_unlimited", (ctx) => {
  ctx.editMessageText("پلن نامحدود تک‌کاربره:", Markup.inlineKeyboard([
    [Markup.button.callback("بصرفه - ۱ ماهه - ۷۵,۰۰۰", "unl_b_1")],
    [Markup.button.callback("بصرفه - ۲ ماهه - ۱۴۵,۰۰۰", "unl_b_2")],
    [Markup.button.callback("بصرفه - ۳ ماهه - ۱۹۹,۰۰۰", "unl_b_3")],
    [Markup.button.callback("ویژه - ۱ ماهه - ۱۴۵,۰۰۰", "unl_v_1")],
    [Markup.button.callback("ویژه - ۲ ماهه - ۱۹۹,۰۰۰", "unl_v_2")],
    [Markup.button.callback("ویژه - ۳ ماهه - ۲۴۹,۰۰۰", "unl_v_3")]
  ]));
});

// پلن‌های حجمی
bot.action("category_volume", (ctx) => {
  ctx.editMessageText("پلن‌های حجمی ۲ کاربره:", Markup.inlineKeyboard([
    [Markup.button.callback("۶۰ گیگ - ۲۹۰,۰۰۰ (۶۰ روز)", "vol_60_60")],
    [Markup.button.callback("۱۰۰ گیگ - ۴۴۰,۰۰۰ (۶۰ روز)", "vol_100_60")],
    [Markup.button.callback("۱۵۰ گیگ - ۵۵۰,۰۰۰ (۶۰ روز)", "vol_150_60")],
    [Markup.button.callback("۲۰۰ گیگ - ۶۷۰,۰۰۰ (۶۰ روز)", "vol_200_60")],
    [Markup.button.callback("۳۰۰ گیگ - ۷۹۰,۰۰۰ (۹۰ روز)", "vol_300_90")]
  ]));
});

// منطق پرداخت بعد از انتخاب هر پلن
bot.action(/^(vip|unl|vol)_.*$/, (ctx) => {
  ctx.answerCbQuery();
  ctx.session.selectedPlan = ctx.match.input;
  ctx.reply("برای پرداخت، یکی از روش‌های زیر رو انتخاب کن:", Markup.inlineKeyboard([
    [Markup.button.url("💳 پرداخت آنلاین", "https://aqayepardakht.ir/matioonet")],
    [Markup.button.callback("✅ ارسال رسید پرداخت", "send_receipt")]
  ]));
});

// فعال‌سازی ارسال رسید
bot.action("send_receipt", (ctx) => {
  ctx.session.expectingReceipt = true;
  ctx.reply("لطفاً رسید پرداخت (عکس یا متن) رو همینجا ارسال کن تا بررسی بشه.");
});

// دریافت رسید فقط بعد از انتخاب پلن
bot.on(["photo", "text"], async (ctx) => {
  if (ctx.session.expectingReceipt) {
    try {
      await ctx.telegram.forwardMessage(ADMIN_ID, ctx.chat.id, ctx.message.message_id);
      await ctx.telegram.sendMessage(ADMIN_ID, `رسید جدید از @${ctx.from.username || ctx.from.first_name}`);
      await ctx.reply("رسید دریافت شد. کانفیگ به‌زودی برات ارسال میشه.");
    } catch {
      await ctx.reply("خطا در ارسال رسید. دوباره تلاش کن.");
    }
    ctx.session.expectingReceipt = false;
  }
});

// مشاهده تعرفه‌ها
bot.hears("📋 مشاهده تعرفه‌ها", (ctx) => {
  ctx.reply("دسته‌بندی تعرفه‌ها:", Markup.inlineKeyboard([
    [Markup.button.callback("💥 مشاهده VIP", "category_vip")],
    [Markup.button.callback("📶 مشاهده نامحدود", "category_unlimited")],
    [Markup.button.callback("📦 مشاهده حجمی", "category_volume")]
  ]));
});

// روش پرداخت
bot.hears("💳 روش پرداخت", (ctx) => {
  ctx.reply("روش‌های پرداخت:\n\n" +
    "۱. پرداخت آنلاین:\nhttps://aqayepardakht.ir/matioonet\n\n" +
    "۲. کارت به کارت:\n6219 8619 4735 2083\nبه نام: یونسی راد"
  );
});

// پشتیبانی و همکاری
bot.hears("🤝 همکاری در فروش", (ctx) => ctx.reply("برای همکاری در فروش به آیدی زیر پیام بده:\n@admiiiinnet"));
bot.hears("🆘 پشتیبانی", (ctx) => ctx.reply("برای پشتیبانی با ما در تماس باش:\n@admiiiinnet"));

bot.launch();
