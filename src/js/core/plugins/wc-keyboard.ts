import {WebSlidesPlugin} from "../web-slides";
import KeyManager from "../utils/keyboard";

export class WebSlidesKeyboardPlugin extends WebSlidesPlugin {
    private _keyManager: KeyManager;

    bind(): void {
        // TODO: cleanup / optimize
        this._keyManager = new KeyManager();
        this._keyManager.on('ArrowUp', () => this.ws.prev());
        this._keyManager.on('ArrowDown', () => this.ws.next());
    }

    destroy(): void {
        this._keyManager.destroy();
    }
}