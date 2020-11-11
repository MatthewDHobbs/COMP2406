const cron = require('cron');
const models = require('./schema');
const ws = require('./ws');

module.exports.init = () => {
    // every morning at 9am, a new market day starts
    const cronJob = new cron.CronJob('0 0 9 * * *', eod);
    cronJob.start();

}

module.exports.force = () => eod();

async function eod() {
    await models.ordersModel.deleteMany({expire: true});

    const stocks = await models.stocksModel.find({});
    let date = await models.datesModel.find({}).sort('-date');

    const content = {};
    stocks.forEach(stock => content[stock.ticker] = { high: stock.currentPrice, low: stock.currentPrice, openingPrice: stock.currentPrice, closingPrice: stock.currentPrice, tradeVolume: 0 });

    date = date[0] ? date[0].date + 1 : 1;
    const document = new models.datesModel({ date, content });
    await document.save();

    ws.refreshAll();
}