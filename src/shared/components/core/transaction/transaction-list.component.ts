import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    Renderer2,
    signal,
    viewChild,
    viewChildren,
} from '@angular/core';
import { TransactionItem, TransactionList } from './transaction';
import { TransactionItemComponent } from './transaction-item/transaction-item.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { NgClass } from '@angular/common';

@Component({
    standalone: true,
    selector: 'transaction-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, TransactionItemComponent, TransactionDetailsComponent],
    styles: [
        `
            .transaction-list__container {
                position: relative;
                max-width: 936px;
                overflow: hidden;
                border-top-right-radius: 20px;
                border-bottom-right-radius: 20px;
                height: 509px;
            }

            .transaction-list__item-container {
                width: 30%;
            }
            .transaction-list__details {
                display: block;
                position: absolute;
                top: 0;
                right: 0;
                max-width: 768px;
                left: 36%;
            }

            .transaction-list__mask-top {
                width: 52px;
                background-color: #1a1a2e;
                position: absolute;
                left: 36%;
                z-index: 1000;
                border-bottom-right-radius: 30px;
                top: 0;
            }
            .transaction-list__mask-bottom {
                width: 52px;
                height: 2000px;
                background-color: #1a1a2e;
                position: absolute;
                left: 36%;
                z-index: 1000;
                border-top-right-radius: 30px;
            }
            .hidden {
                visibility: hidden;
            }
            .visible {
                visibility: visible;
            }
        `,
    ],
    template: `<!-- -->
        <div class="transaction-list__container" #mainContainer>
            @for (tx of transactions(); track tx.orderId; let i = $index) {
                <div
                    class="transaction-list__item-container item-{{ i }}"
                    #txEl
                >
                    <transaction-item
                        [item]="tx"
                        [active]="activeMap.get(tx.orderId)!"
                        (onActive)="handleOnActive(tx, txEl, i)"
                        [theme]="{
                            active: '#dab1de',
                            inactive: '#808080',
                        }"
                    />
                </div>
                @if (i !== 0) {
                    <div
                        class="transaction-list__mask-top mask-top-{{ i }}"
                        [ngClass]="[
                            currentActive() !== tx.orderId
                                ? 'hidden'
                                : 'visible',
                        ]"
                    ></div>
                }
                <div
                    class="transaction-list__mask-bottom mask-bottom-{{ i }}"
                    [ngClass]="[
                        currentActive() !== tx.orderId ? 'hidden' : 'visible',
                    ]"
                ></div>
                @if (currentActive() === tx.orderId) {
                    <div class="transaction-list__details">
                        <transaction-details
                            [details]="tx.details"
                            [theme]="{ bgColor: '#dab1de' }"
                        />
                    </div>
                }
            }
        </div> `,
})
export class TransactionListComponent {
    transactions = input.required<TransactionList>();
    activeMap = new Map<string, boolean>();
    currentActive = signal<string | null>(null);

    renderer = inject(Renderer2);
    el = inject(ElementRef);
    mainContainer = viewChild<ElementRef>('mainContainer');
    txEl = viewChildren<ElementRef>('txEl');
    ngOnInit() {}

    ngAfterViewInit() {
        this.transactions().forEach((tx, i) => {
            if (i === 0) {
                this.currentActive.set(tx.orderId);
                this.activeMap.set(tx.orderId, true);
                this.setMaskPos(this.txEl()[i].nativeElement, i);
            } else {
                this.activeMap.set(tx.orderId, false);
            }
        });
    }

    setTxDetailHeight() {
        setTimeout(() => {
            const txEl = this.txEl()[0].nativeElement.getBoundingClientRect();
            const txDetail = this.el.nativeElement.querySelector(
                '.transaction-details__container',
            );
            if (txDetail) {
                this.renderer.setStyle(
                    txDetail,
                    'height',
                    txEl.height * 5 + 4 * 16 + 'px',
                );
            }
        });
    }

    handleOnActive(tx: TransactionItem, txEl: HTMLElement, i: number) {
        if (tx.orderId === this.currentActive()) return;
        this.activeMap.set(this.currentActive()!, false);
        this.activeMap.set(tx.orderId, true);
        this.currentActive.set(tx.orderId);

        this.setMaskPos(txEl, i);
    }

    setMaskPos(txEl: HTMLElement, i: number) {
        const rect = txEl.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const absoluteTop = rect.top + scrollY;
        const elRect =
            this.mainContainer()?.nativeElement.getBoundingClientRect();

        const containerPosY = elRect.top + scrollY;
        const bottommaskTopPos = absoluteTop - containerPosY + rect.height;

        const bottomMaskEl = this.el.nativeElement.querySelector(
            `.mask-bottom-${i}`,
        );

        // set top position of bottom mask
        this.renderer.setStyle(bottomMaskEl, 'top', `${bottommaskTopPos}px`);

        // set height of top mask
        if (i > 0) {
            const topMaskEl = this.el.nativeElement.querySelector(
                `.mask-top-${i}`,
            );
            const topmaskHeight = rect.height * i + 16 * i;
            this.renderer.setStyle(topMaskEl, 'height', `${topmaskHeight}px`);
        }
    }
}
