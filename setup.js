const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const models = require('./backend/schema');
const stocks = require('./stocks.json');

mongoose.connect('mongodb://localhost:27017/stockdb', { useNewUrlParser: true, useUnifiedTopology: true }, async () => {

    const adminPortfolio = {};

    console.log('Saving stocks');
    for (let stock of stocks) {
        let document = new models.stocksModel(stock);
        await document.save();
        adminPortfolio[stock.ticker] = {numShares: 100, avgPrice: stock.currentPrice};
    }

    console.log('Saving admin');
    await bcrypt.hash('admin', 10, async (error, hash) => {
        if (error) return res.json(error);
        let document = new models.accountsModel({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@admin.com',
            hash: hash,
            balance: 0,
            admin: true,
            portfolio: adminPortfolio,
            watchlist: [],
            subscriptions: []
        });
        await document.save();
    });

    console.log('Saving date');
    const content = {};
    stocks.forEach(stock => content[stock.ticker] = { high: stock.currentPrice, low: stock.currentPrice, openingPrice: stock.currentPrice, closingPrice: stock.currentPrice, tradeVolume: 0 });
    const document = new models.datesModel({ date: 1, content });
    await document.save();

    console.log('Done! You can stop this script now.');
    
});