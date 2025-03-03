import { Component } from '@angular/core';

@Component({
    selector: 'section-header',
    template: `<h1 class="section-header"><ng-content /></h1>`,
    styles: [
        `
            .section-header {
                color: var(--white);
            }
        `,
    ],
})
export class SectionHeaderComponent {}
