import { Component, inject, signal } from '@angular/core';
import { TickerService } from '../../../shared/data-access/ticker.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LineChartComponent } from '../../../shared/components/base/line-chart/line-chart.component';
import { WordPipe } from '../../../shared/pipes/word.pipe';
import { BackButtonComponent } from '../../../shared/components/base/back-button/back-button.component';
import { SectionHeaderComponent } from '../../../shared/components/base/section-title/section-title.component';

enum MarketDataInterval {
    FIVE_MIN = 1,
    HOURLY = 90,
    DAILY = 91,
}

@Component({
    standalone: true,
    selector: 'market-data',
    styleUrl: './market-data.component.css',
    imports: [
        CommonModule,
        BackButtonComponent,
        LineChartComponent,
        MatButtonModule,
        SectionHeaderComponent,
        WordPipe,
    ],
    template: `
        @if (coinData) {
            <section class="market-data__header">
                <div class="market-data__header-left">
                    <img
                        class="market-data__header-logo"
                        [src]="coinData.image"
                    />
                    <section-header>
                        {{ coinData.id | uppercase }} - USD
                    </section-header>
                </div>
                <back-button />
            </section>
            <div class="market-data__description">
                @for (prop of infoToDisplay; track prop) {
                    <p class="primary">{{ prop | word }}</p>
                    <p class="primary">{{ coinData[prop] | currency }}</p>
                }
            </div>

            <div class="market-data__chart">
                @if (data$ | async; as data) {
                    <line-chart [data]="data.prices" />
                }
            </div>
        }
    `,
})
export class MarketDataComponent {
    tickerSvc = inject(TickerService);
    route = inject(ActivatedRoute);
    router = inject(Router);

    coinData: any;
    data$!: Observable<any>;

    infoToDisplay = ['current_price', 'circulating_supply', 'market_cap'];

    ngOnInit() {
        const id = (this.route.params as BehaviorSubject<any>).value['id'];
        this.coinData = this.tickerSvc.getCoinDataFromMap(id);
        if (!this.coinData) {
            this.goBack();
        } else {
            this.data$ = this.tickerSvc
                .getCoinMarketDataById(id, MarketDataInterval.DAILY)
                .pipe(
                    map((data: { prices: number[][] }) => ({
                        ...data,
                        prices: data.prices.map((p) => ({
                            date: new Date(p[0]),
                            value: p[1],
                        })),
                    })),
                );
        }
    }

    goBack() {
        this.router.navigate(['/']);
    }
}
