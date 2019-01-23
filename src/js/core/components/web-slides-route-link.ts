import {WebSlides} from "../web-slides";

export class WebSlideRouteLink extends HTMLAnchorElement {
    public static get is() { return 'ws-route-link'; }

    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }

    public connectedCallback() {
        this.addEventListener('click', this._onClick);
    }
    public disconnectedCallback() {
        this.removeEventListener('click', this._onClick)
    }

    _onClick(e: Event) {
        // TODO ref/optimize
        e.preventDefault();
        e.stopPropagation();

        let href = this.getAttribute('href');
        href = href.replace('#next', '$next');
        href = href.replace('#prev', '$prev');
        (document.querySelector(WebSlides.is) as WebSlides).goTo(href);
    };
}