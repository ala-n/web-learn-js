import {WebSlide} from "./web-slide";

export class WebSlideChangeEvent extends Event {
    constructor(
        eventType: string,
        public readonly currentSlide: WebSlide,
        public readonly relatedSlide: WebSlide
    ) {
        super(eventType, {
            bubbles: true
        });
    }

    public static dispatch(target: HTMLElement, type: string, currentSlide: WebSlide, relatedSlide: WebSlide) {
        return target.dispatchEvent(new WebSlideChangeEvent(type, currentSlide, relatedSlide));
    }
}