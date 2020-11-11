import App from './App.svelte';
import { init } from './socket';

import * as http from './http';
import { user, portfolioValue, stocks, industries, date } from './stores';

let app;

(async function() {
	const accessToken = localStorage.getItem('accessToken');
	if (accessToken) {
		const authResponse = await http.accessTokenAuth(accessToken);
		if (!authResponse.portfolio) authResponse.portfolio = {};
		user.set(authResponse);
		init();
	}

	app = new App({
		target: document.body,
		props: {}
	});

	date.set(await http.date());

	const stocksResponse = await http.getStocks();
	stocks.set(stocksResponse);

	let userValue;
	let portfolioValueLocal = 0;
	const unsubscribe = user.subscribe(value => userValue = value);

	let industriesResponse = {};
	for (let i = 0; i < stocksResponse.length; i++) {
		industriesResponse[stocksResponse[i].industry] ? industriesResponse[stocksResponse[i].industry]++ : industriesResponse[stocksResponse[i].industry] = 1;
		if (userValue.portfolio && userValue.portfolio[stocksResponse[i].ticker]) {
			portfolioValueLocal += userValue.portfolio[stocksResponse[i].ticker].numShares * stocksResponse[i].currentPrice;
		}
	}
	industries.set(industriesResponse);
	portfolioValue.set(portfolioValueLocal);
	unsubscribe();
})();

export default app;