import { Component, ElementRef, inject, input, Renderer2 } from '@angular/core';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import { ChartHoverDirective } from '../../../directives/chart-hover.directive';

interface LineChartData {
    date: Date;
    value: number;
}

@Component({
    standalone: true,
    selector: 'line-chart',
    styles: [
        `
            #chart-container {
                border-radius: 10px;
                background-color: transparent;
            }
        `,
    ],
    template: `<div id="chart-container" chartHover></div>`,
    imports: [ChartHoverDirective],
})
export class LineChartComponent {
    data = input.required<LineChartData[]>();

    renderer = inject(Renderer2);
    el = inject(ElementRef);

    ngOnInit() {
        this.renderChart(this.data());
    }

    renderChart(data: LineChartData[]) {
        const plot = Plot.plot({
            width: 1200,
            height: 500,
            marginTop: 20,
            marginRight: 20,
            marginBottom: 45,
            marginLeft: 50,
            x: {
                type: 'utc',
                domain: d3.extent(data, (d) => d.date) as [Date, Date],
                tickFormat: (d) =>
                    d instanceof Date
                        ? d.toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                          })
                        : '',
                tickSize: 0,
                label: null,
                insetLeft: 20,
                tickRotate: -45,
            },
            y: {
                domain: d3.extent(data, (d) => d.value) as [number, number],
                tickFormat: (d) => {
                    if (d < 1) {
                        return `$${d.toFixed(4)}`;
                    } else {
                        return `$${d.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
                    }
                },
                grid: true,
                label: null,
                tickPadding: 0,
                insetBottom: 50,
            },
            style: {
                color: '#00FFCC',
                backgroundColor: 'transparent',
                fontFamily: 'Arial, sans-serif',
                stroke: '#00FFCC',
                strokeWidth: '1.2',
                fontSize: '12',
                height: '100%',
                width: '80%',
            },
            marks: [
                Plot.lineY(data, {
                    x: 'date',
                    y: 'value',
                }),
                Plot.ruleX([2]),
                Plot.areaY(data, {
                    x: 'date',
                    y: 'value',
                    fill: 'rgba(0, 255, 204, 0.2)',
                    fillOpacity: 0.2,
                }),
                Plot.line(data, {
                    x: 'date',
                    y: 'value',
                    stroke: '#00FFCC',
                    strokeWidth: 2.5,
                    strokeLinecap: 'round',
                }),
                Plot.dot(data, {
                    x: 'date',
                    y: 'value',
                    fill: 'transparent',
                }),
                Plot.crosshair(data, {
                    x: 'date',
                    y: 'value',
                }),
            ],
        });

        const chartContainer = this.el.nativeElement.querySelector(
            '#chart-container',
        ) as HTMLElement;

        if (chartContainer) {
            this.renderer.appendChild(chartContainer, plot);
            const circles = chartContainer.querySelectorAll('circle');
            circles.forEach((circle) => circle.classList.add('data-point'));
        }
    }
}
