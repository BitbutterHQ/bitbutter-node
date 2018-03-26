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
    const trades = await userClient.getConnectedExchangeTransfers(process.env.CONNECTED_EXCHANGE_ID);
    console.log(trades);
}

main();
