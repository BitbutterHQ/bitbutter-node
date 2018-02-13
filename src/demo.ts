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
    // const users = await bitbutter.getAllUsers();
    // console.log(users);
}

main();
