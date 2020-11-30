const url = 'http://localhost:9999/api';

export function signIn(email, password) {
    return new Promise(resolve => {
        fetch(`${url}/auth/signIn`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function createAccount(email, password, firstName, lastName) {
    return new Promise(resolve => {
        fetch(`${url}/auth/createAccount`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, firstName, lastName})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function accessTokenAuth(token) {
    return new Promise(resolve => {
        fetch(`${url}/auth/accessToken`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token}
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function getStocks() {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/stocks`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', token}
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function getStock(ticker) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/stocks/${ticker}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', token}
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function getStockHistory(ticker) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/stocks/${ticker}/history`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', token}
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}


export function buyOrder(ticker, price, quantity, expire) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/order/buy`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({ticker, price, quantity, expire})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function sellOrder(ticker, price, quantity, expire) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/order/sell`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({ticker, price, quantity, expire})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function orders() {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/orders`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', token}
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function allOrders() {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/allOrders`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', token}
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function cancelOrder(_id) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/orders/cancel`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({_id})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function deposit(amount) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/deposit`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({amount})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function withdraw(amount) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/withdraw`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({amount})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function forceEOD() {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/forceEOD`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token}
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function date() {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/date`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', token}
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function addToWatchlist(ticker) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/watchlist/add`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({ticker})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function removeFromWatchlist(ticker) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/watchlist/delete`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({ticker})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function addNotification(ticker, difference) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/notification/add`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({ticker, difference})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function deleteNotification(notificationId) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/notification/delete`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({notificationId})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function enableNotification(notificationId) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/notification/enable`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({notificationId})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}

export function disableNotification(notificationId) {
    let token = localStorage.getItem('accessToken'); 
    return new Promise(resolve => {
        fetch(`${url}/notification/disable`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', token},
            body: JSON.stringify({notificationId})
        })
        .then(response => response.json())
        .then(data => resolve(data));
    });
}