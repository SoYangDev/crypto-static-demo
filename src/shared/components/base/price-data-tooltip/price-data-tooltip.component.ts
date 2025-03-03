import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'price-data-tooltip',
    template: `
        @if (!!data) {
            <div class="tooltip">
                <p>Date: {{ data.date.toLocaleDateString() }}</p>
                <p>Price: {{ '$' + data.value }}</p>
            </div>
        }
    `,
    styles: [
        `
            .tooltip {
                position: absolute;
                background: #333;
                color: var(--white);
                padding: 5px;
                border-radius: 4px;
                pointer-events: none;
            }
        `,
    ],
})
export class PriceDataTooltipComponent {
    @Input({ required: true }) data!: { date: Date; value: string };
}
