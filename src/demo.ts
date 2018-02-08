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

async function createUser() {
    return await bitbutter.createUser();
}

async function deleteUser(userId) {
    return await bitbutter.deleteUser(userId);
}

async function main() {
    console.log("\n\n\n");
    const users = await getAllUsers();
    console.log("initial users", users);

    console.log("\n\n\n");
    const user = await createUser();
    console.log("created user", user);

    console.log("\n\n\n");
    const afterUsers = await getAllUsers();
    console.log("after users", afterUsers);

    console.log("\n\n\n");
    console.log(user);
    await deleteUser(user.user.id);

    console.log("\n\n\n");
    const afterAfterUsers = await getAllUsers();
    console.log("after after users", afterAfterUsers);
}

main();
