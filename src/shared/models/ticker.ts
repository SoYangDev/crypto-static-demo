export interface Ticker {
    id: number;
    symbol: string;
    price: number;
    change: number;
    data: {date: Date; value: number}[];
  }