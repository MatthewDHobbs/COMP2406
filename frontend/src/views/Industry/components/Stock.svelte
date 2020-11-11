<script>
    import page from 'page';
    import { activeIndustry, activeStock } from '../../../stores';

    export let name;
    export let ticker;
    export let logo = '';

    function setStock() {
        activeStock.set(ticker);
        page(`/explore/${$activeIndustry ? $activeIndustry : 'n'}/${ticker}`);
    }
</script>

<style>
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
    }
    .stock-ticker {
        position: absolute;
        bottom: 0;
        color: var(--dark-gray);
    }
</style>

<div class='stock' on:click={setStock}>
    <div class='stock-logo' style={logo != '' ? `background-image: url(${logo})` : 'background: #C9C8D2'}>{logo ? '' : name[0].toUpperCase()}</div>
    <div class='stock-content'>
        <div class='stock-name'>{name}</div>
        <div class='stock-ticker'>{ticker}</div>
    </div>
    <slot></slot>
</div>