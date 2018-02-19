
# Bitbutter API: Getting Started Guide

This getting started guide will walk you through connecting cryptocurrency exchanges and addresses *(feature coming soon)* using the Bitbutter API Node.js client library. The complete API reference documentation can be found at [https://docs.bitbutter.com/](https://docs.bitbutter.com/).

## Setup

```
git clone https://github.com/BitbutterHQ/bitbutter-node.git
```

## Set environment variables

All endpoints require a valid `PARTNERSHIP_ID`, `PARTNER_ID`, `API_KEY` and `SECRET` to access and are accessible from a valid instance of a Bitbutter client. Contact our team at [support@bitbutter.com](support@bitbutter.com) to obtain API keys for your developer team.

To instantiate our Bitbutter client, we have to add some environment variables in a `.env` file. The file should contain this:

```
PARTNERSHIP_ID=ac358815-7be3-4a6e-9731-90df228e4401
PARTNER_ID=3d6d2002-f31f-4f5b-b490-44f2af13764f
API_KEY=1Cru55C4jYGPdvefdcNSXCA51C3m9JbmU3
SECRET=L36WJuFJ8WT2GmXTvroVG6rsh1GnWaZtJLNuM9P9GLtuwD8QhPw9
```

## Create clients

Now that we have provided the necessary information, we can start interacting with the API by creating a Bitbutter client instance. Let's navigate to `demo.ts`, within the `src` folder, where we can interact with the API.

```typescript
import dotenv = require("dotenv");
dotenv.config();

import Bitbutter from "./index";
import {
    ConnectedAddressRequestBody,
    ConnectedExchangeRequestBody,
} from "./types";

// creating a partner client using partner/partnership ids
const bitbutter = new Bitbutter({
    apiKey: process.env.API_KEY,
    endpoint: "https://development.bitbutter.com",
    partnerId: process.env.PARTNER_ID,
    partnershipId: process.env.PARTNERSHIP_ID,
    secret: process.env.SECRET,
});

// creating a user client using user id
const client = new Bitbutter({
    apiKey: process.env.USER1_API_KEY,
    endpoint: process.env.ENDPOINT,
    secret: process.env.USER1_SECRET,
    userId: process.env.USER1_ID,
});

async function main() {
    const users = await bitbutter.getAllUsers();
    console.log(users);
}

main();
```

Let's run the following file to see if our client is set up properly. We can do this by running the following command in terminal:

```
tsc && node dist/demo.js
```

## Partner client versus User client

Above we are creating two clients: (1) a partner client (2) a user client. The user client is able to create users, connect/disconnect exchanges, and get specific user balances/ledgers. The partner client is needed to get all users and get all exchanges.

Note: We have access controls coming soon but right now all the connected accounts have private access.

## Create users

We can create a new user by calling the `createUser` method on our `client` instance (user client).

```typescript
const firstUser = await client.createUser();
```

Expected response:

```js
{ user:
   { created_at: '2018-02-19T02:54:36.831Z',
     credentials:
      { api_key: '1MvPzYgpf82MnZk31uFt4vCg9FF8ixgUBC',
        secret: 'KzkSEWa7ESktAMnw2RrfxAdVfcyA3EX8Kdu58RSPxD2xFRASDGdF'
},
     id: 'b4f1599c-2912-42f4-b03a-452aafa5a4f0'

   }
}
```

The password is returned only upon the creation of a user and needs to be stored on the client immediately.

## Get all users

We can verify that a user was created in our partnership by querying for all users.

```typescript
const users = await bitbutter.getAllUsers();
```

Example response:

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

If no users have been created under a partnership, users variable should be an empty array:

```js
{  
	users: []
}
```


## Get all exchanges

Note: As of 2/2018, we are supporting the following exchanges: Binance, Bittrex, and Coinbase. We are actively working on adding support for many more. We will update the docs when we do.

Now that we have the credentials for Coinbase, we can start connecting it. First let's see what exchanges are available for us to connect.

```typescript
const exchanges = await bitbutter.getAllExchanges();
```

Expected response:

``` js
{ exchanges:
   [ { id: '096e056f-4832-489f-8e8e-0691ddc27a55', name: 'Binance' },
     { id: '68d64623-88cf-43af-b40c-4c52431d3469', name: 'Bitstamp' },
     { id: '432c723f-d9d8-48f2-9c5a-a76125caed7a', name: 'Bittrex' },
     { id: '5e808253-2c7f-4436-b484-0372a60b2669', name: 'Cex' },
     { id: '0e390e8c-d30b-4556-9689-39c57bbbf9b4', name: 'Coinbase' },
     { id: '9dd77313-cc05-41a5-8438-3af146bfa390', name: 'GDAX' },
     { id: '3005d56f-1b6b-4b8e-a25c-d001c1113fbb', name: 'Gemini' },
     { id: '1b70129d-1222-4c74-8310-ae143e640baf', name: 'HitBTC' },
     { id: '20c2be30-280b-4311-8a54-01a4c69db948', name: 'Kraken' },
     { id: 'fe3ecdbc-115e-41bd-8c44-a96750e2201c', name: 'Poloniex' }
    ]
}
```

## Connect exchanges

Connected exchanges are created when a user provides the API Key and Secret (sometimes Password) from an exchange. A newly created user should have no connected exchanges. For this example we will be connecting a user’s Coinbase account.

### Step 1: Connect a Coinbase account to our user

To do this, we need to get the user’s API credentials from Coinbase and store it in the `.env` file.

```
COINBASE_API_KEY=YOUR_API_KEY
COINBASE_SECRET=YOUR_SECRET
```

### Step 2: Select Coinbase and create a create a ConnectedExchangeRequestBody

To do this, we get all exchanges, select Coinbase from the returned list, and create a `ConnectedExchangeRequestBody` with the credentials in the `.env` file.

```typescript
//get all users for partnership
const users = await bitbutter.getAllUsers();

//get all exchanges supported by bitbutter
const exchanges = await bitbutter.getAllExchanges();

//Select and set current exchange ie: Coinbase
const currentExchange = exchanges.exchanges.filter((e) => {
    return e.name === "Coinbase";
})[0];

//Select and set current user
const currentUser = users.users[0];

//requesting to connect exchange using user’s api credentials
const body: ConnectedExchangeRequestBody = {
    credentials: {
        api_key: process.env.COINBASE_API_KEY,
        secret: process.env.COINBASE_SECRET,
    },
    exchange_id: currentExchange.id,
    user_id: currentUser.id,
};

await client.connectExchange(body);
```

## Get connected exchanges

Connected exchanges are created when a user provides the API Key and Secret (sometimes Password) from an exchange.

``` typescript
const connectedExchanges = await client.getUserConnectedExchanges(user.id);
```

Expected response:

```js
{ connected_exchanges:
   [ { exchange: [Object],
       id: '61cc39db-2803-4550-9f1c-dbde1d09b210' },
     { exchange: [Object],
       id: 'a9a4d776-a2d6-4258-890a-73a18388186a' },
     { exchange: [Object],
       id: 'fab30ce0-2edd-4352-8a26-15f7e358bbec' } ] }
```

## Get connected exchange ledger

Now let's look at the ledger for the user’s Coinbase account we connected.

``` typescript
const exchanges = await bitbutter.getAllExchanges();

const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];

const connectedExchanges = await client.getUserConnectedExchanges(currentUser.id);

const coinbase = connectedExchanges.connected_exchanges[0];
const ledger = await client.getConnectedExchangeLedger(coinbase.id);
```

The ledger will return a list of all deposits, withdrawals, and trades from a connected exchange. The response should look similar to this:

```js
[ { transaction_type: 'buy',
    connectable:
     { id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
       name: 'Binance',
       type: 'Exchange' },
    base: { name: 'Bitcoin', size: '0.00135600', symbol: 'BTC' },
    quote: { name: 'Tether', size: '-25.52402868', symbol: 'USDT' },
    fee: { name: 'Bitcoin', size: '0.00000136', symbol: 'BTC' },
    size: { name: 'Bitcoin', size: '0.00135600', symbol: 'BTC' },
    tx_id: null,
    time: '2017-12-18T04:47:10.284Z',
    details:
     { subtitle: 'Using Binance Bitcoin account',
       title: 'Bought Bitcoin' } },
  { transaction_type: 'buy',
    connectable:
     { id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
       name: 'Binance',
       type: 'Exchange' },
    base: { name: 'Bitcoin', size: '0.00004400', symbol: 'BTC' },
    quote: { name: 'Tether', size: '-0.82821200', symbol: 'USDT' },
    fee: { name: 'Bitcoin', size: '0.00000004', symbol: 'BTC' },
    size: { name: 'Bitcoin', size: '0.00004400', symbol: 'BTC' },
    tx_id: null,
    time: '2017-12-18T04:47:09.695Z',
    details:
     { subtitle: 'Using Binance Bitcoin account',
       title: 'Bought Bitcoin' } }, … ]
```

## Get connected exchange balance

```typescript
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];

const connectedExchanges = await client.getUserConnectedExchanges(currentUser.id);

const coinbase = connectedExchanges.connected_exchanges[0];
const balances = await client.getConnectedExchangeBalances(coinbase.id);
```

Balances will return a list of balances by each asset (BTC, ETH, etc.) from all connected exchange. The response should look similar to this:

```js
[ { asset:
     { id: '0b40e35b-a374-4bba-9734-aabfcfb380fc',
       name: 'Bitcoin',
       size: '0.00000000',
       symbol: 'BTC' },
    connectable:
     { id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
       name: 'Binance',
       type: 'Exchange' },
    name: 'BTC' },
  { asset:
     { id: '8b0f7276-efbc-47de-b97a-d6e3136e5570',
       name: 'Litecoin',
       size: '0.00000000',
       symbol: 'LTC' },
    connectable:
     { id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
       name: 'Binance',
       type: 'Exchange' },
    name: 'LTC' },
  { asset:
     { id: 'f35d200b-adeb-4b5f-9b9a-e98ba511202c',
       name: 'Ethereum',
       size: '0.00500000',
       symbol: 'ETH' },
    connectable:
     { id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
       name: 'Binance',
       type: 'Exchange' },
    name: 'ETH' }, …]
```

## Get user ledger

We can get the ledger from all of the connected accounts (exchanges and/or addresses) from one endpoint.

```typescript
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];

const ledger = await client.getUserLedger(currentUser.id);
```

Example response:

```js
[ { transaction_type: 'exchange_deposit',
    connectable:
     { id: 'fab30ce0-2edd-4352-8a26-15f7e358bbec',
       name: 'Bittrex',
       type: 'Exchange' },
    from: { address: null, asset: [Object], name: 'Bitcoin network' },
    size: { name: 'Bitcoin', size: '0.01900000', symbol: 'BTC' },
    tx_id: 'd5d497ff9b82b84bcf60cb7d99e3def9e2062ffbb85f61b1f03dd915b32cd5e7',
    time: '2018-02-16T19:40:13.790Z',
    details: { subtitle: 'From Bitcoin address', title: 'Received Bitcoin' } },
  { transaction_type: 'exchange_withdrawal',
    connectable:
     { id: 'fab30ce0-2edd-4352-8a26-15f7e358bbec',
       name: 'Bittrex',
       type: 'Exchange' },
    to:
     { address: '1MX13xKoS1SnLCKXw4fGA57Ph88hdFmgaZ',
       asset: [Object],
       name: 'Bitcoin network' },
    fee: { name: 'Bitcoin', size: '0.00100000', symbol: 'BTC' },
    size: { name: 'Bitcoin', size: '0.33767561', symbol: 'BTC' },
    tx_id: 'a869a9ac1f6570e1b4c42aa2f1f154b9aa1a58d300b3750a3f562fcb76e56938',
    time: '2018-02-16T16:44:32.570Z',
    details: { subtitle: 'To Bitcoin address', title: 'Sent Bitcoin' } },
  { transaction_type: 'sell',
    connectable:
     { id: 'fab30ce0-2edd-4352-8a26-15f7e358bbec',
       name: 'Bittrex',
       type: 'Exchange' },
    base: { name: 'Lisk', size: '-108.76818800', symbol: 'LSK' },
    quote: { name: 'Bitcoin', size: '0.33952207', symbol: 'BTC' },
    fee: { name: 'Bitcoin', size: '0.00084880', symbol: 'BTC' },
    size: { name: 'Lisk', size: '-108.76818800', symbol: 'LSK' },
    tx_id: null,
    time: '2018-02-16T16:43:42.710Z',
    details:
     { subtitle: 'Using Bittrex Bitcoin account',
       title: 'Sell Lisk' } },
  { transaction_type: 'exchange_withdrawal',
    connectable:
     { id: 'a9a4d776-a2d6-4258-890a-73a18388186a',
       name: 'Coinbase',
       type: 'Exchange' },
    to:
     { address: '12DeYENYYxRAYbQ5RumJ9t2MEuig9TV6Rp',
       asset: [Object],
       name: 'Bitcoin network' },
    size: { name: 'Bitcoin', size: '-0.50000000', symbol: 'BTC' },
    tx_id: '0ee21acf02ea680ca3a39a6d4b7c9f4b03bdcc4da74dc7fcb56fe58d2ff4e967',
    time: '2018-02-06T05:31:26.000Z',
    details: { subtitle: 'To Bitcoin address', title: 'Sent Bitcoin' } },
  { transaction_type: 'exchange_deposit',
    connectable:
     { id: 'a9a4d776-a2d6-4258-890a-73a18388186a',
       name: 'Coinbase',
       type: 'Exchange' },
    to: { address: null, asset: [Object], name: 'GDAX' },
    size: { name: 'Bitcoin', size: '0.50000000', symbol: 'BTC' },
    tx_id: null,
    time: '2018-02-06T05:31:25.000Z',
    details: { subtitle: 'From GDAX', title: 'Transferred Bitcoin' } }, … ]
```

## Get user balance

Returns all asset balances from connected exchanges and addresses.

```typescript
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];

const balances = await client.getUserBalances(currentUser.id);
```

Expected response:

```js
 [ { asset: { id: '0b40e35b-a374-4bba-9734-aabfcfb380fc',
       name: 'Bitcoin',
       size: '0.00000000',
       symbol: 'BTC' },
    connectable:
     { id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
       name: 'Binance',
       type: 'Exchange' },
    name: 'BTC' },
  { asset:
     { id: '8b0f7276-efbc-47de-b97a-d6e3136e5570',
       name: 'Litecoin',
       size: '0.00000000',
       symbol: 'LTC' },
    connectable:
     { id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
       name: 'Binance',
       type: 'Exchange' },
    name: 'LTC' },
  { asset:
     { id: 'f35d200b-adeb-4b5f-9b9a-e98ba511202c',
       name: 'Ethereum',
       size: '0.00500000',
       symbol: 'ETH' },
    connectable:
     { id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
       name: 'Binance',
       type: 'Exchange' },
    name: 'ETH' },
  { asset:
     { id: 'cfb9ff4f-4f54-4378-a821-a8c5361eeba2',
       name: null,
       size: '0.00000000',
       symbol: 'BNC' },
    connectable:
     { id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
       name: 'Binance',
       type: 'Exchange' },
    name: 'BNC' }, ...]

```

## Disconnect connected exchanges

To disconnect a user’s connected exchange.

```typescript

  const users = await bitbutter.getAllUsers();
  const currentUser = users.users[0];
  const connectedExchanges = await client.getUserConnectedExchanges(currentUser.id);

  for (const connectedExchange of connectedExchanges.connected_exchanges) {
      const deleted = await client.disconnectExchange(connectedExchange.id);
      console.log("deleted", deleted);
  }
```

Expected response:

```js
deleted { exchange: { id: '050a488b-cedd-4e8a-9258-137d98b60aaa', name: 'Binance' },
  id: '16ff5fd3-33f7-493e-80ce-19d73a2620f2' }
deleted { exchange: { id: 'f458bf39-c68d-453a-9275-7b103a5c1556', name: 'Bittrex' },
  id: 'bbc388ac-81b0-4acd-aa6a-d79e0644af17' }
deleted { exchange: { id: 'f458bf39-c68d-453a-9275-7b103a5c1556', name: 'Bittrex' },
  id: '46e2da3f-1cf3-49c2-9951-2f08035e2ea5' }
```

##

And that concludes this getting started guide for Bitbutter’s API using the Node.js client library! Now that we’ve covered the basics, you can find the complete API documentation at [https://docs.bitbutter.com/](https://docs.bitbutter.com/).

If you have questions, feel free to reach out to us at [support@bitbutter.com](support@bitbutter.com).
