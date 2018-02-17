import dotenv = require("dotenv");
dotenv.config();

import Bitbutter from "./index";
import {
    ConnectedAddressRequestBody,
    ConnectedExchangeRequestBody,
} from "./types";

const bitbutter = new Bitbutter({
    apiKey: process.env.PARTNER_API_KEY,
    endpoint: process.env.ENDPOINT,
    partnerId: process.env.PARTNER_ID,
    partnershipId: process.env.PARTNERSHIP_ID,
    secret: process.env.PARTNER_SECRET,
});

const client = new Bitbutter({
    apiKey: process.env.USER1_API_KEY,
    endpoint: process.env.ENDPOINT,
    secret: process.env.USER1_SECRET,
});

async function main() {
    const users = await bitbutter.getAllUsers();

    console.log(users);

    // const currentExchange = exchanges.exchanges.filter((e) => {
    //     return e.name === "Binance";
    // })[0];

    // const body: ConnectedExchangeRequestBody = {
    //     credentials: {
    //         api_key: process.env.BINANCE_API_KEY,
    //         secret: process.env.BINANCE_SECRET,
    //     },
    //     exchange_id: currentExchange.id,
    //     user_id: process.env.USER1_ID,
    // };

    // await client.connectExchange(body);

    // const ledger = await client.getUserLedger(process.env.USER1_ID);
    // console.log(JSON.stringify(ledger, null, 4));

    // const balances = await client.getUserBalances(process.env.USER1_ID);
    // console.log(JSON.stringify(balances, null, 4));

    // const connectedExchanges = await bitbutter.getUserConnectedExchanges(process.env.USER1_ID);

    // for (const connectedExchange of connectedExchanges.connected_exchanges) {
    //     const deleted = await bitbutter.disconnectExchange(connectedExchange.id);
    //     console.log("deleted", deleted);
    // }
}

main();
