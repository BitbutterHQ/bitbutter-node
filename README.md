
# Bitbutter API: Getting Started Guide

This getting started guide will walk you through connecting cryptocurrency exchanges and addresses using the Node.js client. The client interfaces with the Bitbutter by making requests along with correct headers for authentication.

This guide works through how we might use the Bitbutter API on any client whether that is a web client or a mobile client. The complete API reference documentation can be found at [https://docs.bitbutter.com/](https://docs.bitbutter.com/).

## Available Exchanges

<img width="150" style="display:inline-block;margin:0" src="img/binance.png">

<img width="120" style="display:inline-block;" src="img/bittrex.png">

<img width="120" src="https://www.coinbase.com/assets/press/coinbase-logos/coinbase.png">

## Coming Soon

<img height="38" src="https://i.imgur.com/P3SnIHh.png">

<img width="120" src="img/poloniex.png">

<img width="120" src="img/kraken.png">

## Setup

```
git clone https://github.com/BitbutterHQ/bitbutter-node.git
```

## Set environment variables

To create a user to start connecting exchanges and addresses, we have to first create a `.env` file and provide information for `PARTNERSHIP_ID` and `ENDPOINT`. The `PARTNERSHIP_ID` will be provided by one of our team members via Slack. The value for `ENDPOINT` should be `https://app-8697.on-aptible.com`.

```
PARTNERSHIP_ID=ac358815-7be3-4a6e-9731-90df228e4401
ENDPOINT=https://app-8697.on-aptible.com
```

## Create user

We can create a new user by calling the `createUser` method on our `client` instance (user client). First let's modify `demo.ts` with the following code.

```typescript
import dotenv = require("dotenv");
dotenv.config();

import Bitbutter from "./index";
import {
    ConnectedAddressRequestBody,
    ConnectedExchangeRequestBody,
} from "./types";

const publicClient = new Bitbutter({
    endpoint: process.env.ENDPOINT,
    partnershipId: process.env.PARTNERSHIP_ID,
});

async function main() {
    const newUser = await publicClient.createUser();
    console.log(newUser);
}

main();
```

Here we are creating a public client with the `ENDPOINT` and `PARTNERSHIP_ID` that we provided in the `.env` file. Let's go ahead and run this file with the following command:

```
tsc && node dist/demo.js
```

This command compiles our Typescript project into a JavaScript project and places it in the `dist` directory. Then we are using `node` to execute the generated `demo.js` file. The response should look like the following.

```js
{
    user: {
        created_at: '2018-02-19T02:54:36.831Z',
        credentials: {
            api_key: '1MvPzYgpf82MnZk31uFt4vCg9FF8ixgUBC',
            secret: 'KzkSEWa7ESktAMnw2RrfxAdVfcyA3EX8Kdu58RSPxD2xFRASDGdF'
        },
        id: 'b4f1599c-2912-42f4-b03a-452aafa5a4f0'
    }
}
```

Now that we have information regarding the first created user, we can now create a user client to do more interesting things. First let's take the response that we got and store the necessary information in the `.env` file. Our `.env` file should look like the following now:

```
PARTNERSHIP_ID=ac358815-7be3-4a6e-9731-90df228e4401
ENDPOINT=https://app-8697.on-aptible.com
USER_ID=b4f1599c-2912-42f4-b03a-452aafa5a4f0
USER_API_KEY=1MvPzYgpf82MnZk31uFt4vCg9FF8ixgUBC
USER_SECRET=KzkSEWa7ESktAMnw2RrfxAdVfcyA3EX8Kdu58RSPxD2xFRASDGdF
```

We can create a user client with the new information. This client will now be able to make requests to user protected routes such as connecting an exchange.

```typescript
const userClient = new Bitbutter({
    apiKey: process.env.USER1_API_KEY,
    endpoint: process.env.ENDPOINT,
    secret: process.env.USER1_SECRET,
    userId: process.env.USER1_ID,
});
```

## Get all exchanges

Now that we have the credentials for Coinbase, we can start connecting it. First let's see what exchanges are available for us to connect. Replace function main() in the demo file with this new function main().

```typescript
async function main() {
    const exchanges = await userClient.getAllExchanges();
}
```

Expected response:

``` js
{
    exchanges: [
        {
            id: '096e056f-4832-489f-8e8e-0691ddc27a55',
            name: 'Binance'
        },
        {
            id: '68d64623-88cf-43af-b40c-4c52431d3469',
            name: 'Bitstamp'
        },
        {
            id: '432c723f-d9d8-48f2-9c5a-a76125caed7a',
            name: 'Bittrex'
        },
        {
            id: '5e808253-2c7f-4436-b484-0372a60b2669',
            name: 'Cex'
        },
        {
            id: '0e390e8c-d30b-4556-9689-39c57bbbf9b4',
            name: 'Coinbase'
        },
        {
            id: '9dd77313-cc05-41a5-8438-3af146bfa390',
            name: 'GDAX'
        },
        {
            id: '3005d56f-1b6b-4b8e-a25c-d001c1113fbb',
            name: 'Gemini'
        },
        {
            id: '1b70129d-1222-4c74-8310-ae143e640baf',
            name: 'HitBTC'
        },
        {
            id: '20c2be30-280b-4311-8a54-01a4c69db948',
            name: 'Kraken'
        },
        {
            id: 'fe3ecdbc-115e-41bd-8c44-a96750e2201c',
            name: 'Poloniex'
        }
    ]
}
```

## Connect exchanges

Connected exchanges are created when a user provides the API Key and Secret (sometimes Password) from an exchange. A newly created user should have no connected exchanges. For this example we will be connecting a user’s Coinbase account.

### Provide Coinbase credentials

To do this, we need to get the user’s API credentials from Coinbase and store it in the `.env` file.

```
COINBASE_API_KEY=YOUR_API_KEY
COINBASE_SECRET=YOUR_SECRET
```

### Select Coinbase and connect exchange

To do this, we get all exchanges, select Coinbase from the returned list, and create a `ConnectedExchangeRequestBody` with the credentials in the `.env` file. Replace function main() in the demo file with this new function main().

```typescript
async function main() {
    const exchanges = await userClient.getAllExchanges();

    const currentExchange = exchanges.exchanges.filter((e) => {
        return e.name === "Coinbase";
    })[0];

    const body: ConnectedExchangeRequestBody = {
        credentials: {
            api_key: process.env.COINBASE_API_KEY,
            secret: process.env.COINBASE_SECRET,
        },
        exchange_id: currentExchange.id,
        user_id: process.env.USER_ID,
    };

    await userClient.connectExchange(body);
}
```

## Get connected exchanges

Connected exchanges are created when a user provides the API Key and Secret (sometimes Password) from an exchange. Replace main() function with below.

``` typescript
async function main() {
    const connectedExchanges = await userClient.getUserConnectedExchanges(process.env.USER_ID);
}
```

### Expected response

```js
{
    connected_exchanges: [
        {
            exchange: [Object],
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210'
        },
        {
            exchange: [Object],
            id: 'a9a4d776-a2d6-4258-890a-73a18388186a'
        },
        {
            exchange: [Object],
            id: 'fab30ce0-2edd-4352-8a26-15f7e358bbec'
        }
    ]
}
```

## Get connected exchange ledger

Now let's look at the ledger for the user’s Coinbase account we connected. Replace main() function with below.

``` typescript
async function main() {
    const exchanges = await userClient.getAllExchanges();
    const connectedExchanges = await userClient.getUserConnectedExchanges(process.env.USER_ID);
    const coinbase = connectedExchanges.connected_exchanges[0];
    const ledger = await userClient.getConnectedExchangeLedger(coinbase.id);
}
```

The ledger will return a list of all deposits, withdrawals, and trades from a connected exchange.

### Expected response

```js
[
    {
        transaction_type: 'buy',
        connectable: {
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
            name: 'Binance',
            type: 'Exchange'
        },
        base: {
            name: 'Bitcoin',
            size: '0.00135600',
            symbol: 'BTC'
        },
        quote: {
            name: 'Tether',
            size: '-25.52402868',
            symbol: 'USDT'
        },
        fee: {
            name: 'Bitcoin',
            size: '0.00000136',
            symbol: 'BTC'
        },
        size: {
            name: 'Bitcoin',
            size: '0.00135600',
            symbol: 'BTC'
        },
        tx_id: null,
        time: '2017-12-18T04:47:10.284Z',
        details: {
            subtitle: 'Using Binance Bitcoin account',
            title: 'Bought Bitcoin'
        }
    },
    {
        transaction_type: 'buy',
        connectable: {
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
            name: 'Binance',
            type: 'Exchange'
        },
        base: {
            name: 'Bitcoin',
            size: '0.00004400',
            symbol: 'BTC'
        },
        quote: {
            name: 'Tether',
            size: '-0.82821200',
            symbol: 'USDT'
        },
        fee: {
            name: 'Bitcoin',
            size: '0.00000004',
            symbol: 'BTC'
        },
        size: {
            name: 'Bitcoin',
            size: '0.00004400',
            symbol: 'BTC'
        },
        tx_id: null,
        time: '2017-12-18T04:47:09.695Z',
        details: {
            subtitle: 'Using Binance Bitcoin account',
            title: 'Bought Bitcoin'
        }
    }, …
]
```

## Get connected exchange balance

Replace main() function with below.

```typescript
async function main() {
    const connectedExchanges = await userClient.getUserConnectedExchanges(process.env.USER_ID);
    const coinbase = connectedExchanges.connected_exchanges[0];
    const balances = await userClient.getConnectedExchangeBalances(coinbase.id);
}
```

Balances will return a list of balances by each asset (BTC, ETH, etc.) from all connected exchange.

### Expected response

```js
[
    {
        asset: {
            id: '0b40e35b-a374-4bba-9734-aabfcfb380fc',
            name: 'Bitcoin',
            size: '0.00000000',
            symbol: 'BTC'
        },
        connectable: {
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
            name: 'Binance',
            type: 'Exchange'
        },
        name: 'BTC'
    },
    {
        asset: {
            id: '8b0f7276-efbc-47de-b97a-d6e3136e5570',
            name: 'Litecoin',
            size: '0.00000000',
            symbol: 'LTC'
        },
        connectable: {
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
            name: 'Binance',
            type: 'Exchange'
        },
        name: 'LTC'
    },
    {
        asset: {
            id: 'f35d200b-adeb-4b5f-9b9a-e98ba511202c',
            name: 'Ethereum',
            size: '0.00500000',
            symbol: 'ETH'
        },
        connectable: {
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
            name: 'Binance',
            type: 'Exchange'
        },
        name: 'ETH'
    }, …
]
```

## Get user ledger

We can get the ledger from all of the connected accounts (exchanges and/or addresses) from one endpoint. Replace main() function with below.

```typescript
async function main() {
    const ledger = await userClient.getUserLedger(process.env.USER_ID);
}
```

### Expected response

```js
[
    {
        transaction_type: 'exchange_deposit',
        connectable: {
            id: 'fab30ce0-2edd-4352-8a26-15f7e358bbec',
            name: 'Bittrex',
            type: 'Exchange'
        },
        from: {
            address: null,
            asset: [Object],
            name: 'Bitcoin network'
        },
        size: {
            name: 'Bitcoin',
            size: '0.01900000',
            symbol: 'BTC'
        },
        tx_id: 'd5d497ff9b82b84bcf60cb7d99e3def9e2062ffbb85f61b1f03dd915b32cd5e7',
        time: '2018-02-16T19:40:13.790Z',
        details: {
            subtitle: 'From Bitcoin address',
            title: 'Received Bitcoin'
        }
    },
    {
        transaction_type: 'exchange_withdrawal',
        connectable: {
            id: 'fab30ce0-2edd-4352-8a26-15f7e358bbec',
            name: 'Bittrex',
            type: 'Exchange'
        },
        to: {
            address: '1MX13xKoS1SnLCKXw4fGA57Ph88hdFmgaZ',
            asset: [Object],
            name: 'Bitcoin network'
        },
        fee: {
            name: 'Bitcoin',
            size: '0.00100000',
            symbol: 'BTC'
        },
        size: {
            name: 'Bitcoin',
            size: '0.33767561',
            symbol: 'BTC'
        },
        tx_id: 'a869a9ac1f6570e1b4c42aa2f1f154b9aa1a58d300b3750a3f562fcb76e56938',
        time: '2018-02-16T16:44:32.570Z',
        details: {
            subtitle: 'To Bitcoin address',
            title: 'Sent Bitcoin'
        }
    },
    {
        transaction_type: 'sell',
        connectable: {
            id: 'fab30ce0-2edd-4352-8a26-15f7e358bbec',
            name: 'Bittrex',
            type: 'Exchange'
        },
        base: {
            name: 'Lisk',
            size: '-108.76818800',
            symbol: 'LSK'
        },
        quote: {
            name: 'Bitcoin',
            size: '0.33952207',
            symbol: 'BTC'
        },
        fee: {
            name: 'Bitcoin',
            size: '0.00084880',
            symbol: 'BTC'
        },
        size: {
            name: 'Lisk',
            size: '-108.76818800',
            symbol: 'LSK'
        },
        tx_id: null,
        time: '2018-02-16T16:43:42.710Z',
        details: {
            subtitle: 'Using Bittrex Bitcoin account',
            title: 'Sell Lisk'
        }
    },
    {
        transaction_type: 'exchange_withdrawal',
        connectable: {
            id: 'a9a4d776-a2d6-4258-890a-73a18388186a',
            name: 'Coinbase',
            type: 'Exchange'
        },
        to: {
            address: '12DeYENYYxRAYbQ5RumJ9t2MEuig9TV6Rp',
            asset: [Object],
            name: 'Bitcoin network'
        },
        size: {
            name: 'Bitcoin',
            size: '-0.50000000',
            symbol: 'BTC'
        },
        tx_id: '0ee21acf02ea680ca3a39a6d4b7c9f4b03bdcc4da74dc7fcb56fe58d2ff4e967',
        time: '2018-02-06T05:31:26.000Z',
        details: {
            subtitle: 'To Bitcoin address',
            title: 'Sent Bitcoin'
        }
    },
    {
        transaction_type: 'exchange_deposit',
        connectable: {
            id: 'a9a4d776-a2d6-4258-890a-73a18388186a',
            name: 'Coinbase',
            type: 'Exchange'
        },
        to: {
            address: null,
            asset: [Object],
            name: 'GDAX'
        },
        size: {
            name: 'Bitcoin',
            size: '0.50000000',
            symbol: 'BTC'
        },
        tx_id: null,
        time: '2018-02-06T05:31:25.000Z',
        details: {
            subtitle: 'From GDAX',
            title: 'Transferred Bitcoin'
        }
    }, …
]
```

## Get user balance

Returns all asset balances from connected exchanges and addresses. Replace main() function with below.

```typescript
async function main() {
    const balances = await userClient.getUserBalances(process.env.USER_ID);
}
```

### Expected response

```js
[
    {
        asset: {
            id: '0b40e35b-a374-4bba-9734-aabfcfb380fc',
            name: 'Bitcoin',
            size: '0.00000000',
            symbol: 'BTC'
        },
        connectable: {
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
            name: 'Binance',
            type: 'Exchange'
        },
        name: 'BTC'
    },
    {
        asset: {
            id: '8b0f7276-efbc-47de-b97a-d6e3136e5570',
            name: 'Litecoin',
            size: '0.00000000',
            symbol: 'LTC'
        },
        connectable: {
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
            name: 'Binance',
            type: 'Exchange'
        },
        name: 'LTC'
    },
    {
        asset: {
            id: 'f35d200b-adeb-4b5f-9b9a-e98ba511202c',
            name: 'Ethereum',
            size: '0.00500000',
            symbol: 'ETH'
        },
        connectable: {
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
            name: 'Binance',
            type: 'Exchange'
        },
        name: 'ETH'
    },
    {
        asset: {
            id: 'cfb9ff4f-4f54-4378-a821-a8c5361eeba2',
            name: null,
            size: '0.00000000',
            symbol: 'BNC'
        },
        connectable: {
            id: '61cc39db-2803-4550-9f1c-dbde1d09b210',
            name: 'Binance',
            type: 'Exchange'
        },
        name: 'BNC'
    }, ...
]
```

## Disconnect connected exchanges

To disconnect a user’s connected exchange. Replace main() function with below.

```typescript
async function main() {
    const connectedExchanges = await userClient.getUserConnectedExchanges(process.env.USER_ID);

    for (const connectedExchange of connectedExchanges.connected_exchanges) {
        const deleted = await userClient.disconnectExchange(connectedExchange.id);
        console.log("deleted", deleted);
    }
}
```

### Expected response

```js
{
    exchange: {
        id: 'f458bf39-c68d-453a-9275-7b103a5c1556',
        name: 'Bittrex'
    },
    id: 'bbc388ac-81b0-4acd-aa6a-d79e0644af17'
}
```

## Get all assets

Now let's connect a blockchain wallet address. First let's see what assets are available for us to connect. Replace function main() with below.

```typescript
async function main() {
    const assets = await userClient.getAllAssets();
}
```

Expected response:

``` js
{
    "assets": [
        {
            "id": "159189c3-2f6c-4e98-9784-6c8fbf36c163",
            "name": "Bitcoin",
            "symbol": "BTC"
        },
        {
            "id": "ca015b25-55e0-482e-8e75-2761146736f2",
            "name": "Ethereum",
            "symbol": "ETH"
        },
        {
            "id": "bdf61b56-de76-4c80-90bd-061e80194664",
            "name": "Ripple",
            "symbol": "XRP"
        },
        {
            "id": "10761d31-97f0-4f87-ba36-54043ee84bfa",
            "name": "Bitcoin Cash",
            "symbol": "BCH"
        },
        {
            "id": "f27a1f9d-ccc9-4b7f-90d9-9aab56a02cff",
            "name": "Cardano",
            "symbol": "ADA"
        }
        ...
    ]
}
```

## Connect address

Connected addresses are created when a user provides their blockchain address where funds are stored (ie: bitcoin or ether). A newly created user should have no connected addresses. For this example we will be connecting a user’s Bitcoin address.

### Provide Coinbase credentials

To do this, we need to get the user’s bitcoin address and store it in the `.env` file.

```
BITCOIN_ADDRESS=19bpEWN7zHBLonBiQjRc92mSKocmAcx4y2
```

### Select Bitcoin and connect address

To do this, we get all assets, select Bitcoin from the returned list, and create a `ConnectedAddressRequestBody` with the credentials in the `.env` file. Replace function main() in the demo file with this new function main().

```typescript
async function main() {
    const assets = await userClient.getAllAssets();
    const currentAsset = assets.assets.filter((e) => {
        return e.name === "Bitcoin";
    })[0];

    const body: ConnectedAddressRequestBody = {
        asset_id: currentAsset.id,
        address: process.env.BITCOIN_ADDRESS,
        user_id:process.env.USER_ID
    };

    await userClient.connectAddress(body);
}
```

## Get connected addresses

To see the connected addresses associated with a user, Replace main() function with below.

``` typescript
async function main() {
    const connectedAddresses = await userClient.getUserConnectedAddresses(process.env.USER_ID);
}
```
### Expected response

```js
{
    "connected_addresses": [
        {
            "address": {
                "address": "19bpEWN7zHBLonBiQjRc92mSKocmAcx4y2",
                "asset": {
                    "id": "159189c3-2f6c-4e98-9784-6c8fbf36c163",
                    "name": "Bitcoin",
                    "symbol": "BTC"
                }
            },
            "id": "bf3ad218-9775-4949-892d-ebb8e4f1b7cc"
        }
    ]
}
```

## Get connected address ledger

Now let's look at the ledger for the user’s bitcoin address we have connected. Replace main() function with below.

``` typescript
async function main() {
    const assets = await userClient.getAllAssets();
    const connectedAddresses = await userClient.getUserConnectedAddresses(process.env.USER_ID);
    const bitcoin = connectedAddresses.connected_addresses[0];
    const ledger = await userClient.getConnectedAddressLedger(bitcoin.id);
}
```

The ledger will return a list of all deposits and withdrawals from connected address.

### Expected response

```js
[
    {
        "transaction_type": "address_deposit",
        "connectable": {
            "id": "fd36c28f-f9d4-421d-9339-1062cca358cd",
            "name": "Bitcoin",
            "type": "Address"
        },
        "inputs": [
            {
                "address": "19bpEWN7zHBLonBiQjRc92mSKocmAcx4y2",
                "size": "0.28553130"
            }
        ],
        "size": {
            "name": "Bitcoin",
            "size": "0.00000224",
            "symbol": "BTC"
        },
        "outputs": [
            {
                "address": "38nCVfkwyKLXMz4F312dezip787nshNvxd",
                "size": "0.20000000"
            },
            {
                "address": "1j5a6wvGRwrghB6vxLZo8LTrAampVMwvx",
                "size": "0.08422129"
            }
        ],
        "fee": {
            "name": "Bitcoin",
            "size": "0.00131001",
            "symbol": "BTC"
        },
        "tx_id": "49f03ed024cd2afdeaca76c56ee85251f7e9787012e6ce4caff42161e020a803",
        "time": "2018-01-05T08:09:15.000Z",
        "details": {
            "subtitle": "To 2 Outputs",
            "title": "Sent Bitcoin"
        }
    }
]
```

## Get connected address balance

Now we will look at the balances for our connected addresses. In this case our bitcoin balance. Replace main() function with below.

```typescript
async function main() {
    const connectedAddresses = await userClient.getUserConnectedAddresses(process.env.USER_ID);
    const bitcoin = connectedAddresses.connected_addresses[0];
    const balances = await userClient.getConnectedAddressBalances(bitcoin.id);
    console.log(balances);
}
```

Balances will return a list of balances by each asset (BTC, ETH, etc.) from all connected addresses.

### Expected response

```js
[
    {
        "asset": {
            "id": "159189c3-2f6c-4e98-9784-6c8fbf36c163",
            "name": "Bitcoin",
            "size": "0.00000000",
            "symbol": "BTC"
        },
        "connectable": {
            "id": "fd36c28f-f9d4-421d-9339-1062cca358cd",
            "name": "Bitcoin",
            "type": "Address"
        },
        "name": "Bitcoin address"
    }
]
```

## Disconnect connected addresses

To disconnect a user’s connected address. Replace main() function with below.

```typescript
async function main() {
    const connectedAddresses = await userClient.getUserConnectedAddresses(process.env.USER_ID);

    for (const connectedAddress of connectedAddresses.connected_addresses) {
        const deleted = await userClient.disconnectAddress(connectedAddress.id);
        console.log("deleted", deleted);
    }
}
```

### Expected response

```js
{
    "address": {
        "address": "19bpEWN7zHBLonBiQjRc92mSKocmAcx4y2",
        "asset": {
            "id": "159189c3-2f6c-4e98-9784-6c8fbf36c163",
            "name": "Bitcoin",
            "symbol": "BTC"
        }
    },
    "id": "fd36c28f-f9d4-421d-9339-1062cca358cd"
}
```

## Next steps

And that concludes this getting started guide for Bitbutter’s API using the Node.js client library! Now that we’ve covered the basics, you can find the complete API documentation at [https://docs.bitbutter.com/](https://docs.bitbutter.com/).

If you have questions, feel free to reach out to us at [support@bitbutter.com](support@bitbutter.com).
