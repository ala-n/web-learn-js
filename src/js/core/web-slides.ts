import {WebSlide} from './web-slide';
import DOM from "./utils/dom";

export const NEXT_SLIDE = '$next';
export const PREV_SLIDE = '$prev';

export class WebSlides extends HTMLElement {

    static get is() { return 'web-slides'; }

    private _isMoving = false;
    private _slidesCache: WebSlide[];
    private _contentObserver: MutationObserver;

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

        this.onWindowHashChange();
    }
    disconnectedCallback() {
        this._unbindListeners();
    }

    private _bindListeners() {
        window.addEventListener('hashchange', this.onWindowHashChange);
        window.addEventListener('wheel', this.onMouseWheel);

        this._contentObserver = new MutationObserver(this.onContentMutation);
        this._contentObserver.observe(this, {childList: true});
    }
    private _unbindListeners() {
        window.removeEventListener('hashchange', this.onWindowHashChange);
        window.removeEventListener('wheel', this.onMouseWheel);

        this._contentObserver.disconnect();
    }

    public goTo(slide: number | string | WebSlide) {
        const target = this.getSlide(slide);
        const current = this.activeSlide;

        if (!target || this._isMoving) return;

        const isNext = target.index > current.index;
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

    public get activeSlide() {
        return this.slides.find((slide) => slide.active);
    }

    public getSlide(slide: string | number | WebSlide): WebSlide {
        if (slide instanceof WebSlide) return slide;
        if (typeof slide === 'number') {
            return this.slides[slide];
        }
        if (slide === NEXT_SLIDE || slide === PREV_SLIDE) {
            const index = this.activeSlide.index;
            return this.getSlide(slide === NEXT_SLIDE ? index + 1 : index - 1);
        }
        if (typeof slide === 'string') {
            return this.slides.find((s) => s.route === slide);
        }

    }

    public get count() {
        return this.slides.length;
    }
    public get slides(): WebSlide[] {
        if (!this._slidesCache) {
            const childNodes = Array.from(this.childNodes);
            this._slidesCache = childNodes.filter((child) => (child instanceof WebSlide)) as WebSlide[];
            this._slidesCache.forEach((slide, index) => {
               slide.index = index;
            });
        }
        return this._slidesCache;
    }

    public invalidateCaches() {
        this._slidesCache = null;
        // TODO: fire statechange event
    }

    public get isTopScroll() {
        return this.scrollTop < 10;
    }
    public get isBottomScroll() {
        return this.scrollHeight - (this.scrollTop + this.clientHeight) < 10;
    }

    // Listeners
    private onWindowHashChange = () => {
        let hash = window.location.hash.substr(1);
        this.goTo(isNaN(+hash) ? hash : (+hash - 1));
    };
    private onSlideChanged = (current: WebSlide, from: WebSlide) => {
        WebSlides.updateHash(current);
        DOM.fireEvent(this, 'ws:changed', {
            currentSlide: current,
            prevSlide: from
        });
    };
    private onMouseWheel = (event: WheelEvent) => {
        if (this._isMoving) return;
        const {deltaY: wheelDelta} = event;
        const goNext = wheelDelta > 0;

        if (Math.abs(wheelDelta) > 40) {
            if (goNext && this.isBottomScroll) {
                this.next();
                event.preventDefault();
            }
            if (!goNext && this.isTopScroll){
                this.prev();
                event.preventDefault();
            }
        }
    };
    private onContentMutation = (records: MutationRecord[]) => {
        const changed = records.some((r) => r.target instanceof WebSlide);
        if (changed) {
            this.invalidateCaches();
        }
    };

    // Simple getters/setters
    get bodyClass(): string {
        return this.getAttribute('body-class') || 'ws-ready';
    }

    public static updateHash(slide: WebSlide) {
        history.pushState({
            slideRoute: slide.route
        }, `Slide ${slide.title}`, `#${slide.route}`);
    }
}

customElements.define(WebSlides.is, WebSlides);