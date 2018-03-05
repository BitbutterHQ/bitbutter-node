import * as crypto from "crypto";
import * as WebRequest from "web-request";

import {
    ConnectedAddressRequestBody,
    ConnectedExchangeRequestBody,
    InitialConfig,
    RequestHeaders,
    RequestOptions,
} from "./types";

export default class Bitbutter {
    public partnershipId = "";
    public partnerId = "";
    public userId = "";
    public apiKey = "";
    public secret = "";
    public endpoint = "";
    private version = "1";

    constructor(config: InitialConfig) {
        this.partnershipId = config.partnershipId || "";
        this.partnerId = config.partnerId || "";
        this.userId = config.userId || "";
        this.apiKey = config.apiKey || "";
        this.secret = config.secret || "";
        this.endpoint = config.endpoint || "";
    }

    public async getAllUsers() {
        return await this.getRequest(`partnerships/${this.partnershipId}/users`);
    }

    public async createUser() {
        const firstUser = await this.postRequest(`partnerships/${this.partnershipId}/users`);
        return firstUser;
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

    public async connectExchange(body: ConnectedExchangeRequestBody) {
        return await this.postRequest(`connected-exchanges`, body);
    }

    public async connectAddress(body: ConnectedAddressRequestBody) {
        return await this.postRequest(`connected-addresses`, body);
    }

    public async getUserConnectedExchanges(userId) {
        return await this.getRequest(`users/${userId}/connected-exchanges`);
    }

    public async getUserConnectedAddresses(userId) {
        return await this.getRequest(`users/${userId}/connected-addresses`);
    }

    public async disconnectExchange(connectedExchangeId) {
        return await this.deleteRequest(`connected-exchanges/${connectedExchangeId}`);
    }

    public async disconnectAddress(connectedAddressId) {
        return await this.deleteRequest(`connected-addresses/${connectedAddressId}`);
    }

    public async getUserLedger(userId) {
        return await this.getRequest(`users/${userId}/ledger`);
    }

    public async getUserBalances(userId) {
        return await this.getRequest(`users/${userId}/balances`);
    }

    public async getJobs() {
        return await this.getRequest(`jobs`);
    }

    public async getUserConnectedExchangesBalances(userId) {
        return await this.getRequest(`users/${userId}/connected-exchanges/balances`);
    }

    public async getUserConnectedAddressesBalances(userId) {
        return await this.getRequest(`users/${userId}/connected-addresses/balances`);
    }

    public async getConnectedExchangeBalances(connectedExchangeId) {
        return await this.getRequest(`connected-exchanges/${connectedExchangeId}/balances`);
    }

    public async getConnectedAddressBalances(connectedAddressId) {
        return await this.getRequest(`connected-addresses/${connectedAddressId}/balances`);
    }

    public async getUserConnectedExchangesLedger(userId, connectedExchangeId) {
        return await this.getRequest(`users/${userId}/connected-exchanges/${connectedExchangeId}/ledger`);
    }

    public async getUserConnectedAddressesLedger(userId, connectedAddressId) {
        return await this.getRequest(`users/${userId}/connected-addresses/${connectedAddressId}/ledger`);
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
        const timestamp = +new Date();

        const signature = this.generateSignature({
            body,
            method,
            requestPath,
            timestamp,
        });

        if (this.partnerId !== "") {
            return {
                "BB-ACCESS-KEY": this.apiKey,
                "BB-ACCESS-SIGN": signature,
                "BB-PARTNER-ID": this.partnerId,
                "BB-TIMESTAMP": timestamp,
            };
        } else {
            return {
                "BB-ACCESS-KEY": this.apiKey,
                "BB-ACCESS-SIGN": signature,
                "BB-TIMESTAMP": timestamp,
                "BB-USER-ID": this.userId,
            };
        }
    }

    private generateFullPath(requestPath): string {
        return `${this.endpoint}${requestPath}`;
    }

    private generateRequestPath(path): string {
        return `/v${this.version}/${path}`;
    }

    private async generateRequest(name, path, body) {
        const requestPath = this.generateRequestPath(path);
        const fullPath = this.generateFullPath(requestPath);

        const headers = this.generateHeaders(name, requestPath, body);
        let response;

        const options = {
            headers,
            json: true,
        };

        switch (name) {
            case "GET":
                response = await WebRequest.get(`${fullPath}`, options);
                break;
            case "POST":
                response = await WebRequest.post(`${fullPath}`, options, body);
                break;
            case "DELETE":
                response = await WebRequest.delete(`${fullPath}`, options);
                break;
            default:
                throw new Error("Invalid name");
        }

        return response.content;
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
