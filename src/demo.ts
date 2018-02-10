import dotenv = require("dotenv");
dotenv.config();

import Bitbutter from "./index";
import {
    ConnectedAddressRequestBody,
    ConnectedExchangeRequestBody,
} from "./types";

const bitbutter = new Bitbutter({
    apiKey: process.env.BB_API_KEY,
    partnerId: process.env.BB_PARTNER_ID,
    partnershipId: process.env.BB_PARTNERSHIP_ID,
    secret: process.env.BB_SECRET,
});

function prettyPrint(label, obj) {
    console.log(label, JSON.stringify(obj, null, 4));
}

async function main() {
    // const exchanges = await bitbutter.getAllExchanges();
}

main();
