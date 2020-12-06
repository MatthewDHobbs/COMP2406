<script>
    import page from 'page';
    import * as http from '../../http';
    import { user, portfolioValue, stocks, industries, date } from '../../stores';

    let view = 'Sign in';

    async function signInForm(event) {
        const signInResponse = await http.signIn(event.target.email.value, event.target.password.value);
        if (signInResponse.accessToken) {
            localStorage.setItem('accessToken', signInResponse.accessToken);
            const authResponse = await http.accessTokenAuth(signInResponse.accessToken);
            if (!authResponse.portfolio) authResponse.portfolio = {};
            user.set(authResponse);
            init();
            page('/');
        }
    }

    async function createAccountForm(event) {
        if (event.target.password.value == event.target.confirmPassword.value) {
            const createAccountResponse = await http.createAccount(event.target.email.value, event.target.password.value, event.target.firstName.value, event.target.lastName.value);
            if (createAccountResponse.accessToken) {
                localStorage.setItem('accessToken', createAccountResponse.accessToken);
                const authResponse = await http.accessTokenAuth(createAccountResponse.accessToken);
                if (!authResponse.portfolio) authResponse.portfolio = {};
                user.set(authResponse);
                init();
                page('/');
            }
        } else {
            console.log('Passwords do not match');
        }
    }

    async function init() {
        date.set(await http.date());
        
        const stocksResponse = await http.getStocks();
        stocks.set(stocksResponse);

        let userValue;
        let portfolioValueLocal = 0;
        const unsubscribe = user.subscribe(value => userValue = value);

        let industriesResponse = {};
        for (let i = 0; i < stocksResponse.length; i++) {
            industriesResponse[stocksResponse[i].industry] ? industriesResponse[stocksResponse[i].industry]++ : industriesResponse[stocksResponse[i].industry] = 1;
            if (userValue.portfolio && userValue.portfolio[stocksResponse[i].ticker]) {
                portfolioValueLocal += userValue.portfolio[stocksResponse[i].ticker].numShares * stocksResponse[i].currentPrice;
            }
        }
        industries.set(industriesResponse);
        portfolioValue.set(portfolioValueLocal);
        unsubscribe();
    }
</script>

<style>
    .form, .image {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
    }
    .image {
        background: var(--purple); /* fallback */
        background: linear-gradient(0deg,rgba(16,15,34,0.9),rgba(16,15,34,0.9)), url('https://images.unsplash.com/photo-1443110189928-4448af4a2bc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
    .form > form {
        width: 80%;
        max-width: 500px;
    }
    form > div, form > input, form > button {
        width: 100%;
    }
    form > input {
        margin: 40px 0px 0px 0px;
        padding: 0px 0px 0px 20px;
        border: 1px solid var(--gray);
        border-radius: 5px;
        height: 50px;
    }
    form > input:placeholder {
        color: var(--gray);
    }
    .form-header {
        font-weight: 500;
        font-size: 24px;
    }

    .header, .subheader {
        color: var(--white);
        font-size: 20px;
        font-weight: 300;
        margin-top: 5px;
    }
    .subheader {
        font-weight: 500;
    }
    .submit {
        background: var(--black);
        color: var(--white);
        height: 50px;
        margin-top: 40px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .submit-light {
        width: 200px;
        background-color: var(--white);
        color: var(--purple);
    }
    .authentication {
        display: grid;
        grid-template-columns: 2fr 1fr;
        height: 100%;
    }
</style>

<div class='authentication'>
    <div class='form'>
        {#if view == 'Sign in'}
            <form class='sign-in' on:submit|preventDefault={signInForm}>
                <div class='form-header'>Sign in to your account</div>
                <input required type='email' id='email' placeholder='Email Address'/><br>
                <input required type='password' id='password' placeholder='Password'/><br>
                <button class='submit' type='submit'>Sign in</button>
            </form>
        {:else}
            <form class='create-account' on:submit|preventDefault={createAccountForm}>
                <div class='form-header'>Create an account</div>
                <input required type='text' id='firstName' placeholder='First Name'/><br>
                <input required type='text' id='lastName' placeholder='Last Name'/><br>
                <input required type='email' id='email' placeholder='Email Address'/><br>
                <input required type='password' id='password' placeholder='Password'/><br>
                <input required type='password' id='confirmPassword' placeholder='Confirm Password'/><br>
                <button class='submit' type='submit'>Create account</button>
            </form>
        {/if}
    </div>
    <div class='image'>
        <div class='content'>
            <div class='header'>{view == 'Sign in' ? 'Don\'t have an account?' : 'Already have an account?'}</div>
            <div class='subheader'>{view == 'Sign in' ? 'Create one.' : 'Sign in.'}</div>
            <button class='submit submit-light' on:click={() => view = view == 'Sign in' ? 'Create account' : 'Sign in'}>{view == 'Sign in' ? 'Create account' : 'Sign in'}</button>
        </div>
    </div>
</div>