import { computed, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

interface UserState {
    name: string | null;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private state = signal<UserState>({
        name: null,
    });

    //selectors
    name = computed(() => this.state().name);

    //actions
    submit$ = new Subject<string>();

    constructor() {
        const name = localStorage.getItem('userName');
        if (name) this.state.update(() => ({ name }));

        //reducer
        this.submit$.pipe(takeUntilDestroyed()).subscribe((name) => {
            this.state.update(() => ({
                name,
            }));
            localStorage.setItem('userName', name);
        });
    }
}
