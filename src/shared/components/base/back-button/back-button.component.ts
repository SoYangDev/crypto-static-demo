import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    selector: 'back-button',
    styles: [``],
    imports: [MatButtonModule],
    template: ` <button mat-button class="secondary" (click)="goBack()">
        Back
    </button>`,
})
export class BackButtonComponent {
    router = inject(Router);
    goBack() {
        this.router.navigate(['/']);
    }
}
