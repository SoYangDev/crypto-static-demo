import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../../../shared/data-access/user.service';

@Component({
    standalone: true,
    selector: 'app-input-dialog',
    imports: [FormsModule, MatButtonModule, MatDialogModule, MatInputModule],
    styleUrl: './input-dialog.component.css',
    template: ` <mat-dialog-content>
            <mat-form-field appearance="outline" class="full-width">
                <mat-label>Enter Your Name</mat-label>
                <input
                    matInput
                    [(ngModel)]="userInput"
                    placeholder="Type here..."
                    (keydown.enter)="onSubmit()"
                />
            </mat-form-field>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button (click)="onSubmit()" [disabled]="!userInput">
                Submit
            </button>
        </mat-dialog-actions>`,
})
export class InputDialogComponent {
    userInput: string = '';
    userSvc = inject(UserService);

    constructor(public dialogRef: MatDialogRef<InputDialogComponent>) {}

    onSubmit(): void {
        this.userSvc.submit$.next(this.userInput);
        this.dialogRef.close(this.userInput);
    }
}
