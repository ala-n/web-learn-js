import {WebSlidesPlugin} from "../web-slides-plugin";
import KeyboardManager from "../utils/keyboard";
import DOM from "../utils/dom";

export class WebSlidesKeyboardPlugin extends WebSlidesPlugin {
    private _keyManager: KeyboardManager;

    bind(): void {
        this._keyManager = new KeyboardManager(() => !DOM.isFocusableElement(document.activeElement));

        this._keyManager.on(['ArrowUp', ' +Shift'], () => this.ws.prev());
        this._keyManager.on(['ArrowDown', ' '], () => this.ws.next());
        this._keyManager.on(['Home', 'PageUp'], () => this.ws.goTo(0));
        this._keyManager.on(['End', 'PageDown'], () => this.ws.goTo(this.ws.count - 1));
    }

    destroy(): void {
        this._keyManager.destroy();
    }
}