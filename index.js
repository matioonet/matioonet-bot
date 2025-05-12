const { Telegraf } = require('telegraf');
const sqlite3 = require('sqlite3').verbose();

const bot = new Telegraf('7796226856:AAEcPujXpNs7Tq7Ztw6EmOfonJVp02xpuBs');
const ADMIN_ID = 'admiiiinnet'; // آیدی ادمین

// دیتابیس
const db = new sqlite3.Database('orders.db', (err) => {
  if (err) {
    console.error('خطا در اتصال به دیتابیس:', err.message);
  } else {
    console.log('اتصال به دیتابیس برقرار شد.');
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        userId INTEGER,
        server TEXT,
        months INTEGER,
        volume INTEGER,
        price INTEGER,
        status TEXT,
        createdAt TEXT
      )
    `);
  }
});

// داده‌های سرورها و تعرفه‌ها
const servers = {
  vip_rocket_v2box: {
    name: 'VIP Rocket Tunnel + V2BOX',
    prices: { 1: { price: 550000, volume: 10 }, 2: { price: 790000, volume: 20 }, 3: { price: 840000, volume: 30 } }
  },
  rocket_tunnel: {
    name: 'Rocket Tunnel',
    prices: { 1: { price: 84000, volume: 4 }, 2: { price: 99000, volume: 5 }, 3: { price: 115000, volume: 6 } }
  },
  v2ray_simple: {
    name: 'V2Ray (ساده)',
    prices: { 1: { price: 160000, days: 31 }, 2: { price: 220000, days: 62 }, 3: { price: 330000, days: 93 } }
  },
  v2ray_vip: {
    name: 'V2Ray (VIP)',
    prices: { 1: { price: 280000, days: 31 }, 2: { price: 390000, days: 62 }, 3: { price: 550000, days: 93 } }
  },
  v2ray_game: {
    name: 'V2Ray (بازی)',
    prices: { 1: { price: 145000, days: 30 }, 2: { price: 199000, days: 60 }, 3: { price: 249000, days: 90 } }
  },
  v2ray_game_vip: {
    name: 'V2Ray (بازی + VIP)',
    prices: {
      1: { price: 310000, volume: 60 },
      2: { price: 460000, volume: 100 },
      3: { price: 550000, volume: 150 },
      4: { price: 670000, volume: 200 },
      5: { price: 790000, volume: 300 }
    }
  },
  v2ray_game_volume: {
    name: 'V2Ray (بازی) - بسته حجمی',
    prices: {
      10: { price: 40000, volume: 10 },
      20: { price: 80000, volume: 20 },
      25: { price: 90000, volume: 25 },
      30: { price: 110000, volume: 30 },
      40: { price: 135000, volume: 40 },
      50: { price: 160000, volume: 50 },
      60: { price: 188000, volume: 60 },
      80: { price: 220000, volume: 80 },
      100: { price: 249000, volume: 100 },
      150: { price: 323000, volume: 150 },
      200: { price: 400000, volume: 200 }
    }
  },
  v2ray_game_vip_volume: {
    name: 'V2Ray (بازی + VIP) - بسته حجمی',
    prices: {
      20: { price: 120000, volume: 20 },
      25: { price: 160000, volume: 25 },
      30: { price: 180000, volume: 30 },
      40: { price: 240000, volume: 40 },
      50: { price: 260000, volume: 50 },
      60: { price: 290000, volume: 60 },
      80: { price: 340000, volume: 80 },
      100: { price: 440000, volume: 100 },
      150: { price: 500000, volume: 150 },
      200: { price: 550000, volume: 200 },
      300: { price: 650000, volume: 300 }
    }
  }
};

// دستور /start
bot.start((ctx) => {
  ctx.reply('به ربات فیلترشکن **Matioo net** خوش اومدی! یه گزینه رو انتخاب کن:', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'انتخاب سرور', callback_data: 'servers' }],
        [{ text: 'تعرفه‌ها', callback_data: 'pricing' }],
        [{ text: 'سفارش‌های من', callback_data: 'myorders' }],
        [{ text: 'پشتیبانی', callback_data: 'support' }]
      ]
    }
  });
});

// دستور /myorders
bot.command('myorders', (ctx) => {
  const userId = ctx.from.id;
  db.all(`SELECT * FROM orders WHERE userId = ?`, [userId], (err, rows) => {
    if (err) {
      console.error('خطا در گرفتن سفارش‌ها:', err.message);
      ctx.reply('خطایی پیش اومد. لطفاً بعداً امتحان کن.');
      return;
    }
    if (rows.length === 0) {
      ctx.reply('شما سفارشی ثبت نکردی.');
      return;
    }
    let message = 'سفارش‌های شما:\n';
    rows.forEach((row, index) => {
      message += `${index + 1}. سرور: ${row.server}\n`;
      if (row.months) message += `مدت: ${row.months} ماه\n`;
      if (row.volume) message += `حجم: ${row.volume} گیگ\n`;
      message += `مبلغ: ${row.price.toLocaleString()} تومان\nوضعیت: ${row.status}\nتاریخ: ${row.createdAt}\n\n`;
    });
    ctx.reply(message);
  });
});

// مدیریت دکمه‌ها
bot.on('callback_query', (ctx) => {
  const data = ctx.callbackQuery.data;
  const userId = ctx.callbackQuery.from.id;

  if (data === 'servers') {
    ctx.editMessageText('یه سرور انتخاب کن:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'VIP Rocket Tunnel + V2BOX', callback_data: 'server_vip_rocket_v2box' }],
          [{ text: 'Rocket Tunnel', callback_data: 'server_rocket_tunnel' }],
          [{ text: 'V2Ray (ساده)', callback_data: 'server_v2ray_simple' }],
          [{ text: 'V2Ray (VIP)', callback_data: 'server_v2ray_vip' }],
          [{ text: 'V2Ray (بازی)', callback_data: 'server_v2ray_game' }],
          [{ text: 'V2Ray (بازی + VIP)', callback_data: 'server_v2ray_game_vip' }],
          [{ text: 'بسته حجمی - V2Ray (بازی)', callback_data: 'server_v2ray_game_volume' }],
          [{ text: 'بسته حجمی - V2Ray (بازی + VIP)', callback_data: 'server_v2ray_game_vip_volume' }]
        ]
      }
    });
  } else if (data.startsWith('server_')) {
    const serverType = data.split('_').slice(1).join('_');
    db.run(
      `INSERT INTO orders (userId, server, months, volume, price, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, servers[serverType].name, 0, 0, 0, 'pending', new Date().toISOString()],
      (err) => {
        if (err) console.error('خطا در ثبت سفارش:', err.message);
      }
    );
    ctx.editMessageText(`سرور ${servers[serverType].name} انتخاب شد.\nحالا تعرفه رو انتخاب کن:`, {
      reply_markup: getPricingKeyboard(serverType)
    });
  } else if (data.startsWith('price_')) {
    const [_, serverType, key] = data.split('_');
    const priceInfo = servers[serverType].prices[key];
    const price = priceInfo.price;
    const months = priceInfo.days ? parseInt(key) : 0;
    const volume = priceInfo.volume || 0;
    db.run(
      `UPDATE orders SET months = ?, volume = ?, price = ?, status = ? WHERE userId = ? AND status = 'pending'`,
      [months, volume, price, 'awaiting_receipt', userId],
      (err) => {
        if (err) console.error('خطا در به‌روزرسانی سفارش:', err.message);
      }
    );
    ctx.editMessageText(
      `لطفاً مبلغ **${price.toLocaleString()} تومان** رو به شماره کارت زیر واریز کن و رسید رو ارسال کن:\n` +
      `**6219861947352083**\n` +
      `به نام: یونسی راد\n` +
      `یا از طریق لینک زیر پرداخت کن:\n` +
      `[پرداخت آنلاین](https://aqayepardakht.ir/matioonet)`,
      { parse_mode: 'Markdown' }
    );
  } else if (data === 'pricing') {
    let message = 'تعرفه‌ها:\n\n';
    for (const server in servers) {
      message += `**${servers[server].name}**:\n`;
      for (const key in servers[server].prices) {
        const priceInfo = servers[server].prices[key];
        if (priceInfo.days) {
          message += `- ${key} ماهه: ${priceInfo.price.toLocaleString()} تومان (${priceInfo.days} روز)\n`;
        } else {
          message += `- ${key} گیگ: ${priceInfo.price.toLocaleString()} تومان\n`;
        }
      }
      message += '\n';
    }
    ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'انتخاب سرور', callback_data: 'servers' }]
        ]
      }
    });
  } else if (data === 'myorders') {
    const userId = ctx.callbackQuery.from.id;
    db.all(`SELECT * FROM orders WHERE userId = ?`, [userId], (err, rows) => {
      if (err) {
        console.error('خطا در گرفتن سفارش‌ها:', err.message);
        ctx.reply('خطایی پیش اومد. لطفاً بعداً امتحان کن.');
        return;
      }
      if (rows.length === 0) {
        ctx.editMessageText('شما سفارشی ثبت نکردی.', {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'انتخاب سرور', callback_data: 'servers' }]
            ]
          }
        });
        return;
      }
      let message = 'سفارش‌های شما:\n';
      rows.forEach((row, index) => {
        message += `${index + 1}. سرور: ${row.server}\n`;
        if (row.months) message += `مدت: ${row.months} ماه\n`;
        if (row.volume) message += `حجم: ${row.volume} گیگ\n`;
        message += `مبلغ: ${row.price.toLocaleString()} تومان\nوضعیت: ${row.status}\nتاریخ: ${row.createdAt}\n\n`;
      });
      ctx.editMessageText(message, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'انتخاب سرور', callback_data: 'servers' }]
          ]
        }
      });
    });
  } else if (data === 'support') {
    ctx.editMessageText('برای پشتیبانی با ما تماس بگیر:\n@admiiiinnet');
  }

  ctx.answerCbQuery();
});

