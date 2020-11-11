<script>
    import { stocks, activeIndustry } from '../../stores';
    import Stock from './components/Stock.svelte';
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

<div class='header'>{$activeIndustry}</div>

<div class='stock-grid'>
    {#each $stocks.filter(stock => stock.industry == $activeIndustry).sort((a, b) => (a.name > b.name) ? 1 : -1) as stock}
        <Stock name={stock.name} ticker={stock.ticker} logo={stock.logo}></Stock>
    {/each}
</div>

