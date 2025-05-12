const { Telegraf } = require('telegraf');

const bot = new Telegraf('7796226856:AAEcPujXpNs7Tq7Ztw6EmOfonJVp02xpuBs'); // توکنت رو اینجا گذاشتم

// داده‌های سرورها و تعرفه‌ها
const servers = {
  rocket: { name: 'Rocket Tunnel', price: { 1: 160000, 2: 220000, 3: 330000 } },
  v2ray: { name: 'V2Ray', price: { 1: 150000, 2: 200000, 3: 300000 } },
  v2box: { name: 'V2Box', price: { 1: 170000, 2: 230000, 3: 340000 } }
};

let orders = {}; // برای ذخیره سفارش‌ها (موقتی)

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

bot.on('callback_query', (ctx) => {
  const data = ctx.callbackQuery.data;
  const userId = ctx.callbackQuery.from.id;

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
  } else if (data.startsWith('server_')) {
    const serverType = data.split('_')[1];
    orders[userId] = { server: servers[serverType] };
    ctx.editMessageText(`سرور ${servers[serverType].name} انتخاب شد.\nحالا تعرفه رو انتخاب کن:`, {
      reply_markup: getPricingKeyboard(serverType)
    });
  } else if (data.startsWith('price_')) {
    const [_, serverType, months] = data.split('_');
    const price = servers[serverType].price[months];
    orders[userId] = { ...orders[userId], months, price };
    ctx.editMessageText(`تعرفه ${months} ماهه برای ${servers[serverType].name} به مبلغ ${price.toLocaleString()} تومان انتخاب شد.\nبرای پرداخت کلیک کن:`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'پرداخت آنلاین', url: 'https://your-payment-gateway.com' }],
          [{ text: 'بازگشت', callback_data: 'servers' }]
        ]
      }
    });
  } else if (data === 'pricing') {
    ctx.editMessageText('تعرفه‌ها برای هر سرور:\n- Rocket Tunnel: ۱ ماهه ۱۶۰k | ۲ ماهه ۲۲۰k | ۳ ماهه ۳۳۰k\n- V2Ray: ۱ ماهه ۱۵۰k | ۲ ماهه ۲۰۰k | ۳ ماهه ۳۰۰k\n- V2Box: ۱ ماهه ۱۷۰k | ۲ ماهه ۲۳۰k | ۳ ماهه ۳۴۰k', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'انتخاب سرور', callback_data: 'servers' }]
        ]
      }
    });
  } else if (data === 'payment') {
    ctx.editMessageText('لطفاً ابتدا سرور و تعرفه رو انتخاب کن، سپس پرداخت رو انجام بده.', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'انتخاب سرور', callback_data: 'servers' }]
        ]
      }
    });
  } else if (data === 'support') {
    ctx.editMessageText('برای پشتیبانی با ما تماس بگیر:\n@MatioonetSupport');
  }

  ctx.answerCbQuery();
});

// تابع برای ساخت کیبورد تعرفه‌ها
function getPricingKeyboard(serverType) {
  const prices = servers[serverType].price;
  return {
    inline_keyboard: [
      [{ text: `۱ ماهه - ${prices[1].toLocaleString()} تومان`, callback_data: `price_${serverType}_1` }],
      [{ text: `۲ ماهه - ${prices[2].toLocaleString()} تومان`, callback_data: `price_${serverType}_2` }],
      [{ text: `۳ ماهه - ${prices[3].toLocaleString()} تومان`, callback_data: `price_${serverType}_3` }],
      [{ text: 'بازگشت', callback_data: 'servers' }]
    ]
  };
}

bot.launch();

console.log('ربات شروع شد...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
