import {WebSlide} from './web-slide';

export const enum SlideEventType {
    BEFORE_CHANGE = 'ws:beforechange',
    CHANGED = 'ws:changed'
}
export class WebSlideChangeEvent extends Event {

    constructor(
        eventType: string,
        readonly currentSlide: WebSlide,
        readonly relatedSlide: WebSlide
    ) {
        super(eventType, {
            bubbles: true
        });
    }

    static dispatch(target: HTMLElement, type: SlideEventType, currentSlide: WebSlide, relatedSlide: WebSlide) {
        return target.dispatchEvent(new WebSlideChangeEvent(type, currentSlide, relatedSlide));
    }
}