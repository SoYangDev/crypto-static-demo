import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TransactionDetail } from '../transaction';
import { NgStyle } from '@angular/common';
import { DetailFormatPipe } from './detail-format.pipe';
import { WordPipe } from '../../../../pipes/word.pipe';
import { fadeSlideX } from '../../../../animations/fade-slide-x.animation';

@Component({
    standalone: true,
    selector: 'transaction-details',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgStyle, DetailFormatPipe, WordPipe],
    animations: [fadeSlideX],
    styles: [
        `
            .detail__container {
                height: 514px;
                max-width: 420px;
                border-radius: 20px;
                background-color: transparent;
                position: relative;
                overflow: hidden;
            }

            .detail__content {
                height: 100%;
                border-radius: 20px;
                background-color: inherit;
                position: absolute;
                top: 0;
                left: 44px;
                right: 0;
                z-index: 300;
                padding: 0.25rem 1.5rem;
            }

            .detail__header {
                display: flex;
                justify-content: space-between;
                align-items: end;
            }
            .detail__order-id {
                background-color: var(--white);
                border-radius: 25px;
                padding: 12px;
                font-weight: bold;
            }

            .detail__list {
                list-style-type: none;
                padding: 0;

                li {
                    margin-bottom: 0.5rem;
                    display: flex;
                    font-weight: bold;
                }
            }

            .detail__label {
                width: 100px;
            }
        `,
    ],
    template: `<!-- -->
        <div
            class="detail__container"
            [ngStyle]="{
                'background-color': theme().bgColor!,
            }"
        >
            <div class="detail__content">
                <div class="detail__header">
                    <h3>Details</h3>
                    <div class="detail__order-id">
                        {{ details().type }}
                    </div>
                </div>
                <ul class="detail__list">
                    @for (prop of infoToDisplay; track prop) {
                        <li @fadeSlideX>
                            <p class="detail__label">{{ prop | word }}:</p>
                            <p class="detail__value">
                                {{ details()[prop] | detailFormat }}
                            </p>
                        </li>
                    }
                </ul>
            </div>
        </div> `,
})
export class TransactionDetailsComponent {
    details = input.required<TransactionDetail>();
    theme = input.required<{ bgColor: string }>();

    infoToDisplay: string[] = [
        'orderId',
        'price',
        'side',
        'amount',
        'fee',
        'total',
    ];
    ngOnInit() {
        console.log(this.details());
    }
}
