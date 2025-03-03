import { Component } from '@angular/core';

@Component({
    selector: 'card-grid',
    template: ` <div class="card-grid"><ng-content /></div>`,
    styles: [
        `
            .card-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-top: 10px;
            }

            @media (min-width: 768px) {
                .card-grid {
                    grid-template-columns: repeat(3, 1fr);
                    justify-content: space-between;
                }
            }
        `,
    ],
})
export class CardGridComponent {}
