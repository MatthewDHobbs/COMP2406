import io from 'socket.io-client';

import * as http from './http';
import { user, portfolioValue, orders, stocks, activeStock, activeStockData, activeStockHistory, allOrders, date } from './stores';

const url = 'http://localhost:9999'
let socket;

export function init() {
    const token = localStorage.getItem('accessToken');
    socket = io.connect(url, {query: {token}});
    socket.on('connect', () => console.log('connect'));
    socket.on('disconnect', () => console.log('disconnect'));
    
    socket.on('refresh', () => refresh());
}

async function refresh() {
    console.log('refresh');
    const accessToken = localStorage.getItem('accessToken');
    const authResponse = await http.accessTokenAuth(accessToken);
    if (!authResponse.portfolio) authResponse.portfolio = {};
    user.set(authResponse);

    const stocksResponse = await http.getStocks();
    stocks.set(stocksResponse);

    let activeStockValue;
    let stocksValue;
    const activeStockUnsubscribe = activeStock.subscribe(value => activeStockValue = value);
    const stocksUnsubsribe = stocks.subscribe(value => stocksValue = value);
    if (activeStockValue) {
        activeStockData.set(stocksValue.filter(stock => stock.ticker == activeStockValue)[0]);
    }

    let userValue;
	let portfolioValueLocal = 0;
	const unsubscribe = user.subscribe(value => userValue = value);

	for (let i = 0; i < stocksResponse.length; i++) {
		if (userValue.portfolio && userValue.portfolio[stocksResponse[i].ticker]) {
			portfolioValueLocal += userValue.portfolio[stocksResponse[i].ticker].numShares * stocksResponse[i].currentPrice;
		}
	}
    portfolioValue.set(portfolioValueLocal);
    
    orders.set(await http.orders());
    allOrders.set(await http.allOrders());
    date.set(await http.date());
    activeStockHistory.set(await http.getStockHistory(activeStockValue));

    activeStockUnsubscribe();
    stocksUnsubsribe();
    unsubscribe();
}