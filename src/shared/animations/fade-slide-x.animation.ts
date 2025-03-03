import {
    animate,
    style,
    transition,
    trigger,
    AnimationTriggerMetadata,
} from '@angular/animations';

export const fadeSlideX: AnimationTriggerMetadata = trigger('fadeSlideX', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
            '300ms ease-out',
            style({ opacity: 1, transform: 'translateX(0)' }),
        ),
    ]),
    transition(':leave', [
        animate(
            '300ms ease-in',
            style({ opacity: 0, transform: 'translateX(20px)' }),
        ),
    ]),
]);
