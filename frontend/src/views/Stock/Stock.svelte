<script>
    import { onMount } from 'svelte';
    import { activeStock, activeStockData, activeStockHistory, user, allOrders } from '../../stores';
    import * as http from '../../http';

    onMount(async () => {
        allOrders.set(await http.allOrders());
        activeStockHistory.set(await http.getStockHistory($activeStock));
        console.log($activeStockHistory);
    });

    async function buy(event) {
        await http.buyOrder($activeStock, event.target.price.value, event.target.quantity.value, event.target.expire.checked);
        allOrders.set(await http.allOrders());
    }

    async function sell(event) {
        await http.sellOrder($activeStock, event.target.price.value, event.target.quantity.value, event.target.expire.checked);
        allOrders.set(await http.allOrders());
    }

    async function addToWatchlist() {
        await http.addToWatchlist($activeStock);
        refreshUser();
    }

    async function removeFromWatchlist() {
        await http.removeFromWatchlist($activeStock);
        refreshUser();
    }

    async function notification(event) {
        await http.addNotification($activeStock, event.target.difference.value);
        refreshUser();
    }

    async function refreshUser() {
        const accessToken = localStorage.getItem('accessToken');
        const authResponse = await http.accessTokenAuth(accessToken);
		if (!authResponse.portfolio) authResponse.portfolio = {};
		user.set(authResponse);
    }
</script>

<style>
    .header {
        font-size: 24px;
        font-weight: 500;
        margin: 40px 40px 5px 40px;
        color: var(--black);
    }
    .url {
        margin: 0px 40px 40px 40px;
        color: inherit;
        color: var(--dark-gray);
        text-decoration: none;
    }
    .content {
        margin: 40px;
    }
    .sell, .buy {
        margin-top: 40px;
    }
    .form-header {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 20px;
    }
</style>

<div class='header'>{$activeStockData.name}</div>
<a class='url' href={$activeStockData.weburl}>{$activeStockData.weburl}</a>

<div class='content'>
    {#if !$user.watchlist.includes($activeStock)}
        <button on:click={addToWatchlist}>Add to watchlist</button>
    {:else}
        <button on:click={removeFromWatchlist}>Remove from watchlist</button>
    {/if}
    <br><br>

    {#if $activeStockData}
        <div>Current Price: ${$activeStockData.currentPrice}</div>
    {/if}
    {#if $user.portfolio[$activeStock]}
        <div>You own {$user.portfolio[$activeStock].numShares} shares</div>
    {/if}
    <br>
    {#if $activeStockHistory[0]}
        <div>Daily Low: {$activeStockHistory[0].low}</div>
        <div>Daily High: {$activeStockHistory[0].high}</div>
        <div>Opening Price: {$activeStockHistory[0].openingPrice}</div>
        <div>Closing Price: {$activeStockHistory[0].closingPrice}</div>
        <div>Trade Volume: {$activeStockHistory[0].tradeVolume}</div>
    {/if}

    <form class='sell' on:submit|preventDefault={notification}>
        <div class='form-header'>Set a Notification</div>
        <input type='number' min='0' id='difference' placeholder='Daily Percent Change'>
        <button class='submit' type='submit'>Add</button> 
    </form>

    <form class='buy' on:submit|preventDefault={buy}>
        <div class='form-header'>Place a Buy Order</div>
        <input type='number' min='0' id='price' placeholder='Price'>
        <input type='number' min='0' id='quantity' placeholder='Number of Shares'>
        <label for='expire'>Expire</label>
        <input type='checkbox' id='expire'>
        <button class='submit' type='submit'>Buy</button>
    </form>

    {#if $user.portfolio[$activeStock] && $user.portfolio[$activeStock].numShares > 0}
        <form class='sell' on:submit|preventDefault={sell}>
            <div class='form-header'>Place a Sell Order</div>
            <input type='number' min='0' id='price' placeholder='Price'>
            <input type='number' min='0' id='quantity' placeholder='Number of Shares'>
            <label for='expire'>Expire</label>
            <input type='checkbox' id='expire'>
            <button class='submit' type='submit'>Sell</button> 
        </form>
    {/if}

    <br><br>

    {#each $allOrders as order}
        {#if order.ticker == $activeStock}
            <div>Type: {order.type}</div>
            <div>Ticker: {order.ticker}</div>
            <div>Price: {order.price}</div>
            <div>Quantity: {order.quantity}</div>
            <div>Expire: {order.expire}</div>
            <br>
        {/if}
    {/each}

    <div class='form-header'>Historical Data</div>

    {#if $activeStockHistory}
        {#each $activeStockHistory as day, i}
            {#if i != 0}
                <div>Day: {day.day}</div>
                <div>Daily Low: {day.low}</div>
                <div>Daily High: {day.high}</div>
                <div>Opening Price: {day.openingPrice}</div>
                <div>Closing Price: {day.closingPrice}</div>
                <div>Trade Volume: {day.tradeVolume}</div>
                <br>
            {/if}
        {/each}
    {/if}
</div>
