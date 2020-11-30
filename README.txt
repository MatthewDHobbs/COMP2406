STOCK BROKER PROJECT - SUBMISSION 3

* For this check-in I have pushed my code to OpenStack, however, I was unaware that I am unable to connect to MongoDB Atlas from the OpenStack instance.
* I emailed Professor Shaikhet and she said that you would be able to run it locally to test the functionality as I still need to write some initialization scripts for a local database on OpenStack.

There are still a few things that I need to work on:
- Sorting history by type and date
- Cleaning up user interface
- Bug fixes

OpenStack Information
- 134.117.132.197
- student
- Westfield7

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
- eod.js (Handles end of day processes)
- ws.js (Handles notifications for client (i.e. auto refresh when a stock is bought/sold))

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