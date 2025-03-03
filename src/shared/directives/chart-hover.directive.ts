import {
    Directive,
    ElementRef,
    Renderer2,
    AfterViewInit,
    ViewContainerRef,
    inject,
    ComponentRef,
} from '@angular/core';
import { PriceDataTooltipComponent } from '../components/base/price-data-tooltip/price-data-tooltip.component';

@Directive({
    standalone: true,
    selector: '[chartHover]',
})
export class ChartHoverDirective implements AfterViewInit {
    vcr = inject(ViewContainerRef);
    el = inject(ElementRef);
    renderer = inject(Renderer2);

    tooltipComponentRef!: ComponentRef<PriceDataTooltipComponent>;

    ngAfterViewInit() {
        const circles = this.el.nativeElement.querySelectorAll('.data-point');
        circles.forEach((circle: SVGElement) => {
            this.renderer.listen(circle, 'mouseover', (event: MouseEvent) =>
                this.onHover(event),
            );
            this.renderer.listen(circle, 'mousemove', (event: MouseEvent) =>
                this.onMouseMove(event),
            );
            this.renderer.listen(circle, 'mouseout', () => this.onMouseOut());
        });
    }

    private onHover(event: MouseEvent) {
        const crosshairText = this.el.nativeElement.querySelectorAll(
            '[aria-label="crosshair text"]',
        );
        const data = {
            date: new Date(crosshairText[0].textContent),
            value: crosshairText[1].textContent,
        };
        if (data) {
            this.createTooltipComponent(data);
            this.updateTooltipPosition(event);
        }
    }

    private onMouseMove(event: MouseEvent) {
        this.updateTooltipPosition(event);
    }

    private onMouseOut() {
        if (this.tooltipComponentRef) {
            this.tooltipComponentRef.destroy();
            this.tooltipComponentRef.changeDetectorRef.detectChanges();
        }
    }

    private createTooltipComponent(data: { date: Date; value: string }) {
        this.tooltipComponentRef = this.vcr.createComponent(
            PriceDataTooltipComponent,
        );
        this.tooltipComponentRef.instance.data = data;
        this.renderer.appendChild(
            document.body,
            this.tooltipComponentRef.location.nativeElement,
        );
    }

    private updateTooltipPosition(event: MouseEvent) {
        if (this.tooltipComponentRef) {
            const x = event.clientX + 10;
            const y = event.clientY + 10;
            this.renderer.setStyle(
                this.tooltipComponentRef.location.nativeElement,
                'position',
                `absolute`,
            );
            this.renderer.setStyle(
                this.tooltipComponentRef.location.nativeElement,
                'left',
                `${x}px`,
            );
            this.renderer.setStyle(
                this.tooltipComponentRef.location.nativeElement,
                'top',
                `${y}px`,
            );
        }
    }
}
