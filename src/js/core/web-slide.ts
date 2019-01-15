export class WebSlide extends HTMLElement {
    public static get is() { return 'web-slide'; }

    public static get ACTIVE_CLASS() { return 'current'; }

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
}

customElements.define(WebSlide.is, WebSlide, {
    extends: 'section'
});