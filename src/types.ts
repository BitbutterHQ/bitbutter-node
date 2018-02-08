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
}
