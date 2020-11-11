const models = require('./schema');
const ws = require('./ws');
const nodemailer = require('nodemailer');

// NEED TO CLEAN UP THIS CODE!!!

module.exports = () => {
    models.ordersModel.find({}, async (error, data) => { 
        if (error) return console.log(error);

        const buyOrders = data.filter(item => item.type == 'buy');
        const sellOrders = data.filter(item => item.type == 'sell');

        const date = await models.datesModel.find({}).sort('-date');

        for (let buyOrder of buyOrders) {
            for (let sellOrder of sellOrders.filter(item => item.ticker == buyOrder.ticker && item.price <= buyOrder.price)) {
                if (sellOrder.account != buyOrder.account) {
                    let query = await models.accountsModel.findById({_id: buyOrder.account});
                    if (query.balance < sellOrder.price) continue;
                    if (query.balance < (sellOrder.price * buyOrder.quantity))
                        buyOrder.quantity = Math.floor(query.balance / sellOrder.price);

                    // decrement number of shares to be bought and sold from respective offers
                    let numShares = buyOrder.quantity > sellOrder.quantity ? sellOrder.quantity : buyOrder.quantity;
                    await models.ordersModel.findByIdAndUpdate({_id: buyOrder._id}, {$inc: {quantity: -numShares}}, {useFindAndModify: false});
                    await models.ordersModel.findByIdAndUpdate({_id: sellOrder._id}, {$inc: {quantity: -numShares}}, {useFindAndModify: false});

                    await models.accountsModel.find({_id: buyOrder.account}, async (error, data) => {
                        if (error) return console.log(error);
                        data = data[0];
                        if (data.portfolio && data.portfolio[buyOrder.ticker]) {
                            data.portfolio[buyOrder.ticker].avgPrice = (data.portfolio[buyOrder.ticker].numShares * data.portfolio[buyOrder.ticker].avgPrice + numShares * sellOrder.price) / (data.portfolio[buyOrder.ticker].numShares + numShares);
                            data.portfolio[buyOrder.ticker].numShares = data.portfolio[buyOrder.ticker].numShares + numShares;
                        } else if (data.portfolio) {
                            data.portfolio[buyOrder.ticker] = {};
                            data.portfolio[buyOrder.ticker].avgPrice = sellOrder.price;
                            data.portfolio[buyOrder.ticker].numShares = numShares;
                        } else {
                            data.portfolio = {[buyOrder.ticker]: {avgPrice: sellOrder.price, numShares: numShares}};
                        }
                        await models.accountsModel.findByIdAndUpdate({_id: buyOrder.account}, {$inc: {balance: -numShares * sellOrder.price}, portfolio: data.portfolio, $push: {history: {day: date[0].date, type: 'buy', ticker: buyOrder.ticker, shares: numShares, price: sellOrder.price}}});
                    });

                    await models.accountsModel.find({_id: sellOrder.account}, async (error, data) => {
                        if (error) return console.log(error);
                        data = data[0];
                        data.portfolio[sellOrder.ticker].numShares = data.portfolio[sellOrder.ticker].numShares - numShares;
                        await models.accountsModel.findByIdAndUpdate({_id: sellOrder.account}, {$inc: {balance: numShares * sellOrder.price}, portfolio: data.portfolio, $push: {history: {day: date[0].date, type: 'sell', ticker: sellOrder.ticker, shares: numShares, price: sellOrder.price}}});
                    });

                    await models.stocksModel.findOneAndUpdate({ticker: sellOrder.ticker}, {currentPrice: sellOrder.price});

                    await updateDailyValues(buyOrder.ticker, numShares, sellOrder.price);
                    await notifyUsers(buyOrder.ticker, sellOrder.price);
                    
                    ws.refresh(buyOrder.account);
                    ws.refresh(sellOrder.account);

                    buyOrder.quantity -= numShares;
                }
            }   
        }

        await models.ordersModel.deleteMany({quantity: 0});
    });
}

async function updateDailyValues(ticker, quantity, price) {
    // read all dates from database and sort for most recent (i.e. today)
    let date = await models.datesModel.find({}).sort('-date');
    date = date[0];
    // set content values
    date.content[ticker].tradeVolume = date.content[ticker].tradeVolume + quantity;
    date.content[ticker].closingPrice = price;
    if (price < date.content[ticker].low) date.content[ticker].low = price;
    else if (price > date.content[ticker].high) date.content[ticker].high = price;
    // save new values to database
    await models.datesModel.findOneAndUpdate({date: date.date}, {content: date.content});
}

async function notifyUsers(ticker, price) {
    let date = await models.datesModel.find({}).sort('-date');
    date = date[0];
    const users = await models.accountsModel.find({});
    for (const user of users) {
        for (const subscription of user.subscriptions) {
            if (ticker == subscription.ticker) {
                let topDiff = ((subscription.difference / 100) + 1) * date.content[ticker].openingPrice;
                let bottomDiff = ((-subscription.difference / 100) + 1) * date.content[ticker].openingPrice;
                if (price <= bottomDiff || price >= topDiff)
                    sendEmail(user.email, ticker, subscription.difference, price);
            }
        }
    }       
}

async function sendEmail(email, ticker, difference, price) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'comp2406stockbroker@gmail.com',
            pass: 'hobbs2406'
        }
    });
    const mailOptions = {
        from: 'comp2406stockbroker@gmail.com',
        to: email,
        subject: `COMP2406 Stock Broker Price Change Detected (${ticker})`,
        text: `The stock ${ticker} has changed by more than your set difference (${difference}%) to $${price}.`
    }
    transporter.sendMail(mailOptions, (err, res) => {
        if (err) console.error('there was an error: ', err);
        else console.log('here is the res: ', res)
    });
}
