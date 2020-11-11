<script>
    import page from 'page';
    import { user } from '../../../stores'; 

    export let firstName;
    export let lastName;
    export let imageUrl;

    function signOut() {
        localStorage.clear('accessToken');
        user.set(null);
        page('/authentication');
    }
</script>

<style>
    .user {
        display: flex;
        margin-bottom: 20px;
    }
    .image {
        width: 40px;
        height: 40px;
        border-radius: 5px;
        font-weight: 500;
        color: white;

        /* center inner text */
        display: flex;
        justify-content: center;
        align-items: center;

        background: var(--purple);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
    .content {
        position: relative;
        margin-left: 10px;
    }
    .link {
        position: absolute;
        bottom: 0;
        color: var(--purple);
        cursor: pointer;
    }
</style>

<div class='user'>
    {#if firstName && lastName}
        <div class='image' style='background-image: url({imageUrl})'>{imageUrl ? '' : `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`}</div>
    {/if}
    <div class='content'>
        <div class='name'>{firstName} {lastName}</div><br>
        <div class='link' on:click={signOut}>Sign out</div>
    </div>
</div>