import {WebSlidesPlugin} from '../web-slides-plugin';
import {DeviceDetector} from '../utils/devices';

interface Point {
    x: number;
    y: number;
}

export class WebSlidesTouchPlugin extends WebSlidesPlugin {

    static TOUCH_TOLERANCE = 100;
    static get EVENTS() {
        if (DeviceDetector.isTouchDevice()) {
            return {
                START: 'touchstart',
                MOVE: 'touchmove',
                END: 'touchend'
            };
        } else {
            return {
                START: 'pointerdown',
                MOVE: 'pointermove',
                END: 'pointerup'
            };
        }
    }

    private startPoint: Point = null;
    private isEnabled = false;

    private topY: number = null;
    private bottomY: number = null;

    bind(): void {
        const events = WebSlidesTouchPlugin.EVENTS;

        this.ws.classList.add('ws-touch-aria');

        this.ws.addEventListener(events.START, this.onTouchStart, false);
        this.ws.addEventListener(events.MOVE, this.onTouchMove, false);
        this.ws.addEventListener(events.END, this.onTouchEnd, false);
    }
    destroy(): void {
        const events = WebSlidesTouchPlugin.EVENTS;

        this.ws.classList.remove('ws-touch-aria');

        this.ws.removeEventListener(events.START, this.onTouchStart);
        this.ws.removeEventListener(events.MOVE, this.onTouchMove);
        this.ws.removeEventListener(events.END, this.onTouchEnd);
    }

    onTouchStart = (event: TouchEvent | PointerEvent) => {
        if ((event instanceof TouchEvent && event.touches.length !== 1) ||
            (event instanceof PointerEvent && event.pointerType !== 'touch')) {
            this.isEnabled = false;
            return;
        }
        this.isEnabled = true;
        const point = this.startPoint = WebSlidesTouchPlugin.normalizeTouchPoint(event);

        if (this.ws.isScrollTop()) {
            this.topY = point.y;
        }
        if (this.ws.isScrollBottom()) {
            this.bottomY = point.y;
        }
    };

    onTouchMove = (event: TouchEvent | PointerEvent) => {
        if (!this.isEnabled) return;

        const point = WebSlidesTouchPlugin.normalizeTouchPoint(event);

        if (this.topY === null && this.ws.isScrollTop()) {
            this.topY = point.y;
        }
        if (this.bottomY === null && this.ws.isScrollBottom()) {
            this.bottomY = point.y;
        }
        if ((this.topY !== null && point.y > this.topY) ||
            (this.bottomY !== null && point.y < this.bottomY))  {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    onTouchEnd = (event: TouchEvent | PointerEvent) => {
        if (!this.isEnabled) return;

        const point = WebSlidesTouchPlugin.normalizeTouchPoint(event);

        if (this.bottomY !== null && this.bottomY - point.y > WebSlidesTouchPlugin.TOUCH_TOLERANCE) {
            this.ws.next();
            event.preventDefault();
            event.stopPropagation();
        }
        if (this.topY !== null && point.y - this.topY > WebSlidesTouchPlugin.TOUCH_TOLERANCE) {
            this.ws.prev();
            event.preventDefault();
            event.stopPropagation();
        }
        this.topY = this.bottomY = null;
        this.isEnabled = false;
    };

    static normalizeTouchPoint(event: TouchEvent | PointerEvent) {
        if (event instanceof TouchEvent) {
            const touch = event.changedTouches[0];
            return {
                x: touch.pageX,
                y: touch.pageY,
            };
        }
        return {
          x: event.pageX,
          y: event.pageY
        };
    }
}