import {WebSlide} from './web-slide';

class WebSlides extends HTMLElement {

    static get is() { return 'web-slides'; }


    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('initialized');
        if (this.slides.length) {
            this.slides[0].active = true;
        }
    }
    disconnectedCallback() {

    }

    get activeSlide() {
        return this.slides.find((slide) => slide.active);
    }
    get slides(): WebSlide[]{
        return Array.from(this.childNodes).filter((child) => (child instanceof WebSlide)) as WebSlide[];
    }
}

customElements.define(WebSlides.is, WebSlides);