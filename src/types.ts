export interface RequestOptions {
    timestamp: number;
    method: string;
    requestPath: string;
    body: string;
}

export interface RequestHeaders {
    "BB-ACCESS-KEY": string;
    "BB-PARTNER-ID": string;
    "BB-SIGNATURE": string;
    "BB-TIMESTAMP": number;
}
