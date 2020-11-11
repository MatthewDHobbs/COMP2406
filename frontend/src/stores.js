import { writable } from 'svelte/store';

export let user = new writable(null);
export let portfolioValue = new writable(null);
export let orders = new writable({});
export let allOrders = new writable({});

export let activeIndustry = new writable('');
export let activeStock = new writable({});
export let activeStockData = new writable({});
export let activeStockHistory = new writable({});

export let stocks = new writable([]);
export let industries = new writable({});

export let date = new writable({});