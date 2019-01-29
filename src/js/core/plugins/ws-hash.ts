import {WebSlidesPlugin} from "../web-slides-plugin";
import {SlideEventType, WebSlideChangeEvent} from "../web-slide-event";

export class WebSlidesHashPlugin extends WebSlidesPlugin {

    bind(): void {
        this.onWindowHashChange();
        this.ws.addEventListener(SlideEventType.CHANGED, this.onSlideChange);
        window.addEventListener('hashchange', this.onWindowHashChange);
    }

    destroy(): void {
        window.removeEventListener('hashchange', this.onWindowHashChange);
        this.ws.removeEventListener(SlideEventType.CHANGED, this.onSlideChange);
    }

    private onWindowHashChange = () => {
        let hash = window.location.hash.substr(1);
        this.ws.goTo(isNaN(+hash) ? hash : (+hash - 1));
    };

    private onSlideChange = (event: WebSlideChangeEvent) => {
        const slide = event.currentSlide;
        history.pushState({
            slideRoute: slide.route
        }, `Slide ${slide.title}`, `#${slide.route}`);
    };
}