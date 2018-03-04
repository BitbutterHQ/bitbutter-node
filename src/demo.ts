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

const userClient = new Bitbutter({
    apiKey: process.env.USER_API_KEY,
    endpoint: process.env.ENDPOINT,
    secret: process.env.USER_SECRET,
    userId: process.env.USER_ID,
});
// const partnerClient = new Bitbutter({
//     apiKey: process.env.PARTNER_API_KEY,
//     endpoint: process.env.ENDPOINT,
//     partnerId: process.env.PARTNER_ID,
//     partnershipId: process.env.PARTNERSHIP_ID,
//     secret: process.env.PARTNER_SECRET,
// });
async function main() {

    // const newUser = await publicClient.createUser();
    // console.log("new USER", newUser);
    // const users = await publicClient.getAllUsers();
    // console.log(users);
    // const balances = await userClient.getUserBalances(process.env.USER_ID);
    // console.log(balances);
    // const ledger = await userClient.getUserLedger(process.env.USER_ID);
    // console.log(ledger);

    // const exchanges = await userClient.getAllExchanges();
    // const currentExchange = exchanges.exchanges.filter((e) => {
    //     return e.name === "Coinbase";
    // })[0];
    //
    console.log("exchanges", exchanges);
    console.log("currentExchange", currentExchange);

    const body: ConnectedExchangeRequestBody = {
        credentials: {
            api_key: process.env.COINBASE1_API_KEY,
            secret: process.env.COINBASE1_SECRET,
        },
        exchange_id: currentExchange.id,
        user_id: process.env.USER_ID,
    };
    //
    await userClient.connectExchange(body);
    //
    const connectedExchanges = await userClient.getUserConnectedExchanges(process.env.USER_ID);
    console.log("connected exchanges", connectedExchanges);

    //LEDGER
    const exchanges = await userClient.getAllExchanges();
    const connectedExchanges = await userClient.getUserConnectedExchanges(process.env.USER_ID);
    const coinbase = connectedExchanges.connected_exchanges[3];
    const ledger = await userClient.getConnectedExchangeLedger(coinbase.id);
    console.log(ledger);

    // const ledger = await userClient.getUserLedger(process.env.USER_ID);
    // console.log(ledger);

    // const balances = await userClient.getUserBalances(process.env.USER3_ID);
    // console.log(balances);
}

main();
