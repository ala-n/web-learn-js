import {WebSlides} from "./web-slides";

export abstract class WebSlidesPlugin {
    protected readonly ws: WebSlides;

    constructor(owner: WebSlides) {
        this.ws = owner;
    }

    abstract bind(): void;

    abstract destroy(): void;
}

export interface WSPluginConstructor {
    new(owner: WebSlides): WebSlidesPlugin;
}