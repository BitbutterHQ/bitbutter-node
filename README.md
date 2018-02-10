# Bitbutter

The official Node.js library for the Bitbutter API.

```
const users = await bitbutter.getAllUsers();
const exchanges = await bitbutter.getAllExchanges();
```

## Connect Exchange

```
const currentExchange = exchanges.exchanges.filter((e) => {
    return e.name === "Coinbase";
})[0];
let currentUser;

if (users.users.length > 0) {
    currentUser = users.users[0];
} else {
    currentUser = await bitbutter.createUser();
}

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

## Connect Address

```
const assets = await bitbutter.getAllAssets();
const bitcoin = assets.assets.filter((asset) => {
    return asset.symbol === "BTC";
})[0];
const address = process.env.BITCOIN_ADDRESS;

const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];

const body: ConnectedAddressRequestBody = {
    address,
    asset_id: bitcoin.id,
    user_id: currentUser.id,
};

await bitbutter.connectAddress(body);
```

## Connected Exchanges

```
const connectedExchanges = await bitbutter.getUserConnectedExchanges(user.id);
```


## Connected Addresses

```
const connectedAddresses = await bitbutter.getUserConnectedAddresses(user.id);
```

## Disconnect Connected Addresses

```
const connectedAddresses = await bitbutter.getUserConnectedAddresses(user.id);

for (const connectedAddress of connectedAddresses.connected_addresses) {
    const deleted = await bitbutter.disconnectAddress(connectedAddress.id);
    prettyPrint("deleted", deleted);
}
```

## Get connected address ledger

```
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];
const connectedAddresses = await bitbutter.getUserConnectedAddresses(currentUser.id);
const bitcoin = connectedAddresses.connected_addresses[0];
const ledger = await bitbutter.getConnectedAddressLedger(bitcoin.id);
```

## Get connected exchange ledger

```
const exchanges = await bitbutter.getAllExchanges();
const users = await bitbutter.getAllUsers();
const currentUser = users.users[0];
const connectedExchanges = await bitbutter.getUserConnectedExchanges(currentUser.id);
const coinbase = connectedExchanges.connected_exchanges[0];
const ledger = await bitbutter.getConnectedExchangeLedger(coinbase.id);
prettyPrint("ledger", ledger);
```
