<script>
    import Notification from './components/Notification.svelte';
    import { user } from '../../stores';
</script>

<style>
    .header {
        font-size: 24px;
        font-weight: 500;
        color: var(--black);
        margin: 40px;
    }
    .notification-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
        margin: 40px;
    }
</style>

<div class='header'>Notifications</div>

<div class='notification-grid'>
    {#each $user.subscriptions as notification}
        <Notification id={notification.id} ticker={notification.ticker} condition={`${notification.difference}%`} enabled={notification.active}></Notification>
    {/each}
</div>

