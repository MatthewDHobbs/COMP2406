<script>
    import { onMount } from 'svelte';
    import { user, portfolioValue, date } from '../../stores';
    import * as http from '../../http';

    import User from './components/User.svelte';
    import Balance from './components/Balance.svelte';
    import Link from './components/Link.svelte';

    async function deposit(event) {
        let newUser = await http.deposit(event.target.depositAmount.value);
        if (!newUser.portfolio) newUser.portfolio = {};
        user.set(newUser);
        event.target.depositAmount.value = '';
    }

    async function withdraw(event) {
        if ($user.balance >= event.target.withdrawAmount.value) {
            let newUser = await http.withdraw(event.target.withdrawAmount.value)
            if (!newUser.portfolio) newUser.portfolio = {};
            user.set(newUser);
        } else {
            console.log(`Cannot withdraw ${event.target.withdrawAmount.value}`);
        }
        event.target.withdrawAmount.value = '';
    }
</script>

<style>
    .navigation {
        width: 250px;
        padding: 20px;
        border-right: 1px solid var(--gray);
    }
    .line {
        margin: 0px;
        border-bottom: 1px solid var(--gray);
    }
    .margin-top {
        margin-top: 20px;
    }
    .deposit {
        margin-bottom: 20px;
    }
    .button, .input {
        width: 100%;
        margin-top: 20px;
        background: var(--light-purple);
        color: var(--purple);
        height: 40px;
        border: none;
        border-radius: 5px;
    }
    .button {
        cursor: pointer;
    }
    .input {
        background: transparent;
        border: 1px solid var(--gray);
    }
</style>

<div class='navigation'>
    <!-- user name and photo -->
    <User firstName={$user.firstName} lastName={$user.lastName} imageUrl={''}/>
    <div class='line'></div>
    <!-- cash balance and portfolio value for current user -->
    <Balance cashBalance={`$${$user.balance}`} portfolioValue={$portfolioValue != null ? `$${$portfolioValue}` : '...'}/>
    <div class='line'></div>
    <!-- list of navigation links -->
    <Link icon={'box'} text={'Portfolio'} route={'/'}/>
    <Link icon={'credit-card'} text={'Orders'} route={'/orders'}/>
    <Link icon={'archive'} text={'History'} route={'/history'}/>
    <Link icon={'grid'} text={'Explore'} route={'/explore'}/>
    <Link icon={'bell'} text={'Notifications'} route={'/notifications'}/>
    <Link icon={'bookmark'} text={'Watchlist'} route={'/watchlist'}/>
    <div class='line margin-top'></div>
    <form class='deposit' on:submit|preventDefault={deposit}>
        <input class='input' type='number' min='0' id='depositAmount'>
        <button class='button' type='submit'>Deposit</button>
    </form>
    <div class='line'></div>
    <form class='withdraw' on:submit|preventDefault={withdraw}>
        <input class='input' type='number' min='0' id='withdrawAmount'>
        <button class='button' type='submit'>Withdraw</button>
    </form>
    {#if $user.admin}
        <button on:click={() => http.forceEOD()}>Force EOD</button>
    {/if}
    {#if $date}
        <div>{$date.date}</div>
    {/if}
</div>