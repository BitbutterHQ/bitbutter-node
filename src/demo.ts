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

// const userClient = new Bitbutter({
//     apiKey: process.env.USER1_API_KEY,
//     endpoint: process.env.ENDPOINT,
//     secret: process.env.USER1_SECRET,
//     userId: process.env.USER1_ID,
// });

// const partnerClient = new Bitbutter({
//     apiKey: process.env.PARTNER_API_KEY,
//     endpoint: process.env.ENDPOINT,
//     partnerId: process.env.PARTNER_ID,
//     partnershipId: process.env.PARTNERSHIP_ID,
//     secret: process.env.PARTNER_SECRET,
// });

async function main() {
    const newUser = await publicClient.createUser();
    console.log(newUser);

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
}

main();
