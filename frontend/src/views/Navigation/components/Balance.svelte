<script>
    export let cashBalance;
    export let portfolioValue;
</script>

<style>
    .balance {
        margin: 20px 0px;
    }
    .descriptor {
        color: var(--dark-gray);
    }
    .descriptor:not(:first-of-type) {
        margin-top: 20px;
    }
    .cash, .portfolio {
        margin-top: 5px;
    }
</style>

<div class='balance'>
    <div class='descriptor'>Cash Balance</div>
    <div class='cash'>{cashBalance}</div>
    <div class='descriptor'>Portfolio Value</div>
    <div class='portfolio'>{portfolioValue}</div>
</div>