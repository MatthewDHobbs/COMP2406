STOCK BROKER PROJECT - SUBMISSION 2

For this submission, I have the basics of buying and selling stocks implemented. Users can create buy orders and sell orders. To test the app you can sign in to the admin account (email: admin@admin.com, password: admin).
This account has all the stocks in the portfolio (i.e. 100 shares of each stock). You can create sell orders in this account and see them in the orders page. You can then create an account for yourself. In the account
you create, you can deposit funds in the nav menu, and create buy orders.

There are a few issues regarding buying and selling stock that you should be aware of.
- Automatic updates are not currently implemented: you will need to refresh the page to see changes.
- Buy and sell order expiration dates are not currently implemented (although you can cancel orders in the orders page).

----------

I am using Svelte as a frontend framework for this assignment.
Below is a list of all the important files and what each one is responsible for.

- index.js (Express server to serve both frontend and backend)
- rollup.config.js (Configuration for rollup which bundles Svelte project)
- package.json and package.lock.json (Defines all required packages)

/backend
- router.js (Routes for backend API)
- schema.js (Defines mongoose schema and models)
- order.js (Handles coordinating buy and sell orders)

/frontend/public
- index.html and global.css
- /assets (All assets required for the application)
- /build (Folder where app bundles are placed after being built using rollup)

/frontend/src
- main.js (Initial loading point for Svelte application)
- stores.js (File for storing data that can be used across the application)
- http.js (File for wrapping all HTTP requests to simplify use in the application)
- App.svelte (Page that is rendered (includes routing)
- /views (All folders under here include different views and components for each view)

----------

To run this program:
- npm install
- npm start

Navigate to localhost:3000 to see the application