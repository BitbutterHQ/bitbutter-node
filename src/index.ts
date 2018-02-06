import * as crypto from "crypto";
import * as WebRequest from "web-request";

import { RequestHeaders, RequestOptions } from "./types";

export default class Bitbutter {
    public partnershipId = "";
    public partnerId = "";
    public apiKey = "";
    public secret = "";
    public apiUrl = "";
    private version = "1";

    constructor(partnershipId, partnerId, apiKey, secret, apiUrl = "https://api.bitbutter.com") {
        this.partnershipId = partnershipId;
        this.partnerId = partnerId;
        this.apiKey = apiKey;
        this.secret = secret;
        this.apiUrl = apiUrl;
    }

    public async getAllUsers() {
        return await this.getRequest(`partnerships/${this.partnershipId}/users`);
    }

    public async createUser() {
        return await this.postRequest("users", null);
    }

    public async deleteUser(userId) {
        return await this.deleteRequest(`users/${userId}`);
    }

    public async getAllExchanges() {
        return await this.getRequest(`exchanges`);
    }

    public async getAllAssets() {
        return await this.getRequest(`assets`);
    }

    public async connectExchange(userId, exchangeId) {
        const body = { exchange_id: exchangeId };
        return await this.postRequest(`users/${userId}/connected-exchanges`, body);
    }

    public async connectAddress(userId, assetId, address) {
        const body = {
            address,
            asset_id: assetId,
        };

        return await this.postRequest(`users/${userId}/connected-addresses`, body);
    }

    public async disconnectExchange(connectedExchangeId) {
        return await this.deleteRequest(`connected-exchanges/${connectedExchangeId}`);
    }

    public async disconnectAddress(connectedAddressId) {
        return await this.deleteRequest(`/connected-addresses/${connectedAddressId}`);
    }

    public async getUserLedger(userId) {
        return await this.getRequest(`users/${userId}/ledger`);
    }

    public async getUserBalances(userId) {
        return await this.getRequest(`users/${userId}/balances`);
    }

    public async getUserConnectedExchanges(userId) {
        return await this.getRequest(`users/${userId}/connected-exchanges`);
    }

    public async getUserConnectedAddresses(userId) {
        return await this.getRequest(`users/${userId}/connected-addresses`);
    }

    public async getUserConnectedExchangesBalance(userId) {
        return await this.getRequest(`users/${userId}/connected-exchanges/balances`);
    }

    public async getUserConnectedAddressesBalance(userId) {
        return await this.getRequest(`users/${userId}/connected-addresses/balances`);
    }

    public async getConnectedExchangeBalance(connectedExchangeId) {
        return await this.getRequest(`connected-exchanges/${connectedExchangeId}/balances`);
    }

    public async getConnectedAddressBalance(connectedAddressId) {
        return await this.getRequest(`connected-addresses/${connectedAddressId}/balances`);
    }

    public async getUserConnectedExchangesLedger(userId) {
        return await this.getRequest(`users/${userId}/connected-exchanges/ledger`);
    }

    public async getUserConnectedAddressesLedger(userId) {
        return await this.getRequest(`users/${userId}/connected-addresses/ledger`);
    }

    public async getConnectedAddressLedger(connectedAddressId) {
        return await this.getRequest(`connected-addresses/${connectedAddressId}/ledger`);
    }

    public async getConnectedExchangeLedger(connectedExchangeId) {
        return await this.getRequest(`connected-exchanges/${connectedExchangeId}/ledger`);
    }

    private generateSignature(options: RequestOptions): string {
        const method = options.method;
        const requestPath = options.requestPath;
        const body = options.body;
        const timestamp = options.timestamp;

        const prehash = timestamp + method + requestPath + body;
        const key = new Buffer(this.secret, "base64");
        const hmac = crypto.createHmac("sha256", key);
        const signature = hmac.update(prehash).digest("base64");

        return signature;
    }

    private generateHeaders(method, requestPath, body): RequestHeaders {
        const timestamp = Date.now() / 1000;

        const signature = this.generateSignature({
            body,
            method,
            requestPath,
            timestamp,
        });

        return {
            "BB-ACCESS-KEY": this.apiKey,
            "BB-PARTNER-ID": this.partnerId,
            "BB-SIGNATURE": signature,
            "BB-TIMESTAMP": timestamp,
        };
    }

    private generateRequestPath(path): string {
        return `${this.apiUrl}/v${this.version}/${path}`;
    }

    private async generateRequest(name, path, body): Promise<WebRequest.Response<string>> {
        const requestPath = this.generateRequestPath(path);
        const headers = this.generateHeaders(name, requestPath, body);
        let response;

        switch (name) {
            case "GET":
                response = await WebRequest.get(`${requestPath}`, { headers });
                break;
            case "POST":
                response = await WebRequest.post(`${requestPath}`, { headers }, body);
                break;
            case "DELETE":
                response = await WebRequest.delete(`${requestPath}`, { headers });
                break;
            default:
                throw new Error("Invalid name");
        }

        return response;
    }

    private async getRequest(path) {
        return await this.generateRequest("GET", path, {});
    }

    private async postRequest(path, body = {}) {
        return await this.generateRequest("POST", path, body);
    }

    private async deleteRequest(path) {
        return await this.generateRequest("DELETE", path, {});
    }
}
