// Strict Polyfills
import './polyfills/closest';
// Bundle
import {WebSlides} from "./web-slides";
import {WebSlidesHashPlugin} from "./plugins/ws-hash";
import {WebSlidesMouseWheelPlugin} from "./plugins/ws-mousewheel";
import {WebSlidesKeyboardPlugin} from "./plugins/wc-keyboard";
import {WebSlidesMutationPlugin} from "./plugins/ws-mutation";
import {WebSlidesTouchPlugin} from "./plugins/ws-touch";
import {WebSlidesNavBar} from "./components/web-slides-navbar";
import {WebSlideRouteLink} from "./components/web-slides-route-link";
import {DeviceDetector} from "./utils/devices";
import {WebSlide} from "./web-slide";

// Register Core Plugins
WebSlides.registerPlugin('hash', WebSlidesHashPlugin);
if (!DeviceDetector.isMobile()) {
    WebSlides.registerPlugin('wheel', WebSlidesMouseWheelPlugin);
    WebSlides.registerPlugin('keyboard', WebSlidesKeyboardPlugin);
}
if (DeviceDetector.isTouchDevice()) {
    WebSlides.registerPlugin('touch', WebSlidesTouchPlugin);
}
WebSlides.registerPlugin('mutation', WebSlidesMutationPlugin);

// Register Core Components
customElements.define(WebSlide.is, WebSlide);
customElements.whenDefined(WebSlide.is).then(() => {
    customElements.define(WebSlides.is, WebSlides);
});
// Register add
customElements.whenDefined(WebSlides.is).then(() => {
    customElements.define(WebSlidesNavBar.is, WebSlidesNavBar);
    customElements.define(WebSlideRouteLink.is, WebSlideRouteLink, {
        extends: 'a'
    });
});
