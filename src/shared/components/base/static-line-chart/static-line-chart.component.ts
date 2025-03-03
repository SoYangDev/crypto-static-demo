import { Component, ElementRef, inject, input, Renderer2 } from '@angular/core';
import * as Plot from '@observablehq/plot';

@Component({
    standalone: true,
    selector: 'static-line-chart',
    template: `<div id="chart-container"></div>`,
    imports: [],
})
export class StaticLineChartComponent {
    trend = input.required<'negative' | 'positive'>();

    renderer = inject(Renderer2);
    el = inject(ElementRef);

    ngOnInit() {
        this.renderChart();
    }

    renderChart() {
        const data =
            this.trend() === 'positive'
                ? this.createBullLine()
                : this.createBearLine();
        const plot = Plot.plot({
            width: 300,
            height: 300,
            margin: 0,
            x: { axis: null },
            y: { axis: null },
            marks: [
                Plot.line(data, {
                    x: 'date',
                    y: 'value',
                    stroke: this.trend() === 'positive' ? 'green' : 'red',
                    strokeWidth: 10,
                }),
            ],
        });

        const chartContainer = this.el.nativeElement.querySelector(
            '#chart-container',
        ) as HTMLElement;

        if (chartContainer) {
            this.renderer.appendChild(chartContainer, plot);
        }
    }

    createBullLine(): Plot.Data {
        let calendarDay = 1;
        let value = 100;
        return Array.from({ length: 6 }).map((_, i: number) => {
            const data = {
                date: new Date(`2025-02-${calendarDay.toString()}`),
                value: value,
            };
            calendarDay++;
            if (i % 2 == 0) {
                value += 70;
            } else {
                value -= 30;
            }
            return data;
        });
    }

    createBearLine(): Plot.Data {
        let calendarDay = 1;
        let value = 500;
        return Array.from({ length: 6 }).map((_, i) => {
            const data = {
                date: new Date(`2025-02-${calendarDay.toString()}`),
                value: value,
            };
            calendarDay++;
            if (i % 2 == 0) {
                value -= 50;
            } else {
                value += 15;
            }
            return data;
        });
    }
}
