import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    output,
} from '@angular/core';
import { TickerCard } from './ticker-card';
import { CommonModule } from '@angular/common';
import { StaticLineChartComponent } from '../static-line-chart/static-line-chart.component';

@Component({
    standalone: true,
    selector: 'ticker-card',
    imports: [CommonModule, StaticLineChartComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './ticker-card.scss',
    template: ` <div class="card-bg" (click)="onClick.emit(ticker()?.id)">
        <div class="card-container">
            <div
                class="card-content"
                [ngClass]="{ 'ticker-loading': !ticker() }"
            >
                <!-- Ideally I would just make ticker input required and create a separate skeleton card component to keep things simple -->
                @if (ticker()) {
                    <div class="symbol">{{ symbol() | uppercase }}</div>
                    <div class="price">
                        &dollar;{{ price() | number: '1.2-2' }}
                    </div>
                    <div class="card-price-trend-container">
                        <static-line-chart
                            [trend]="change() > 0 ? 'positive' : 'negative'"
                        />
                        <!-- <static-line-chart trend="positive" /> -->
                    </div>
                    <div class="details">
                        <div class="volume">
                            Volume: &dollar;{{ volume() | number: '1.0-0' }}
                        </div>
                        <div
                            class="change"
                            [ngClass]="{
                                positive: change() > 0,
                                negative: change() < 0,
                            }"
                        >
                            Change: {{ change() > 0 ? '+' : ''
                            }}{{ change() | number: '1.2-2' }}%
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>`,
})
export class TickerCardComponent {
    ticker = input<TickerCard>();
    onClick = output<string | undefined>();

    symbol = computed(() => this.ticker()?.symbol);
    price = computed(() => this.ticker()?.price);
    volume = computed(() => this.ticker()?.volume);
    change = computed(() => this.ticker()?.change!);
}
