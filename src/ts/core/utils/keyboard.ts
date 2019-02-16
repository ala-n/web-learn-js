import 'keyboardevent-key-polyfill';

export type KeyHandler = (event: KeyboardEvent, manager: KeyboardManager) => boolean | void;

interface KeyMap {
  [key: string]: KeyHandler;
}

export class KeyboardManager {
  private keyMap: KeyMap = {};

  constructor(
      private predicate: KeyHandler = () => true
  ) {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  on(keys: string | string[], handler: KeyHandler) {
    if (Array.isArray(keys)) {
      keys.forEach((key) => this.on(key, handler));
    } else {
      this.keyMap[KeyboardManager.sanitizeKey(keys)] = handler;
    }
  }

  destroy() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.predicate(e, this)) return;

    const handler = this.keyMap[KeyboardManager.getKeycmd(e)];

    if (handler) {
      !handler(e, this) && e.preventDefault();
    }
  };

  private static getKeycmd(e: KeyboardEvent) {
    const keys = [e.key];
    (e.altKey && keys.indexOf('Alt') === -1) && keys.push('Alt');
    (e.ctrlKey && keys.indexOf('Control') === -1) && keys.push('Control');
    (e.shiftKey && keys.indexOf('Shift') === -1) && keys.push('Shift');
    keys.sort();
    return keys.join('+');
  }
  private static sanitizeKey(key: string) {
    const parts = key.split('+');
    parts.sort();
    return parts.join('+');
  }
}

export default KeyboardManager;
