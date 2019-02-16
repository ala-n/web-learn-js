import {WebSlides} from '../web-slides';
import {html, render} from 'lit-html';
import {SlideEventType} from '../web-slide-event';

interface SlideLink {
    title: string;
    active: boolean;
    link: string;
}

export class WebSlidesNavMenu extends HTMLElement {
    static get is() { return 'web-slides-nav-menu'; }

    private _owner: WebSlides;

    connectedCallback() {
        this._owner = document.querySelector(WebSlides.is) as WebSlides;
        if (this._owner) {
            this.render();
            this.addEventListener('click', () => document.body.classList.remove('menu'));
            this._owner.addEventListener(SlideEventType.CHANGED, this.onStateChanged);
        }
    }
    disconnectedCallback() {
        this._owner.removeEventListener(SlideEventType.CHANGED, this.onStateChanged);
    }

    private onStateChanged = () => {
        this.render();
    };

    render() {
        const allLinks: SlideLink[] = this._owner.slides.map((slide) => ({
            link: '#' + slide.route,
            title: slide.slideTitle,
            active: slide.active
        }));
        const links = WebSlidesNavMenu.filter(allLinks);

        render(html`
            <ul class="ws-nav-list">
                ${links.map((item) => html`
                    <li class="ws-nav-item ${item.active ? 'active' : ''}"><a href="${item.link}">${item.title}</a></li>
                `)}
            </ul>
        `, this);
    }

    private static filter(allLinks:SlideLink[]): SlideLink[]{
        const links: SlideLink[] = [];
        const empty = {title: '', link: '', active: false};
        allLinks.forEach((link) => {
            const prev:SlideLink = links[links.length - 1] || empty;
            if (link.title && prev.title !== link.title) {
                links.push(link);
            } else {
                prev.active = prev.active || link.active;
            }
        });
        return links;
    }
}