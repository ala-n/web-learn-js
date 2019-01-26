import {NEXT_SLIDE, PREV_SLIDE, WebSlides} from "../web-slides";
import {html, render} from 'lit-html';

export class WebSlidesNavBar extends HTMLElement {
    public static get is() { return 'web-slides-nav'; }

    private _owner: WebSlides;

    public connectedCallback() {
        this._owner = document.querySelector(WebSlides.is) as WebSlides;
        if (this._owner) {
            this.render();
            this._owner.addEventListener('ws:changed', this.onStateChanged);
            this.addEventListener('click', this.onClick);
        }
    }
    public disconnectedCallback() {
        this._owner.removeEventListener('ws:changed', this.onStateChanged);
        this.removeEventListener('click', this.onClick);
    }

    private onStateChanged = () => {
        this.render();
    };
    private onClick = (e: MouseEvent) => {
        const target = (e.target as Element).closest('a');
        if (target && (target instanceof HTMLAnchorElement)) {
            const href = target.getAttribute('href');
            if ([NEXT_SLIDE, PREV_SLIDE].indexOf(href) !== -1) {
                this._owner.goTo(href);
                e.preventDefault();
                e.stopPropagation();
            }
            if ('@menu' === href) {
                document.body.classList.toggle('menu');
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };

    public render() {
        const count = this._owner.count;
        const activeSlide = this._owner.activeSlide;
        const activeIndex = activeSlide ? (activeSlide.index + 1) : 0;
        render(html`
            <a href="@next" title="Arrow Keys" class="arrow-next">↓</a>
            <a href="@prev" title="Arrow Keys" class="arrow-prev">↑</a>
            
            <span class="counter">
              <a href="@menu" title="View all slides" class="counter-link">${activeIndex} / ${count}</a>
            </span>
        `, this);
    }
}