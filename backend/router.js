const models = require('./schema');
const order = require('./order');
const eod = require('./eod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');

const router = new express.Router();
const accessTokenSecret = 'abcdefghijklmnopqrstuvwxyz';

const authenticateJWT = (req, res, next) => {
    const accessToken = req.headers.token;
    if (accessToken) {
        jwt.verify(accessToken, accessTokenSecret, (error, data) => {
            if (error) return res.send(error);
            req.body.email = data.email;
            req.body.id = data.id;
            next();
        });
    } else {
        res.json('accessToken not found in headers');
    }
};

router.post('/forceEOD', authenticateJWT, async (req, res) => {
    models.accountsModel.findOne({_id: req.body.id}, (error, data) => {
        if (error) return res.json(error);
        if (!data.admin) return res.json('User does not have Admin permissions');
        eod.force();
        res.json('Forced EOD');
    });
});

router.get('/date', authenticateJWT, async (req, res) => {
    const date = await models.datesModel.find({}).sort('-date');
    res.send(date[0]);
});

router.post('/auth/accessToken', authenticateJWT, async (req, res) => {
    models.accountsModel.findOne({email: req.body.email}, (error, data) => {
        if (error) return res.json(error);
        res.json(data);
    });
});

router.get('/test', (req, res) => {
    res.send('test route');
});

router.post('/auth/signIn', async (req, res) => {
    models.accountsModel.findOne({email: req.body.email}).select('hash').exec((error, data) => {
        if (error || !data) return res.json(error || 'Incorrect email');
        bcrypt.compare(req.body.password, data.hash, function(error, result) {
            if (error || !result) return res.json(error || 'Incorrect password');
            const accessToken = jwt.sign({email: req.body.email, id: data._id}, accessTokenSecret);
            res.json({accessToken});
        });
    });
});

router.post('/auth/createAccount', async (req, res) => {
    models.accountsModel.findOne({email: req.body.email}, (error, data) => {
        if (error || data) return res.json('Account already exists');
        bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error) return res.json(error);
            let document = new models.accountsModel({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                hash: hash,
                balance: 0,
                admin: false,
                portfolio: {},
                watchlist: [],
                subscriptions: []
            });
            document.save((error, doc) => {
                if (error) return res.json(error);
                const accessToken = jwt.sign({email: req.body.email, id: doc._id}, accessTokenSecret);
                res.json({accessToken});
            });
        });
    });
});

router.get('/stocks', authenticateJWT, async (req, res) => {
    models.stocksModel.find({}, (error, data) => {
        if (error) return res.json(error);
        res.json(data);
    });
});

router.get('/stocks/:ticker', authenticateJWT, async (req, res) => {
    models.stocksModel.find({ticker: req.params.ticker}, (error, data) => {
        if (error) return res.json(error);
        res.json(data[0]);
    });
});

router.get('/stocks/:ticker/history', authenticateJWT, async (req, res) => {
    let date = await models.datesModel.find({}).sort('-date');
    let returnContent = [];
    for (let i = 0; i < date.length; i++) {
        returnContent.push({...date[i].content[req.params.ticker], day: date[i].date});
    }
    res.json(returnContent);
});

router.post('/order/buy', authenticateJWT, async (req, res) => {
    models.accountsModel.findOne({_id: req.body.id}, (error, data) => {
        if (error) return res.json(error);
        if (req.body.price >= 0 && req.body.quantity > 0 && data.balance >= req.body.price * req.body.quantity) {
            let document = new models.ordersModel({
                account: req.body.id,
                type: 'buy',
                price: req.body.price,
                quantity: req.body.quantity,
                expire: req.body.expire,
                ticker: req.body.ticker
            });
            document.save((error, doc) => {
                if (error) return res.json(error);
                order();
                res.json(doc);
            });
        } else {
            res.json('Invalid buy order')
        }
    });
});

router.post('/order/sell', authenticateJWT, async (req, res) => {
    models.accountsModel.findOne({_id: req.body.id}, (error, data) => {
        if (error) return res.json(error);
        if (req.body.price >= 0 && data.portfolio[req.body.ticker].numShares >= req.body.quantity && req.body.quantity > 0) {
            let document = new models.ordersModel({
                account: req.body.id,
                type: 'sell',
                price: req.body.price,
                quantity: req.body.quantity,
                expire: req.body.expire,
                ticker: req.body.ticker
            });
            document.save((error, doc) => {
                if (error) return res.json(error);
                order();
                res.json(doc);
            });
        } else {
            res.json('Invalid sell order');
        }
    });
});

