import {simpleSequence} from "./utils/uiid";

const slideIDSequence = simpleSequence(1);

export class WebSlide extends HTMLElement {
    public static get is() { return 'web-slide'; }

    public static get ACTIVE_CLASS() { return 'active'; }

    constructor() {
        super();
    }

    public connectedCallback() {
        this.classList.add('slide');
        if (!this.route) {
            this.route = String(slideIDSequence.next().value);
        }
    }
    public disconnectedCallback() {

    }

    public get active() {
        return this.classList.contains(WebSlide.ACTIVE_CLASS);
    }
    public set active(val: boolean) {
        this.classList.toggle(WebSlide.ACTIVE_CLASS, val);
    }

    public get route() {
        return this.getAttribute('route');
    }
    public set route(routeName: string) {
        this.setAttribute('route', routeName);
    }
}

customElements.define(WebSlide.is, WebSlide, {
    extends: 'section'
});