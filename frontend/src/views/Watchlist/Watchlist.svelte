<script>
    import Stock from '../Industry/components/Stock.svelte';
    import { stocks, user } from '../../stores';
</script>

<style>
    .header {
        font-size: 24px;
        font-weight: 500;
        color: var(--black);
        margin: 40px;
    }
    .stock-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 20px;
        margin: 40px;
    }
</style>

<div class='header'>Watchlist</div>

<div class='stock-grid'>
    {#each $stocks as stock}
        {#if $user.watchlist.includes(stock.ticker)}
            <Stock name={stock.name} ticker={stock.ticker} logo={stock.logo}></Stock>  
        {/if}
    {/each}
</div>
