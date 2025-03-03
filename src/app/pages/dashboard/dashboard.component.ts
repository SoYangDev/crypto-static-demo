import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { delay, map, Observable, shareReplay } from 'rxjs';
import { CardGridComponent } from '../../../shared/components/base/card-grid/card-grid.component';
import { TickerCardComponent } from '../../../shared/components/base/ticker-card/ticker-card.component';
import { TickerService } from '../../../shared/data-access/ticker.service';
import { TickerCard } from '../../../shared/components/base/ticker-card/ticker-card';
import { MatDialog } from '@angular/material/dialog';
import { InputDialogComponent } from './components/input-dialog/input-dialog.component';
import { UserService } from '../../../shared/data-access/user.service';
import { TransactionListComponent } from '../../../shared/components/core/transaction/transaction-list.component';
import { TransactionList } from '../../../shared/components/core/transaction/transaction';
import { SectionHeaderComponent } from '../../../shared/components/base/section-title/section-title.component';
import { NotificationHubComponent } from '../../../shared/components/core/notification-hub/notification-hub.component';
import { transactions, notifications } from '../../../shared/data';
import { NotificationService } from '../../../shared/data-access/notification.service';

@Component({
    selector: 'dashboard',
    imports: [
        AsyncPipe,
        CardGridComponent,
        NotificationHubComponent,
        SectionHeaderComponent,
        TickerCardComponent,
        TransactionListComponent,
    ],
    providers: [CurrencyPipe],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    tickerSvc = inject(TickerService);
    router = inject(Router);
    dialog = inject(MatDialog);
    userSvc = inject(UserService);
    notificationSvc = inject(NotificationService);
    transactions: TransactionList = transactions;

    coinListIds = ['bitcoin', 'ethereum'];

    coins$: Observable<TickerCard[]> = this.tickerSvc
        .getCoinListDataByIds(this.coinListIds)
        .pipe(
            delay(1000),
            map((coins) =>
                coins.map((coin) => ({
                    id: coin.id,
                    symbol: coin.symbol,
                    price: coin.current_price,
                    change: coin.price_change_percentage_24h,
                    volume: coin.total_volume,
                })),
            ),
            shareReplay(1),
        );

    notifications = this.notificationSvc.notifications();

    ngOnInit() {
        if (!this.userSvc.name()) {
            this.dialog.open(InputDialogComponent, {
                width: '500px',
                height: '350px',
            });
        }
    }

    getRange(n: number): number[] {
        return Array.from({ length: n }, (_, i) => i + 1);
    }

    goToMarketDataPage(id: string | undefined) {
        if (id) {
            this.router.navigate(['/market-data', id]);
        }
    }
}
