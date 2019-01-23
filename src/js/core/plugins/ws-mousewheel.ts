import {WebSlidesPlugin} from "../web-slides-plugin";

const WHEEL_TOLERANCE = 40;
const SCROLL_TOLERANCE = 5; // px

export class WebSlidesMouseWheelPlugin extends WebSlidesPlugin {
    bind(): void {
        window.addEventListener('wheel', this.onMouseWheel);
    }
    destroy(): void {
        window.removeEventListener('wheel', this.onMouseWheel);
    }

    public get isTopScroll() {
        return this.ws.scrollTop < SCROLL_TOLERANCE;
    }
    public get isBottomScroll() {
        return this.ws.scrollHeight - (this.ws.scrollTop + this.ws.clientHeight) < SCROLL_TOLERANCE;
    }

    public onMouseWheel = (event: WheelEvent) => {
        if (this.ws._isMoving) return;
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