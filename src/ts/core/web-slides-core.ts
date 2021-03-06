// Strict Polyfills
import './polyfills/closest';
// Bundle
import {DeviceDetector} from './utils/devices';

import {WebSlide} from './web-slide';
import {WebSlides} from './web-slides';

import {WebSlidesHashPlugin} from './plugins/ws-hash';
import {WebSlidesMouseWheelPlugin} from './plugins/ws-mousewheel';
import {WebSlidesKeyboardPlugin} from './plugins/wc-keyboard';
import {WebSlidesMutationPlugin} from './plugins/ws-mutation';
import {WebSlidesTouchPlugin} from './plugins/ws-touch';
import {WebSlidesTouchHelpPlugin} from './plugins/ws-touch-help';

import {WebSlidesNavBar} from './components/web-slides-navbar';
import {WebSlidesNavMenu} from './components/web-slides-navmenu';

if (!DeviceDetector.isPrint()) {
    // Register Core Plugins
    WebSlides.registerPlugin('hash', WebSlidesHashPlugin);
    if (!DeviceDetector.isMobile()) {
        WebSlides.registerPlugin('wheel', WebSlidesMouseWheelPlugin);
        WebSlides.registerPlugin('keyboard', WebSlidesKeyboardPlugin);
    }
    WebSlides.registerPlugin('touch', WebSlidesTouchPlugin);
    WebSlides.registerPlugin('touch-help', WebSlidesTouchHelpPlugin);
    WebSlides.registerPlugin('mutation', WebSlidesMutationPlugin);

// Register Core Components
    customElements.define(WebSlide.is, WebSlide);
    customElements.whenDefined(WebSlide.is).then(() => {
        customElements.define(WebSlides.is, WebSlides);
    });
// Register add
    customElements.whenDefined(WebSlides.is).then(() => {
        customElements.define(WebSlidesNavBar.is, WebSlidesNavBar);
        customElements.define(WebSlidesNavMenu.is, WebSlidesNavMenu);
    });
}