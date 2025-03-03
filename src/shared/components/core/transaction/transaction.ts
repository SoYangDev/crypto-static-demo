export type TransactionList = TransactionItem[];

export interface TransactionItem {
    orderId: string;
    tokenId: string;
    image: string;
    amount: number;
    date: Date;
    details: TransactionDetail;
}

export interface TransactionDetail {
    orderId: string;
    side: 'Buy' | 'Sell';
    timePlaced: string;
    type: 'Market' | 'Limit';
    price: number;
    amount: number;
    fee: number;
    total: number;
    [key: string]: string | number | null | undefined;
}
