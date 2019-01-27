import DOM from "./utils/dom";
import {WebSlide} from './web-slide';
import {WebSlideChangeEvent} from "./web-slide-event";
import {WebSlidesPlugin, WSPluginConstructor} from "./web-slides-plugin";

export const NEXT_SLIDE = '@next';
export const PREV_SLIDE = '@prev';

const pluginRegistry : {[key: string]: WSPluginConstructor} = {};
export class WebSlides extends HTMLElement {

    static get is() { return 'web-slides'; }

    private _isMoving = false;
    private _slidesCache: WebSlide[];
    private _plugins: {[key: string]: WebSlidesPlugin};

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.slides.length) {
            this.slides[0].active = true;
        }

        this.setAttribute('ready','');
        document.documentElement.classList.add(this.bodyClass);

        this._initPlugins();
        this._bindListeners();
    }
    disconnectedCallback() {
        this._unbindListeners();
    }

    private _initPlugins() {
        this._plugins = {};
        Object.keys(pluginRegistry).forEach((pluginName) => {
            const Construct = pluginRegistry[pluginName];
            this._plugins[pluginName] = new Construct(this);
        });
    }

    private _bindListeners() {
        Object.values(this._plugins).forEach((plugin) => plugin.bind());
    }
    private _unbindListeners() {
        Object.values(this._plugins).forEach((plugin) => plugin.bind());
    }

    public goTo(slide: number | string | WebSlide) {
        const target = this.getSlide(slide);
        const current = this.activeSlide;

        if (!target || this._isMoving) return;

        const isNext = target.index > current.index;
        const direction = isNext ? 'down' : 'up';
        const siblingClass = isNext ? 'next' : 'prev';

        if (current === target) return;

        const eBefore = WebSlideChangeEvent.dispatch(this, 'ws:beforechange', current, target);
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

            WebSlideChangeEvent.dispatch(this, 'ws:changed', target, current);
        });
    }
    public next() {
        this.goTo(NEXT_SLIDE);
    }
    public prev() {
        this.goTo(PREV_SLIDE);
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

    public get disabled() { return false; } //TODO
    public get isMoving() { return this._isMoving; }

    public isScrollTop(tolerance = 5) {
        return this.scrollTop < tolerance;
    }
    public isScrollBottom(tolerance = 5) {
        return this.scrollHeight - (this.scrollTop + this.clientHeight) < tolerance;
    }

    public flush() {
        this._slidesCache = null;
        // TODO: fire statechange event
    }

    // Simple getters/setters
    get bodyClass(): string {
        return this.getAttribute('body-class') || 'ws-ready';
    }

    // Global Config
    public static registerPlugin(pluginName: string, plugin: WSPluginConstructor) {
        pluginRegistry[pluginName] = plugin;
    }
}