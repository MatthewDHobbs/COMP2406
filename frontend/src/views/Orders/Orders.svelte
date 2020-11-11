<script>
    import { onMount } from 'svelte';
    import * as http from '../../http';
    import { orders } from '../../stores';

    onMount(async () => orders.set(await http.orders()));

    async function cancelOrder(_id) {
        await http.cancelOrder(_id);
        orders.set(await http.orders());
    }
</script>

<style>
    .header {
        font-size: 24px;
        font-weight: 500;
        color: var(--black);
        margin: 40px;
    }
</style>

<div class='header'>Orders</div>

{#each $orders as order}
    <div>_id: {order._id}</div>
    <div>Type: {order.type}</div>
    <div>Ticker: {order.ticker}</div>
    <div>Price: {order.price}</div>
    <div>Quantity: {order.quantity}</div>
    <div>Expire: {order.expire}</div>
    <div>Expiry Date: {order.expiryDate}</div>

    <button on:click={() => cancelOrder(order._id)}>Cancel</button>

    <br><br>
{/each}
