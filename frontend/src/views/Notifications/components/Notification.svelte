<script>
    import * as http from '../../../http';
    import { user } from '../../../stores';

    export let id;
    export let ticker;
    export let enabled;
    export let condition;

    async function toggle() {
        enabled ? await http.disableNotification(id) : await http.enableNotification(id);
        refreshUser();
    }

    async function del() {
        await http.deleteNotification(id);
        refreshUser();
    }

    async function refreshUser() {
        const accessToken = localStorage.getItem('accessToken');
        const authResponse = await http.accessTokenAuth(accessToken);
		if (!authResponse.portfolio) authResponse.portfolio = {};
		user.set(authResponse);
    }
</script>

<style>
    .notification {
        display: flex;
        cursor: pointer;
        margin-bottom: 20px;
        border: 1px solid var(--gray);
        border-radius: 5px;
        padding: 10px;
    }
    .notification-name {
        flex-grow: 1;
    }
    .enabled {
        color: var(--black);
    }
    .disabled {
        color: var(--gray);
    }
</style>

<div class='notification'>
    <div class='notification-name {enabled ? 'enabled' : 'disabled'}'>{ticker} ({condition})</div>
    <button on:click={toggle}>{enabled ? 'Disable' : 'Enable'}</button>
    <button on:click={del}>Delete</button>
</div>