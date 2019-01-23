import {WebSlidesPlugin} from "../web-slides-plugin";
import {WebSlide} from "../web-slide";

export class WebSlidesMutationPlugin extends WebSlidesPlugin {
    private _contentObserver: MutationObserver;

    bind(): void {
        this._contentObserver = new MutationObserver(this.onContentMutation);
        this._contentObserver.observe(this.ws, {childList: true});
    }

    destroy(): void {
        this._contentObserver.disconnect();
    }

    private onContentMutation = (records: MutationRecord[]) => {
        const changed = records.some((r) => r.target instanceof WebSlide);
        if (changed) {
            this.ws.invalidateCaches();
        }
    };
}