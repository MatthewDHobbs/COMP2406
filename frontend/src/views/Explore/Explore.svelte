<script>
    import { industries } from '../../stores';
    import { industryPhotos } from '../../../public/assets/industryPhotos';
    import Industry from './components/Industry.svelte';
</script>

<style>
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

<div class='header'>Explore</div>

<div class='industry-grid'>
    {#each Object.keys($industries).sort() as industry}
        <Industry industry={industry} numberOfStocks={$industries[industry]} photo={industryPhotos[industry.toLowerCase()]}/>
    {/each}
</div>