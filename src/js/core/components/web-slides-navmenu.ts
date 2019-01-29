import {WebSlides} from "../web-slides";
import {html, render} from 'lit-html';
import {SlideEventType} from "../web-slide-event";

export class WebSlidesNavMenu extends HTMLElement {
    public static get is() { return 'web-slides-nav-menu'; }

    private _owner: WebSlides;

    public connectedCallback() {
        this._owner = document.querySelector(WebSlides.is) as WebSlides;
        if (this._owner) {
            this.render();
            this._owner.addEventListener(SlideEventType.CHANGED, this.onStateChanged);
        }
    }
    public disconnectedCallback() {
        this._owner.removeEventListener(SlideEventType.CHANGED, this.onStateChanged);
    }

    private onStateChanged = () => {
        this.render();
    };

    public render() {
        const menuList = this._owner.slides.map((slide) => ({
            link: '#' + slide.route,
            title: slide.slideTitle,
            active: slide.active
        })).filter((item) => item.title);
        render(html`
            <ul class="ws-nav-list">
                ${menuList.map((item) => html`
                    <li class="ws-nav-item ${item.active ? 'active' : ''}"><a href="${item.link}">${item.title}</a></li>
                `)}
            </ul>
        `, this);
    }
}