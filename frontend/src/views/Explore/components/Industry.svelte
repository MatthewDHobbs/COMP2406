<script>
    import page from 'page';
    import { activeIndustry } from '../../../stores';

    export let industry;
    export let numberOfStocks;
    export let photo;

    function setIndustry() {
        activeIndustry.set(industry);
        page(`/explore/${industry}`);
    }
</script>

<style>
    .industry-card {
        position: relative;
        height: 150px;
        padding: 20px;
        border-radius: 5px;
        cursor: pointer;
        color: var(--white);
    }
    .industry-content {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 20px;
    }
    .industry-name {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 5px;
    }
    .industry-stocks {
        font-size: 15px;
        font-weight: 400;
    }
</style>

<div on:click={setIndustry} class='industry-card' 
    style='
        background: linear-gradient(45deg, rgba(16,15,34,0.5) 0%, rgba(16,15,34,0) 100%), url({photo});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    '>
    <div class='industry-content'>
        <div class='industry-name'>{industry}</div>
        <div class='industry-stocks'>{numberOfStocks} Stocks</div>
    </div>
</div>