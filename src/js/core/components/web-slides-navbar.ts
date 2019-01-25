import {WebSlides} from "../web-slides";
import {html, render} from 'lit-html';

export class WebSlidesNavBar extends HTMLElement {
    public static get is() { return 'web-slides-nav'; }

    private _owner: WebSlides;

    constructor() {
        super();
    }

    public connectedCallback() {
        this._owner = this.closest(WebSlides.is) as WebSlides;
        if (this._owner) {
            this.render();
            this._owner.addEventListener('ws:changed', this.onStateChanged);
        }
    }
    public disconnectedCallback() {
        this._owner.removeEventListener('ws:changed', this.onStateChanged);
    }

    private onStateChanged = () => {
        this.render();
    };

    public render() {
        const count = this._owner.count;
        const activeSlide = this._owner.activeSlide;
        const activeIndex = activeSlide ? (activeSlide.index + 1) : 0;
        render(html`
            <a is="ws-route-link" href="#next" title="Arrow Keys" class="arrow-next">↓</a>
            <a is="ws-route-link" href="#prev" title="Arrow Keys" class="arrow-prev">↑</a>
            <span class="counter">
              <a href="#landing" title="View all slides" class="counter-link">${activeIndex} / ${count}</a>
            </span>
        `, this);
    }
}