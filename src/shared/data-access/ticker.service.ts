import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of, tap } from 'rxjs';
import { bitcoin, bitcoinPrices, listOfCoins } from '../data';

@Injectable({
    providedIn: 'root',
})
export class TickerService {
    http = inject(HttpClient);
    baseUrl = 'https://api.coingecko.com/api/v3/coins';
    headers = { 'x-cg-demo-api-key': environment.coinGeckoApiKey };

    #coinDataMap: Map<string, any> = new Map();

    getCoinDataById(id: string) {
        // const url = `${this.baseUrl}/${id}?tickers=true&market_data=true&localization=true`;

        // return this.http.get<any>(url, { headers });
        return of(bitcoin);
    }

    getCoinListDataByIds(ids: string[]) {
        // const url = `${this.baseUrl}/markets?vs_currency=usd&ids=${ids}`;
        // return this.http.get<any>(url, { headers: this.headers });
        return of(listOfCoins).pipe(
            tap((coins) => {
                coins.forEach((coin) => {
                    this.#coinDataMap.set(coin.id, coin);
                });
            }),
        );
    }

    //1 day = 5 minute data
    //2 - 90 days = hourly data
    // >90 = daily data
    getCoinMarketDataById(id: string, interval: number) {
        const url = `${this.baseUrl}/${id}/market_chart?vs_currency=usd&days=${interval}&precision=0`;
        return this.http.get<any>(url, { headers: this.headers });
        // return of(bitcoinPrices);
    }

    getCoinDataFromMap(id: string) {
        return this.#coinDataMap.get(id);
    }
}
