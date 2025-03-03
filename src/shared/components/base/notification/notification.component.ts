import { UpperCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Notification, NotificationId } from './notification';
import { MatButtonModule } from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'notification',
    imports: [MatIconModule, MatButtonModule, UpperCasePipe],
    styles: [
        `
            .notification__container {
                position: relative;
                min-width: 320px;
                background: #2d2d4a;
                border-radius: 1.5rem;
                padding: 0.25rem 1rem;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                gap: 20px;
                color: var(--white);
                z-index: 999;
                :hover {
                    cursor: pointer;
                }
            }

            .notification__icon {
                border-radius: 15px;
                width: 45px;
                height: 40px;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #363675;
                flex-shrink: 0;
                flex-grow: 0;
                flex-basis: auto;
                position: relative;
                mat-icon {
                    background: #363675;
                    color: #00ffcc; /* Neon teal for Nixtrade icons */
                }

                &.delete {
                    z-index: 99999;
                }
            }

            .notification__icon-count {
                width: 18px;
                height: 18px;
                border-radius: 100%;
                position: absolute;
                background: var(--gray);
                display: flex;
                justify-content: center;
                align-items: center;
                color: #000;
                font-weight: bold;
                font-size: 0.75rem;
                top: -5px;
                right: -5px;
            }

            .notification__content {
                flex: 1;
                height: 50%;
                display: flex;
                flex-direction: column;
                > div {
                    display: flex;
                    column-gap: 20px;
                }
            }

            .notification__date {
                flex-shrink: 0;
                align-self: flex-start;
                padding-top: 1.3rem;
            }
            .notification__message {
                margin-top: 5px;
            }
        `,
    ],
    template: ` <div class="notification__container">
        <div class="notification__icon">
            @if (count()) {
                <div class="notification__icon-count">{{ count() }}</div>
            }
            <mat-icon>{{ iconMap[data().type] }}</mat-icon>
        </div>
        <div class="notification__content">
            <div>
                <h4>{{ data().type | uppercase }}</h4>
                <div class="notification__date">
                    {{
                        data().date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })
                    }}
                </div>
            </div>
            <p class="notification__message">{{ data().message }}</p>
        </div>
        <button
            class="notification__icon delete"
            (click)="remove.emit(data().id)"
        >
            <mat-icon>delete</mat-icon>
        </button>
    </div>`,
})
export class NotificationComponent {
    data = input.required<Notification>();
    count = input.required<number | null>();
    iconMap: Record<string, string> = {
        withdrawal: 'arrow_outward',
        deposit: 'arrow_downward',
        transaction: 'payments',
        misc: '',
    };
    remove = output<NotificationId>();
}
