<script>
    import { user } from '../../stores';
</script>

<style>
    .header {
        font-size: 24px;
        font-weight: 500;
        margin: 40px 40px 5px 40px;
        color: var(--black);
    }
    .content {
        margin: 40px;
    }
</style>

<div class='header'>History</div>

<div class='content'>
    {#each [...$user.history].reverse() as event}
        {#if event.type == 'buy' || event.type == 'sell'}
            <div>Day: {event.day}</div>
            <div>{event.type.charAt(0).toUpperCase() + event.type.slice(1)} {event.shares} shares of {event.ticker} at ${event.price}/share</div>
            <br>
        {:else}
            <div>Day: {event.day}</div>
            <div>{event.type.charAt(0).toUpperCase() + event.type.slice(1)} ${event.amount}</div>
            <br>
        {/if}
    {/each}
</div>
