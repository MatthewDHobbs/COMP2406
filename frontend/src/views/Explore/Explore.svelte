<script>
    import { industries } from '../../stores';
    import { industryPhotos } from '../../../public/assets/industryPhotos';
    import Industry from './components/Industry.svelte';
</script>

<style>
    .search {
        height: 50px;
        width: calc(100% - 80px);
        margin: 40px;
        padding-left: 20px;
        box-sizing: border-box;
        background: transparent;
        border: 1px solid var(--gray);
        border-radius: 5px;
        font-size: 15px;
        font-weight: 400;
        color: var(--black);
    }
    .search::placeholder {
        color: var(--dark-gray);
    }
    .header {
        font-size: 24px;
        font-weight: 500;
        color: var(--black);
        margin: 0px 40px 40px 40px;
    }
    .industry-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 0px 40px 40px 40px;
    }
</style>

<input type='text' class='search' placeholder='Search for an industry, stock ticker, or company name'>

<div class='header'>Explore</div>

<div class='industry-grid'>
    {#each Object.keys($industries).sort() as industry}
        <Industry industry={industry} numberOfStocks={$industries[industry]} photo={industryPhotos[industry.toLowerCase()]}/>
    {/each}
</div>