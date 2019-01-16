import {WebSlide} from './web-slide';
import DOM from "./utils/dom";

export class WebSlides extends HTMLElement {

    static get is() { return 'web-slides'; }

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.slides.length) {
            this.slides[0].active = true;
        }

        this.setAttribute('ready','');
        document.documentElement.classList.add(this.bodyClass);

        // TODO: MutationObserver for content to refresh slide cache
    }
    disconnectedCallback() {
        // TODO: unbind
    }

    public goTo(slide: number | string | WebSlide) {
        // TODO: refactor or replace with scroll manip. instead of slider approach.
        const target = this.getSlide(slide);
        const current = this.activeSlide;

        if (!target) return;

        const isNext = this.index(target) > this.index(current);
        const direction = isNext ? 'down' : 'up';
        const siblingClass = isNext ? 'next' : 'prev';

        if (current === target) return;

        const eBefore = DOM.fireEvent(this, 'ws:beforechange', {
            currentSlide: current,
            targetSlide: target
        });

        if (!eBefore) return;

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

            DOM.fireEvent(this, 'ws:changed', {
                currentSlide: target,
                prevSlide: current
            });
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
        if (slide === 'next' || slide === 'prev') {
            const index = this.index(this.activeSlide);
            return this.getSlide(slide === 'next' ? index + 1 : index - 1);
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
}

customElements.define(WebSlides.is, WebSlides);