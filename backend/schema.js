const mongoose = require('mongoose');

let stocksSchema = mongoose.Schema({
    name: String,
    ticker: String,
    exchange: String,
    industry: String,
    logo: String,
    weburl: String,
    ipo: Date,
    currentPrice: Number
});
module.exports.stocksModel = mongoose.model('stocksModel', stocksSchema, 'stocks');

let accountsSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    hash: {type: String, select: false},
    balance: {type: Number, min: 0},
    admin: Boolean,
    portfolio: Object,
    watchlist: Array,
    subscriptions: Array,
    history: Array
})
module.exports.accountsModel = mongoose.model('accountsModel', accountsSchema, 'accounts');

let ordersSchema = mongoose.Schema({
    account: mongoose.Schema.Types.ObjectId,
    type: String,
    price: Number,
    quantity: Number,
    expire: Boolean,
    ticker: String
})
module.exports.ordersModel = mongoose.model('ordersModel', ordersSchema, 'orders');

let datesSchema = mongoose.Schema({
    date: Number,
    content: Object
})
module.exports.datesModel = mongoose.model('datesModel', datesSchema, 'dates');
