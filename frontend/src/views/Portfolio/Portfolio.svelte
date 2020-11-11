<script>
    import { user, stocks } from '../../stores';
</script>

<style>
    .header {
        font-size: 24px;
        font-weight: 500;
        color: var(--black);
        margin: 40px;
    }
    .portfolio-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 20px;
        margin: 40px;
    }
    .stock {
        display: flex;
        cursor: pointer;
        margin-bottom: 20px;
        width: 100%;
    }
    .stock-logo {
        width: 40px;
        height: 40px;
        font-weight: 500;
        color: white;
        border-radius: 5px;

        /* center inner text */
        display: flex;
        justify-content: center;
        align-items: center;

        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    .stock-content {
        position: relative;
        margin-left: 10px;
        width: 100%;
    }
    .stock-ticker {
        position: absolute;
        bottom: 0;
        color: var(--dark-gray);
    }
</style>

<div class='header'>Portfolio</div>

<div class='portfolio-grid'>
    {#each $stocks as stock}
        {#if $user.portfolio[stock.ticker]}
            <div class='stock'>
                <div class='stock-logo' style={stock.logo != '' ? `background-image: url(${stock.logo})` : 'background: #C9C8D2'}>{stock.logo ? '' : stock.name[0].toUpperCase()}</div>
                <div class='stock-content'>
                    <div class='stock-name'>{stock.name}</div><br>
                    <div class='stock-ticker'>{$user.portfolio[stock.ticker].numShares} Shares @ ${stock.currentPrice}/each, Avg Price: {($user.portfolio[stock.ticker].avgPrice).toFixed(2)}</div>
                </div>
            </div>
        {/if}   
    {/each}
</div>