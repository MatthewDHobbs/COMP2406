<script>
    import page from 'page';
    import { activeIndustry, activeStock, activeStockData, user } from './stores';
    import * as http from './http';
    
    import Navigation from './views/Navigation/Navigation.svelte';
    import Authentication from './views/Authentication/Authentication.svelte';
    import Orders from './views/Orders/Orders.svelte';
    import History from './views/History/History.svelte';
    import Portfolio from './views/Portfolio/Portfolio.svelte';
    import Explore from './views/Explore/Explore.svelte';
    import Watchlist from './views/Watchlist/Watchlist.svelte';
    import Notifications from './views/Notifications/Notifications.svelte';

    import Industry from './views/Industry/Industry.svelte';
    import Stock from './views/Stock/Stock.svelte';

    let activeComponent;

    page('/', () => setRoute(Portfolio));
    page('/authentication', () => setRoute(Authentication));
    page('/orders', () => setRoute(Orders));
    page('/history', () => setRoute(History));
    page('/explore', () => setRoute(Explore));
    page('/watchlist', () => setRoute(Watchlist));
    page('/notifications', () => setRoute(Notifications));

    page('/explore/:industry', (ctx, next) => {
        activeIndustry.set(ctx.params.industry);
        next();
    }, () => setRoute(Industry));

    page('/explore/:industry/:ticker', async (ctx, next) => {
        activeIndustry.set(ctx.params.industry);
        activeStock.set(ctx.params.ticker);
        activeStockData.set(await http.getStock(ctx.params.ticker));
        next();
    }, () => setRoute(Stock));

    page.start();

    function setRoute(route) {
        if (route == Authentication && $user) page('/');
        else if (route != Authentication && !$user) page('/authentication');
        else activeComponent = route;
    }
</script>

<style>
    .main {
        display: flex;
        height: 100%;
        width: 100%;
    }
    .activeComponent {
        flex-grow: 100;
        overflow-y: auto;
    }
</style>

<div class='main'>
    {#if activeComponent != Authentication}
        <Navigation/>
    {/if}
    <div class='activeComponent'>
        <svelte:component this={activeComponent}/>
    </div>
</div>