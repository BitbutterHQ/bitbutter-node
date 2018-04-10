import dotenv = require("dotenv");
dotenv.config();

import Bitbutter from "./index";
import {
    ConnectedAddressRequestBody,
    ConnectedExchangeRequestBody,
} from "./types";

// user client to make requests to user protected routes
const userClient = new Bitbutter({
    apiKey: process.env.USER_API_KEY,
    endpoint: process.env.ENDPOINT,
    secret: process.env.USER_SECRET,
    userId: process.env.USER_ID,
});

// partner client to make requests to user protected routes
// const partnerClient = new Bitbutter({
//     apiKey: process.env.PARTNER_API_KEY,
//     endpoint: process.env.ENDPOINT,
//     partnerId: process.env.PARTNER_ID,
//     partnershipId: process.env.PARTNERSHIP_ID,
//     secret: process.env.PARTNER_SECRET,
// });

// replace function main() with the ones in the README directions
async function main() {
    const ledger = await userClient.getConnectedExchangeLedger(process.env.CONNECTED_EXCHANGE_ID, {
        after: +new Date("2018-02-01T13:32:54.000Z"),
        before: +new Date("2018-03-01T13:32:54.000Z"),
        limit: 3,
        order: "asc",
        page: 1,
    });

    console.log(ledger);
}

main();