router.get('/orders', authenticateJWT, async (req, res) => {
    models.ordersModel.find({account: req.body.id}, (error, data) => {
        if (error) return res.json(error);
        res.json(data);
    });
});

router.get('/allOrders', authenticateJWT, async (req, res) => {
    models.ordersModel.find({}, (error, data) => {
        if (error) return res.json(error);
        res.json(data);
    });
});

router.post('/orders/cancel', authenticateJWT, async (req, res) => {
    models.ordersModel.deleteOne({_id: req.body._id}, (error) => {
        if (error) return res.json(error);
        res.json('Deleted Order');
    });
});

router.post('/deposit', authenticateJWT, async (req, res) => {
    const date = await models.datesModel.find({}).sort('-date');
    models.accountsModel.findByIdAndUpdate({_id: req.body.id}, {$inc: {balance: req.body.amount}, $push: {history: {day: date[0].date, type: 'deposit', amount: req.body.amount}}}, {useFindAndModify: false, new: true}, (error, data) => {
        if (error) return res.json(error);
        res.json(data);
    });
});

router.post('/withdraw', authenticateJWT, async (req, res) => {
    const date = await models.datesModel.find({}).sort('-date');
    models.accountsModel.findByIdAndUpdate({_id: req.body.id}, {$inc: {balance: -req.body.amount}, $push: {history: {day: date[0].date, type: 'withdraw', amount: req.body.amount}}}, {useFindAndModify: false, new: true}, (error, data) => {
        if (error) return res.json(error);
        res.json(data);
    });
});

router.post('/watchlist/add', authenticateJWT, async (req, res) => {
    models.accountsModel.findByIdAndUpdate({_id: req.body.id}, {$push: {watchlist: req.body.ticker}}, {useFindAndModify: false, new: true}, (error, data) => {
        if (error) return res.json(error);
        res.json(data);
    });
});

router.post('/watchlist/delete', authenticateJWT, async (req, res) => {
    models.accountsModel.findByIdAndUpdate({_id: req.body.id}, {$pull: {watchlist: req.body.ticker}}, {useFindAndModify: false, new: true}, (error, data) => {
        if (error) return res.json(error);
        res.json(data);
    });
});

router.post('/notification/add', authenticateJWT, async (req, res) => {
    models.accountsModel.findByIdAndUpdate({_id: req.body.id}, {$push: {subscriptions: {id: mongoose.Types.ObjectId(), ticker: req.body.ticker, difference: req.body.difference, active: true}}}, {useFindAndModify: false, new: true}, (error, data) => {
        if (error) return res.json(error);
        res.json(data);
    });
});

router.post('/notification/delete', authenticateJWT, async (req, res) => {
    await models.accountsModel.findById({_id: req.body.id}).then(async doc => {
        doc.subscriptions = doc.subscriptions.filter(s => s.id != req.body.notificationId);
        await models.accountsModel.findByIdAndUpdate({_id: req.body.id}, {subscriptions: doc.subscriptions},  {useFindAndModify: false, new: true});
        res.json(`${req.body.notificationId} deleted`);
    });
});

router.post('/notification/enable', authenticateJWT, async (req, res) => {
    await models.accountsModel.findById({_id: req.body.id}).then(async doc => {
        for (let i = 0; i < doc.subscriptions.length; i++)
            if (doc.subscriptions[i].id == req.body.notificationId)
                doc.subscriptions[i].active = true;
        await models.accountsModel.findByIdAndUpdate({_id: req.body.id}, {subscriptions: doc.subscriptions},  {useFindAndModify: false, new: true});
        res.json(`${req.body.notificationId} enabled`);
    });
});

router.post('/notification/disable', authenticateJWT, async (req, res) => {
    await models.accountsModel.findById({_id: req.body.id}).then(async doc => {
        for (let i = 0; i < doc.subscriptions.length; i++)
            if (doc.subscriptions[i].id == req.body.notificationId)
                doc.subscriptions[i].active = false;
        await models.accountsModel.findByIdAndUpdate({_id: req.body.id}, {subscriptions: doc.subscriptions},  {useFindAndModify: false, new: true});
        res.json(`${req.body.notificationId} disabled`);
    });
});

module.exports = router;