import {WebSlides} from "../web-slides";
import {html, render} from 'lit-html';

export class WebSlidesNavbar extends HTMLElement {
    public static get is() { return 'web-slides-nav'; }

    private _owner: WebSlides;

    constructor() {
        super();
    }

    public connectedCallback() {
        this._owner = this.closest(WebSlides.is) as WebSlides;
        this.render();

        this._owner.addEventListener('ws:changed', this.onStateChanged);
    }
    public disconnectedCallback() {
        this._owner.removeEventListener('ws:changed', this.onStateChanged);
    }

    private onStateChanged = () => {
        this.render();
    };

    public render() {
        render(html`
            <a is="ws-route-link" href="#next" title="Arrow Keys" class="arrow-next">↓</a>
            <a is="ws-route-link" href="#prev" title="Arrow Keys" class="arrow-prev">↑</a>
            <span class="counter">
              <a href="#${this._owner.activeIndex + 1}" title="View all slides" class="counter-link">${this._owner.activeIndex + 1} / ${this._owner.count}</a>
            </span>
        `, this);
    }
}

customElements.define(WebSlidesNavbar.is, WebSlidesNavbar);