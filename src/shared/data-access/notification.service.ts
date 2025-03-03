import { computed, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { from, map, Observable, of, reduce, Subject } from 'rxjs';
import {
    Notification,
    NotificationId,
} from '../components/base/notification/notification';
import { notifications } from '../data';

interface NotificationHubState {
    notifications: Notification[][];
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private state = signal<NotificationHubState>({
        notifications: [],
    });

    //selectors
    notifications = computed(() => this.state().notifications);

    //actions
    remove$ = new Subject<NotificationId>();

    constructor() {
        //reducers
        this.getNotifications().subscribe((notifications: Notification[][]) => {
            this.state.update(() => ({ notifications }));
        });

        this.remove$.pipe(takeUntilDestroyed()).subscribe((id) => {
            this.state.update((state) => {
                const updatedNotifications = state.notifications
                    .map((group) =>
                        group.filter((notification) => notification.id !== id),
                    )
                    .filter((group) => group.length > 0);
                return {
                    notifications: updatedNotifications,
                };
            });
        });
    }

    getNotifications(): Observable<Notification[][]> {
        return from(notifications).pipe(
            reduce(
                (
                    acc: { [key: string]: Notification[] },
                    notification: Notification,
                ) => {
                    if (!acc[notification.type]) {
                        acc[notification.type] = [];
                    }
                    acc[notification.type].push(notification);
                    return acc;
                },
                {} as { [key: string]: Notification[] },
            ),
            map((notificationMap: { [key: string]: Notification[] }) => {
                const types = Object.keys(notificationMap);
                return types.map((type) => notificationMap[type]);
            }),
        );
    }
}
