import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
    name: 'detailFormat',
    pure: true,
    standalone: true,
})
export class DetailFormatPipe implements PipeTransform {
    private currencyPipe = inject(CurrencyPipe);

    transform(value: string | number | null | undefined): string {
        if (value === null || value === undefined) {
            return 'N/A';
        }

        if (typeof value === 'string') {
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(); // Capitalize strings
        }

        if (typeof value === 'number') {
            return (
                this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2') ||
                value.toString()
            );
        }

        return String(value);
    }
}
