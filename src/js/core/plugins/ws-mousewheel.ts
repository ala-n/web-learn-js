import {WebSlidesPlugin} from "../web-slides-plugin";

const WHEEL_TOLERANCE = 60;
const SCROLL_TOLERANCE = 5; // px

export class WebSlidesMouseWheelPlugin extends WebSlidesPlugin {
    bind(): void {
        window.addEventListener('wheel', this.onMouseWheel);
    }
    destroy(): void {
        window.removeEventListener('wheel', this.onMouseWheel);
    }

    private get isTopScroll() {
        return this.ws.scrollTop < SCROLL_TOLERANCE;
    }
    private get isBottomScroll() {
        return this.ws.scrollHeight - (this.ws.scrollTop + this.ws.clientHeight) < SCROLL_TOLERANCE;
    }

    private onMouseWheel = (event: WheelEvent) => {
        if (this.ws.isMoving) {
            event.preventDefault();
            return;
        }

        const {deltaY: wheelDelta} = event;
        const goNext = wheelDelta > 0;

        if (Math.abs(wheelDelta) > WHEEL_TOLERANCE) {
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