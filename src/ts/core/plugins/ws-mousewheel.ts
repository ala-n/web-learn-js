import {WebSlidesPlugin} from '../web-slides-plugin';

const WHEEL_TOLERANCE = 60;

export class WebSlidesMouseWheelPlugin extends WebSlidesPlugin {
    bind(): void {
        this.ws.addEventListener('wheel', this.onMouseWheel);
    }
    destroy(): void {
        this.ws.removeEventListener('wheel', this.onMouseWheel);
    }

    private onMouseWheel = (event: WheelEvent) => {
        if (this.ws.disabled) {
            return;
        }

        if (this.ws.isMoving) {
            event.preventDefault();
            return;
        }

        const {deltaY: wheelDelta} = event;
        const goNext = wheelDelta > 0;

        if (Math.abs(wheelDelta * (event.deltaMode ? WHEEL_TOLERANCE : 1)) > WHEEL_TOLERANCE) {
            if (goNext && this.ws.isScrollBottom()) {
                this.ws.next();
                event.preventDefault();
            }
            if (!goNext && this.ws.isScrollTop()) {
                this.ws.prev();
                event.preventDefault();
            }
        }
    };

}