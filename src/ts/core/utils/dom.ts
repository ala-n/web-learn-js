
let transitionEvent = '';
/**
 * Static class for DOM helper.
 */
export default class DOM {
    /**
     * Listens for an event once.
     * @param {Element} el Element to listen to.
     * @param {string} event Event Type.
     * @param {Function} callback Function to execute once the event fires.
     */
    static once(el: HTMLElement, event: string, callback: (e: Event) => void) {
        const cb = (e: Event) => {
            if (e.target === el) {
                el.removeEventListener(event, cb);
                callback(e);
            }
        };
        el.addEventListener(event, cb, false);
    }

    /**
     * @return {boolean} Whether the element is an input or content
     * editable.
     */
    static isFocusableElement(element: Element) {
        if ( !element ) return false;
        if (['INPUT', 'SELECT', 'OPTION', 'TEXTAREA'].indexOf(element.tagName) > -1) return true;

        return element instanceof HTMLElement &&
            element.contentEditable !== 'inherit' &&
            element.contentEditable !== undefined;
    }

    /**
     * Checks if the element is visible.
     * @param {Element} el Element to check.
     * @return {boolean}
     */
    static isVisible(el: HTMLElement) {
        return (el.offsetParent !== null);
    }

    /**
     * Fires a custom event on the given target.
     * @param {Element} target The target of the event.
     * @param {string} eventType The event type.
     * @param {Object} eventInfo Optional parameter to provide additional data
     * to the event.
     * @return {boolean} true if either event's cancelable attribute value is false
     * or its preventDefault() method was not invoked, and false otherwise.
     */
    static fireEvent(target: HTMLElement, eventType: string, eventInfo = {}) {
        const event = new CustomEvent(eventType, {
            detail: eventInfo,
            bubbles: true
        });

        return target.dispatchEvent(event);
    }

    /**
     * Gets the integer value of a style property.
     * @param {string} prop CSS property value.
     * @return {Number} The property without the units.
     */
    static parseSize(prop: string) {
        return Number(prop.replace(/[^\d\.]/g, ''));
    }

    /**
     * Wraps a HTML structure around an element.
     * @param {Element} elem the element to be wrapped.
     * @param {string} tag the new element tag.
     * @return {Element} the new element.
     */
    static wrap(elem: HTMLElement, tag: string) {
        const wrap = document.createElement(tag);
        elem.parentElement.insertBefore(wrap, elem);
        wrap.appendChild(elem);

        return wrap;
    }

    /**
     * Inserts and element after another element.
     * @param {Element} elem the element to be inserted.
     * @param {Element} target the element to be inserted after.
     */
    static after(elem: HTMLElement, target: HTMLElement) {
        const parent = target.parentNode;

        if (parent.lastChild === target) {
            parent.appendChild(elem);
        } else {
            parent.insertBefore(elem, target.nextSibling);
        }
    }

    /**
     * Gets the prefixed transitionend event.
     * @param {?Element} optEl Element to check
     * @return {string}
     */
    static getTransitionEvent(): string {
        if (transitionEvent) {
            return transitionEvent;
        }

        transitionEvent = '';

        const el = document.createElement('ws-test') as HTMLElement;
        const transitions: {
            [index: string]: string;
        } = {
            transition: 'transitionend',
            OTransition: 'oTransitionEnd',
            MozTransition: 'transitionend',
            WebkitTransition: 'webkitTransitionEnd'
        };
        Object.keys(transitions).some((transitionName) => {
            // @ts-ignore
            if (el.style[transitionName] !== undefined) {
                transitionEvent  = transitions[transitionName];
            }
            return !!transitionEvent;
        });

        return transitionEvent;
    }

}
