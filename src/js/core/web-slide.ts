export class WebSlide extends HTMLElement {
    public static get is() { return 'web-slide'; }

    public static get ACTIVE_CLASS() { return 'active'; }

    _index: number;

    constructor() {
        super();
    }

    public connectedCallback() {
        this.classList.add('slide');
    }
    public disconnectedCallback() {

    }

    public get active() {
        return this.classList.contains(WebSlide.ACTIVE_CLASS);
    }
    public set active(val: boolean) {
        this.classList.toggle(WebSlide.ACTIVE_CLASS, val);
    }

    public get slideRoute() {
        return this.getAttribute('slide-route');
    }
    public set slideRoute(routeName: string) {
        this.setAttribute('slide-route', routeName);
    }

    public get slideTitle() {
        return this.getAttribute('slide-title');
    }
    public set slideTitle(title: string) {
        this.setAttribute('slide-title', title);
    }

    public get route() {
        const r = this.slideRoute;
        return r ? r : String(this.index + 1);
    }

    // TMP
    public get index() : number {
        return this._index;
    }
    public set index(i: number) {
        this._index = i;
    }
}

customElements.define(WebSlide.is, WebSlide, {
    extends: 'section'
});