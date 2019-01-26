import {WebSlidesPlugin} from "../web-slides-plugin";

const WHEEL_TOLERANCE = 60;
const SCROLL_TOLERANCE = 5; // px

export class WebSlidesMouseWheelPlugin extends WebSlidesPlugin {
    bind(): void {
        this.ws.addEventListener('wheel', this.onMouseWheel);
    }
    destroy(): void {
        this.ws.removeEventListener('wheel', this.onMouseWheel);
    }

    private get isTopScroll() {
        return this.ws.scrollTop < SCROLL_TOLERANCE;
    }
    private get isBottomScroll() {
        return this.ws.scrollHeight - (this.ws.scrollTop + this.ws.clientHeight) < SCROLL_TOLERANCE;
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
            if (goNext && this.isBottomScroll) {
                this.ws.next();
                event.preventDefault();
            }
            if (!goNext && this.isTopScroll){
                this.ws.prev();
                event.preventDefault();
            }
        }
    };

}