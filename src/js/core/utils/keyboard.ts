import 'keyboardevent-key-polyfill';

export type KeyHandler = (event: KeyboardEvent, manager: KeyManager) => boolean | void;

export interface KeyMap {
  [key: string]: KeyHandler;
}

// TODO: doc, cleanup & optimize
export class KeyManager {
  constructor(private keyMap: KeyMap = {}, private predicate: KeyHandler = () => true ) {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.predicate(e, this)) return;

    const handler = this.keyMap[e.key];

    const prevent = !!handler && handler(e, this);

    prevent && e.preventDefault();
  };

  public on(key: string | string[], handler: KeyHandler) {
    if (Array.isArray(key)) {
      key.forEach((key) => this.on(key, handler));
    } else {
      this.keyMap[key] = handler;
    }
  }

  public destroy() {
    document.removeEventListener('keydown', this.onKeyDown);
  }
}

export default KeyManager;
