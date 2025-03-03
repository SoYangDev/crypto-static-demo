import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
} from '@angular/core';
import { TransactionItem } from '../transaction';
import { CommonModule, CurrencyPipe, NgClass, NgStyle } from '@angular/common';

@Component({
    standalone: true,
    selector: 'transaction-item',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, CurrencyPipe, NgClass, NgStyle],
    styles: [
        `
            .transaction-item__container {
                display: grid;
                grid-template-columns: auto 1fr auto;
                align-items: center;
                padding: 0.25rem 1rem;
                background-color: var(--gray);
                border-radius: 20px;
                margin-bottom: 1rem;
                max-width: 340px;
                position: relative;
                width: 120%;
                z-index: 3000;
                :hover {
                    cursor: pointer;
                }
            }

            .transaction-item__logo {
                grid-column: 1;
                margin-right: 1.5rem;
            }

            @media (min-width: 768px) {
                .transaction-item__container {
                    // flex-direction: row;
                    // justify-content: space-between;
                    // align-items: center;
                    // max-width: 484px;
                }
            }
            .transaction-item__container.active::after {
                width: 120%;
            }
            // .transaction-item__container.active::after {
            //     content: '';
            //     width: 100%;
            //     background: pink;
            //     height: 100%;
            //     position: absolute;
            //     top: 0;
            //     left: 50%;
            //     bottom: 0;
            //     z-index: 2;
            //     border-radius: 20px;
            // }
            .transaction-item__logo,
            .transaction-item__logo img,
            .transaction-item__desc,
            .transaction-item__token-id,
            .transaction-item__amount,
            .transaction-item__date {
                z-index: 1000;
            }
            .transaction-item__logo {
                width: 40px;

                img {
                    width: 100%;
                }
            }
            .transaction-item__token-id {
                font-size: 18px;
                font-weight: bold;
            }
            .transaction-item__amount {
                margin-top: -10px;
            }

            .transaction-item__date {
                background-color: var(--disabled);
                border-radius: 25px;
                padding: 12px;
                font-weight: bold;
            }

            .transaction-item__date.active {
                background-color: var(--white);
            }
        `,
    ],
    template: `<!-- -->
        <div
            (click)="onActive.emit()"
            class="transaction-item__container"
            [ngStyle]="{
                'background-color': active()
                    ? theme().active
                    : theme().inactive,
            }"
            [ngClass]="{ active: active() }"
        >
            <div class="transaction-item__logo">
                <img [src]="item().image" />
            </div>
            <div class="transaction-item__desc">
                <p class="transaction-item__token-id">
                    {{ item().tokenId }}
                </p>
                <p class="transaction-item__amount">
                    {{ item().amount | currency }}
                </p>
            </div>
            <div
                class="transaction-item__date"
                [ngClass]="{ active: active() }"
            >
                {{
                    item().date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })
                }}
            </div>
        </div> `,
})
export class TransactionItemComponent {
    item = input.required<TransactionItem>();
    active = input.required<boolean>();
    theme = input<{ active: string; inactive: string }>({
        active: 'pink',
        inactive: '#808080',
    });
    onActive = output();

    ngOnInit() {
        console.log(this.active());
    }
}
