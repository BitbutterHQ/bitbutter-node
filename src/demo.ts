import dotenv = require("dotenv");
dotenv.config();

import Bitbutter from "./index";

const bitbutter = new Bitbutter({
    apiKey: process.env.BB_API_KEY,
    partnerId: process.env.BB_PARTNER_ID,
    partnershipId: process.env.BB_PARTNERSHIP_ID,
    secret: process.env.BB_SECRET,
});

async function getAllUsers() {
    return await bitbutter.getAllUsers();
}

async function main() {
    const users = await getAllUsers();
    console.log("users", users);
}

main();
