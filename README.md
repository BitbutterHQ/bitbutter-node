# Bitbutter

The official Node.js library for the Bitbutter API.

## Getting started

To instantiate our Bitbutter client, we have to add some environment variables in the `.env` file. The file should look like the following.

```
PARTNERSHIP_ID=ac358815-7be3-4a6e-9731-90df228e4401
PARTNER_ID=3d6d2002-f31f-4f5b-b490-44f2af13764f
API_KEY=1Cru55C4jYGPdvefdcNSXCA51C3m9JbmU3
SECRET=L36WJuFJ8WT2GmXTvroVG6rsh1GnWaZtJLNuM9P9GLtuwD8QhPw9
```

Now that we have provided the necessary information, we can start interacting with the API. Let's navigate to `demo.ts` where we can interact with the API.

### src/demo.ts

```typescript
import dotenv = require("dotenv");
dotenv.config();

import Bitbutter from "./index";
import {
    ConnectedAddressRequestBody,
    ConnectedExchangeRequestBody,
} from "./types";

const bitbutter = new Bitbutter({
    apiKey: process.env.API_KEY,
    endpoint: "https://development.bitbutter.com",
    partnerId: process.env.PARTNER_ID,
    partnershipId: process.env.PARTNERSHIP_ID,
    secret: process.env.SECRET,
});

async function main() {
    const users = await bitbutter.getAllUsers();
    console.log(users);
}

main();
```

Let's run the following file to see if our client is set up properly. We can do this with the following command.

```
tsc && node dist/demo.js
```

This command compiles our TypeScript into JavaScript in the `dist` folder then we are executing the `demo.js` file. We should see a response like the following.

```js
{
    users: []
}
```

Now that our client is set up properly, let's start creating some users!

## Creating users

We can create a new user by calling the `createUser` method on our `bitbutter` instance. 

```typescript
const firstUser = await bitbutter.createUser();
console.log(firstUser);
```

When we create a user, we will get a response back with the following information.

```js
{
    user: {
        created_at: '2018-02-12T04:18:56.899Z',
        id: 'b8acb365-26c0-4846-863c-3cdb8749f706',
        password: 'Kwr9scJsJXbEGwcfaeXdMX8JVCShzRjHSLj1QQ53MBE7WHTZJDGc'
    }
}
```

The password is returned only upon the creation of a user and needs to be stored on the client immediately. This password will be used to interact with the Bitbutter API using a proxy API server so that we don't risk storing the API Key and Secret on the client but on a server.

```
const users = await bitbutter.getAllUsers();
console.log(users);
```

 We can verify that a user was created in our partnership by querying for all the users again.

```js
{
    users: [
        {
            created_at: '2018-02-12T04:18:56.899Z',
            id: 'b8acb365-26c0-4846-863c-3cdb8749f706',
        }
    ]
}
```

Now that we have a user created, lets connect some exchanges.

## Connected exchanges

Connected exchanges are created when a user provides the API Key and Secret (sometimes Password) from an exchange. Our recently created user should have no connected exchanges for now.

```
const connectedExchanges = await bitbutter.getUserConnectedExchanges(user.id);
console.log(connectedExchanges);
```

Let's connect a Coinbase account to our user. To do this we need to get the API credentials from Coinbase and store it in the .env file.

```
COINBASE_API_KEY=YOUR_API_KEY
COINBASE_SECRET=YOUR_SECRET
```

### Get all exchanges

Now that we have the credentials for Coinbase, we can start connecting it. First let's see what exchanges are available for us to connect.

```
const exchanges = await bitbutter.getAllExchanges();
console.log(exchanges);
```

### Connect exchange

Let's select Coinbase from the list and create a `ConnectedExchangeRequestBody` with the credentials in the `.env` file.

```typescript
const users = await bitbutter.getAllUsers();

const exchanges = await bitbutter.getAllExchanges();

const currentExchange = exchanges.exchanges.filter((e) => {
    return e.name === "Coinbase";
})[0];

const currentUser = users.users[0];

const body: ConnectedExchangeRequestBody = {
    credentials: {
        api_key: process.env.COINBASE_API_KEY,
        secret: process.env.COINBASE_SECRET,
    },
    exchange_id: currentExchange.id,
    user_id: currentUser.id,
};

await bitbutter.connectExchange(body);
```

## Connect addresses

Now that we have connected and exchange, let's connect a bitcoin wallet as well. We can check that the user has no connected addresses with the following command.

```
const connectedAddresses = await bitbutter.getUserConnectedAddresses(user.id);
console.log(connectedAddresses);
```

### Connect address

```typescript
const users = await bitbutter.getAllUsers();

const assets = await bitbutter.getAllAssets();

const bitcoin = assets.assets.filter((asset) => {
    return asset.symbol === "BTC";
})[0];

const address = process.env.BITCOIN_ADDRESS;

const currentUser = users.users[0];

const body: ConnectedAddressRequestBody = {
    address,
    asset_id: bitcoin.id,
    user_id: currentUser.id,
};

await bitbutter.connectAddress(body);
```

## Get connected exchange ledger

Let's go look at the ledger of the Coinbase account we just connected.

```typescript
const exchanges = await bitbutter.getAllExchanges();
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];
const connectedExchanges = await bitbutter.getUserConnectedExchanges(currentUser.id);
const coinbase = connectedExchanges.connected_exchanges[0];
const ledger = await bitbutter.getConnectedExchangeLedger(coinbase.id);
console.log(ledger);
```

The ledger will return a list of all deposits, withdrawals, and trades from a connected exchange.

## Get connected address ledger

Let's take a look at our Bitcoin wallet as well.

```typescript
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];
const connectedAddresses = await bitbutter.getUserConnectedAddresses(currentUser.id);
const bitcoin = connectedAddresses.connected_addresses[0];
const ledger = await bitbutter.getConnectedAddressLedger(bitcoin.id);
console.log(ledger);
```

## Get connected exchange balances

```typescript
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];
const connectedExchanges = await bitbutter.getUserConnectedExchanges(currentUser.id);
const coinbase = connectedExchanges.connected_exchanges[0];
const balances = await bitbutter.getConnectedExchangeBalances(coinbase.id);
console.log(balances);
```

## Get connected address balances

```typescript
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];
const connectedAddresses = await bitbutter.getUserConnectedAddresses(currentUser.id);
const bitcoin = connectedAddresses.connected_addresses[0];
const balances = await bitbutter.getConnectedAddressBalances(bitcoin.id);
console.log(balances);
```

## Get user ledger

We can get the ledger from all of the connected accounts (exchanges and/or addresses) from one end point with the following commands.

```typescript
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];
const ledger = await bitbutter.getUserLedger(currentUser.id);
console.log("ledger", ledger);
```

## Get user balance

```typescript
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];
const balances = await bitbutter.getUserBalances(currentUser.id);
```

## Disconnect connected exchanges

```typescript
const connectedExchanges = await bitbutter.getUserConnectedExchanges(currentUser.id);

for (const connectedExchange of connectedExchanges.connected_exchanges) {
    const deleted = await bitbutter.disconnectExchange(connectedExchange.id);
    console.log("deleted", deleted);
}
```

## Disconnect connected addresses

```typescript
const connectedAddresses = await bitbutter.getUserConnectedAddresses(currentUser.id);

for (const connectedAddress of connectedAddresses.connected_addresses) {
    const deleted = await bitbutter.disconnectAddress(connectedAddress.id);
    console.log("deleted", deleted);
}
```
