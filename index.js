const { Telegraf } = require('telegraf');

const bot = new Telegraf('YOUR_BOT_TOKEN'); // توکنت رو از BotFather بگیر و اینجا بذار

// دستور /start
bot.start((ctx) => {
  ctx.reply('به ربات فیلترشکن ماتیونت خوش اومدی!\nیه گزینه رو انتخاب کن:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'انتخاب سرور', callback_data: 'servers' }],
        [{ text: 'تعرفه‌ها', callback_data: 'pricing' }],
        [{ text: 'پرداخت', callback_data: 'payment' }],
        [{ text: 'پشتیبانی', callback_data: 'support' }]
      ]
    }
  });
});

// مدیریت دکمه‌ها
bot.on('callback_query', (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data === 'servers') {
    ctx.editMessageText('یه سرور انتخاب کن:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Rocket Tunnel', callback_data: 'server_rocket' }],
          [{ text: 'V2Ray', callback_data: 'server_v2ray' }],
          [{ text: 'V2Box', callback_data: 'server_v2box' }]
        ]
      }
    });
  } else if (data === 'pricing') {
    ctx.editMessageText('تعرفه‌ها:\n۱ ماهه: ۱۶۰,۰۰۰ تومان\n۲ ماهه: ۲۲۰,۰۰۰ تومان\n۳ ماهه: ۳۳۰,۰۰۰ تومان', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '۱ ماهه - ۱۶۰,۰۰۰ تومان', callback_data: 'price_1' }],
          [{ text: '۲ ماهه - ۲۲۰,۰۰۰ تومان', callback_data: 'price_2' }],
          [{ text: '۳ ماهه - ۳۳۰,۰۰۰ تومان', callback_data: 'price_3' }]
        ]
      }
    });
  } else if (data === 'payment') {
    ctx.editMessageText('لطفاً پرداخت رو از طریق درگاه زیر انجام بده:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'پرداخت آنلاین', url: 'https://your-payment-gateway.com' }]
        ]
      }
    });
  } else if (data === 'support') {
    ctx.editMessageText('برای پشتیبانی با ما تماس بگیر:\n@MatioonetSupport');
  }

  ctx.answerCbQuery(); // تأیید کلیک روی دکمه
});

// شروع ربات
bot.launch();

console.log('ربات شروع شد...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
