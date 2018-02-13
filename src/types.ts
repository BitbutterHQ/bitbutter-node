export interface RequestOptions {
    timestamp: number;
    method: string;
    requestPath: string;
    body: string;
}

export interface RequestHeaders {
    "BB-ACCESS-KEY": string;
    "BB-PARTNER-ID": string;
    "BB-ACCESS-SIGN": string;
    "BB-TIMESTAMP": number;
}

export interface InitialConfig {
    apiKey: string;
    partnerId: string;
    partnershipId: string;
    secret: string;
    endpoint: string;
}

export interface ConnectedExchangeRequestBody {
    credentials: Credential;
    exchange_id: string;
    user_id: string;
}

export interface Credential {
    api_key: string;
    password?: string;
    secret: string;
}

export interface ConnectedAddressRequestBody {
    asset_id: string;
    address: string;
    user_id: string;
}
