import {NEXT_SLIDE, PREV_SLIDE, WebSlides} from '../web-slides';
import {html, render} from 'lit-html';
import {SlideEventType} from '../web-slide-event';

export class WebSlidesNavBar extends HTMLElement {
    static get is() { return 'web-slides-nav'; }

    private _owner: WebSlides;

    connectedCallback() {
        this._owner = document.querySelector(WebSlides.is) as WebSlides;
        if (this._owner) {
            this.render();
            this._owner.addEventListener(SlideEventType.CHANGED, this.onStateChanged);
            this.addEventListener('click', this.onClick);
        }
    }
    disconnectedCallback() {
        this._owner.removeEventListener(SlideEventType.CHANGED, this.onStateChanged);
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

    render() {
        const count = this._owner.count;
        const activeSlide = this._owner.activeSlide;
        const activeIndex = activeSlide ? (activeSlide.index + 1) : 0;
        render(html`
            <a href="@prev" title="Previous slide" class="nav-item arrow-prev">↑</a>
            <a href="@menu" title="View all slides" class="nav-item counter-link">${activeIndex} / ${count}</a>
            <a href="@next" title="Next slide" class="nav-item arrow-next">↓</a>
        `, this);
    }
}