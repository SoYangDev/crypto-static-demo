import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'word',
    standalone: true,
})
export class WordPipe implements PipeTransform {
    transform(
        value: string | undefined | null,
        capitalize: boolean = true,
    ): string {
        if (!value) return '';

        let result = value;

        // Replace underscores with spaces
        result = result.replace(/_/g, ' ');

        // Handle camelCase: Split by capital letters (but preserve first letter)
        result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

        // Split by spaces and capitalize each word
        const words = result.split(' ');
        result = words
            .map((word) =>
                capitalize
                    ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    : word,
            )
            .join(' ');

        return result;
    }
}
