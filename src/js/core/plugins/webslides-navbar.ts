import {WebSlides} from "../web-slides";
import {html, render} from 'lit-html';

export class WebSlidesNavbar extends HTMLElement {
    public static get is() { return 'web-slides-nav'; }

    public static get ACTIVE_CLASS() { return 'active'; }

    private _owner: WebSlides;

    constructor() {
        super();
    }

    public connectedCallback() {
        this._owner = this.closest(WebSlides.is) as WebSlides;
        this.render();

        this._owner.addEventListener('ws:changed', () => this.render());// TODO: removable listener
    }
    public disconnectedCallback() {
    }

    public render() {
        render(html`
            <a is="ws-route-link" href="#next" title="Arrow Keys" class="arrow-next">↓</a>
            <a is="ws-route-link" href="#prev" title="Arrow Keys" class="arrow-prev">↑</a>
            <span class="counter">
              <a href="#${this._owner.activeIndex}" title="View all slides" class="counter-link">${this._owner.activeIndex + 1} / ${this._owner.count}</a>
            </span>
        `, this);
    }
}

customElements.define(WebSlidesNavbar.is, WebSlidesNavbar);