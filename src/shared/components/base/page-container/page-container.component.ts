import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'page-container',
    template: `<div class="page-container"><ng-content /></div>`,
    styles: [
        `
            .page-container {
                padding: 20px;
            }
        `,
    ],
})
export class PageContainerComponent {}
