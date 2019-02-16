export class WebSlide extends HTMLElement {
    static get is() { return 'web-slide'; }

    static get ACTIVE_CLASS() { return 'active'; }

    _index: number;

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('slide');
    }
    disconnectedCallback() {
    }

    get active() {
        return this.classList.contains(WebSlide.ACTIVE_CLASS);
    }
    set active(val: boolean) {
        this.classList.toggle(WebSlide.ACTIVE_CLASS, val);
    }

    get slideRoute() {
        return this.getAttribute('slide-route');
    }
    set slideRoute(routeName: string) {
        this.setAttribute('slide-route', routeName);
    }

    get slideTitle() {
        return this.getAttribute('slide-title');
    }
    set slideTitle(title: string) {
        this.setAttribute('slide-title', title);
    }

    get route() {
        const r = this.slideRoute;
        return r ? r : String(this.index + 1);
    }

    // TMP
    get index(): number {
        return this._index;
    }
    set index(i: number) {
        this._index = i;
    }
}