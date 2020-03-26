export interface Transaction {
    _id: string;

    customer_id: string;
    merchant_id: string;

    data: {
        merchant_name: string;
        merchant_email: string;
        points: number,
        amount: number,
        offer_id: string;
        offer_title: string
    };

    tx: string;
    receipt: {
        transactionHash: string,
        transactionIndex: number,
        blockHash: string,
        blockNumber: number,
        from: string,
        to: string,
        gasUsed: number,
        cumulativeGasUsed: number,
        contractAddress: string,
        logs: [],
        status: boolean,
        logsBloom: string,
        v: string,
        r: string,
        s: string,
        rawLogs: []
    };
    logs: [];
    type: string;

    createdAt: Date;
}