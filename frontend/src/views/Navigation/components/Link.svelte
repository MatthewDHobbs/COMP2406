<script>
    import page from 'page';

    export let icon;
    export let text;
    export let route;
</script>

<style>
    .link {
        display: flex;
        cursor: pointer;
        align-items: center;
    }
    .link:not(:first-of-type) {
        margin-top: 20px;
    }
    .icon {
        margin-right: 10px;
    }
</style>

<div class='link' on:click={() => page(route)}>
    <img class='icon' src='/assets/icons/{icon}.svg' alt={icon}/>
    <span class='text'>{text}</span>
</div>