// مدیریت رسید
bot.on('photo', (ctx) => {
  const userId = ctx.from.id;
  db.get(`SELECT * FROM orders WHERE userId = ? AND status = 'awaiting_receipt'`, [userId], (err, row) => {
    if (err) {
      console.error('خطا در بررسی سفارش:', err.message);
      ctx.reply('خطایی پیش اومد. لطفاً بعداً امتحان کن.');
      return;
    }
    if (!row) {
      ctx.reply('لطفاً ابتدا یه سفارش ثبت کن.');
      return;
    }
    db.run(
      `UPDATE orders SET status = 'awaiting_confirmation' WHERE userId = ? AND status = 'awaiting_receipt'`,
      [userId],
      (err) => {
        if (err) console.error('خطا در به‌روزرسانی وضعیت:', err.message);
      }
    );
    const photo = ctx.message.photo[ctx.message.photo.length - 1]; // بالاترین کیفیت
    const fileId = photo.file_id;
    bot.telegram.sendPhoto(ADMIN_ID, fileId, {
      caption: `سفارش جدید:\nکاربر: ${userId}\nسرور: ${row.server}\n` +
               (row.months ? `مدت: ${row.months} ماه\n` : `حجم: ${row.volume} گیگ\n`) +
               `مبلغ: ${row.price.toLocaleString()} تومان\n` +
               `لطفاً بررسی کن و کانفیگ رو ارسال کن.`
    });
    ctx.reply('رسید شما ارسال شد. منتظر تأیید ادمین باش.');
  });
});

// تابع برای ساخت کیبورد تعرفه‌ها
function getPricingKeyboard(serverType) {
  const prices = servers[serverType].prices;
  const buttons = [];
  for (const key in prices) {
    const priceInfo = prices[key];
    if (priceInfo.days) {
      buttons.push([{ text: `${key} ماهه - ${priceInfo.price.toLocaleString()} تومان (${priceInfo.days} روز)`, callback_data: `price_${serverType}_${key}` }]);
    } else {
      buttons.push([{ text: `${key} گیگ - ${priceInfo.price.toLocaleString()} تومان`, callback_data: `price_${serverType}_${key}` }]);
    }
  }
  buttons.push([{ text: 'بازگشت', callback_data: 'servers' }]);
  return { inline_keyboard: buttons };
}

bot.launch();

console.log('ربات شروع شد...');

// بستن دیتابیس
process.once('SIGINT', () => {
  db.close();
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  db.close();
  bot.stop('SIGTERM');
});
