import { Component, computed, inject, input } from '@angular/core';
import { NotificationComponent } from '../../base/notification/notification.component';
import {
    Notification,
    NotificationId,
} from '../../base/notification/notification';
import { NgClass } from '@angular/common';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { NotificationService } from '../../../data-access/notification.service';

@Component({
    standalone: true,
    selector: 'notification-hub',
    imports: [NgClass, NotificationComponent],
    animations: [
        trigger('stackedAnimation', [
            state(
                'stacked',
                style({
                    transform:
                        'translateX(4px) translateY(var(--stack-offset,0px))',
                    opacity: 0.7,
                    zIndex: -1,
                    height: '120px',
                }),
            ),
            state(
                'expanded',
                style({
                    // marginTop: '0',
                    transform: 'translateX(0) translateY(0px)',
                    opacity: 1,
                    zIndex: 100,
                }),
            ),
            transition('stacked => expanded', [animate('300ms ease-out')]),
            transition('expanded => stacked', [animate('300ms ease-in')]),
        ]),
    ],
    styles: [
        `
            .notification-hub {
                background-color: #4a4a8e97;
                height: 480px;
                padding: 1rem;
                border-radius: 20px;
                overflow: scroll;
            }

            .notification-stack {
                cursor: pointer;
                position: relative;

                &.collapsed {
                    height: 120px;
                }
            }

            .stack-behind {
                position: relative;
            }

            .stack-top {
                position: relative;
                z-index: 100;
            }
        `,
    ],
    template: `
        <div class="notification-hub">
            @for (
                notifications of notifications();
                track idx;
                let idx = $index
            ) {
                <div
                    class="notification-stack"
                    [ngClass]="{
                        expanded: expandedGroups().get(notifications[0].type),
                        collapsed: !expandedGroups().get(notifications[0].type),
                    }"
                    (click)="toggleExpand(notifications[0].type)"
                >
                    @for (
                        data of notifications;
                        track data.id;
                        let i = $index
                    ) {
                        <div
                            [ngClass]="{
                                'stack-behind': i > 0,
                                'stack-top': i == 0,
                            }"
                            [style.--stack-offset]="
                                i > 0 ? i * -120 + 'px' : '0px'
                            "
                            [@stackedAnimation]="
                                i == 0 ||
                                expandedGroups().get(notifications[0].type)
                                    ? 'expanded'
                                    : 'stacked'
                            "
                        >
                            <notification
                                [data]="data"
                                [count]="i === 0 ? notifications.length : null"
                                (remove)="onRemove($event)"
                            />
                        </div>
                    }
                </div>
            }
        </div>
    `,
})
export class NotificationHubComponent {
    notificationSvc = inject(NotificationService);
    notifications = this.notificationSvc.notifications;

    expandedGroups = computed(() => {
        const map = new Map<string, boolean>();
        this.notifications().forEach((group) => {
            if (group[0]?.type) {
                map.set(group[0].type, false);
            }
        });
        return map;
    });

    animationState: {
        [key: string]: { expanding?: boolean; collapsing?: boolean };
    } = {};

    toggleExpand(type: string) {
        this.expandedGroups().set(type, !this.expandedGroups().get(type));
    }

    onRemove(id: NotificationId) {
        this.notificationSvc.remove$.next(id);
    }
}
