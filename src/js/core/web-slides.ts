import {WebSlide} from './web-slide';
import DOM from "./utils/dom";

export const NEXT_SLIDE = '$next';
export const PREV_SLIDE = '$prev';

export class WebSlides extends HTMLElement {

    static get is() { return 'web-slides'; }

    private _isMoving = false;

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.slides.length) {
            this.slides[0].active = true;
        }

        this.setAttribute('ready','');
        document.documentElement.classList.add(this.bodyClass);

        this._bindListeners();
    }
    disconnectedCallback() {
        this._unbindListeners();
    }

    private _bindListeners() {
        window.addEventListener('hashchange', this.onWindowHashChange);
        window.addEventListener('wheel', this.onMouseWheel);
        // TODO: MutationObserver for content to refresh slide cache
    }
    private _unbindListeners() {
        window.removeEventListener('hashchange', this.onWindowHashChange);
        window.removeEventListener('wheel', this.onMouseWheel);
        // TODO: MutationObserver for content to refresh slide cache
    }


    public goTo(slide: number | string | WebSlide) {
        // TODO: refactor or replace with scroll manip. instead of slider approach.
        const target = this.getSlide(slide);
        const current = this.activeSlide;

        if (!target || this._isMoving) return;

        const isNext = this.index(target) > this.index(current);
        const direction = isNext ? 'down' : 'up';
        const siblingClass = isNext ? 'next' : 'prev';

        if (current === target) return;

        const eBefore = DOM.fireEvent(this, 'ws:beforechange', {
            currentSlide: current,
            targetSlide: target
        });

        if (!eBefore) return;

        this._isMoving = true;

        target.classList.add(siblingClass);
        target.offsetWidth; // force reflow

        target.classList.add(direction);
        current.classList.add(direction);

        DOM.once(target, DOM.getTransitionEvent(), () => {
            current.active = false;
            current.classList.remove(direction);

            target.classList.remove(direction);
            target.active = true;
            target.classList.remove(siblingClass);

            this._isMoving = false;

            this.onSlideChanged(target, current);
        });
    }
    public next() {
        this.goTo('$next');
    }
    public prev() {
        this.goTo('$prev');
    }

    public index(slide: WebSlide) {
        return this.slides.indexOf(slide);
    }
    public getSlide(slide: string | number | WebSlide): WebSlide {
        if (slide instanceof WebSlide) return slide;
        if (typeof slide === 'number') {
            return this.slides[slide];
        }
        if (slide === NEXT_SLIDE || slide === PREV_SLIDE) {
            const index = this.index(this.activeSlide);
            return this.getSlide(slide === NEXT_SLIDE ? index + 1 : index - 1);
        }
        if (typeof slide === 'string') {
            return this.slides.find((s) => s.route === slide);
        }

    }
    public get activeSlide() {
        return this.slides.find((slide) => slide.active);
    }
    public get activeIndex() { return this.index(this.activeSlide); }
    public get slides(): WebSlide[]{
        // TODO: cache, do grabSlides utill and use cache.
        return Array.from(this.childNodes).filter((child) => (child instanceof WebSlide)) as WebSlide[];
    }
    public get count() { return this.slides.length; }

    get bodyClass(): string {
        return this.getAttribute('body-class') || 'ws-ready';
    }


    private onWindowHashChange = () => {
        this.goTo(window.location.hash.substr(1));
    };
    private onSlideChanged = (current: WebSlide, from: WebSlide) => {
        window.location.hash = current.route;
        DOM.fireEvent(this, 'ws:changed', {
            currentSlide: current,
            prevSlide: from
        });
    };
    private onMouseWheel = (event: WheelEvent) => {
        if (this._isMoving) return;
        const {deltaY: wheelDeltaY} = event;

        if (Math.abs(wheelDeltaY) > 40) {
            if (wheelDeltaY > 0) {
                this.next();
            } else {
                this.prev();
            }
            event.preventDefault();
        }
    }
}

customElements.define(WebSlides.is, WebSlides);