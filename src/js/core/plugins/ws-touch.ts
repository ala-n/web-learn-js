import {WebSlidesPlugin} from "../web-slides";

export class WebSlidesTouchPlugin extends WebSlidesPlugin {
    private _touchManager: HammerManager;

    bind(): void {
        this._touchManager = new Hammer.Manager(this.ws);
        this._touchManager.add(new Hammer.Swipe());
        this._touchManager.on('swipeup', () => this.ws.next());
        this._touchManager.on('swipedown', () => this.ws.prev());
    }

    destroy(): void {
        this._touchManager.destroy();
    }
}