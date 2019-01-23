import {WebSlides} from "./web-slides";
import {WebSlidesHashPlugin} from "./plugins/ws-hash";
import {WebSlidesMouseWheelPlugin} from "./plugins/ws-mousewheel";
import {WebSlidesKeyboardPlugin} from "./plugins/wc-keyboard";
import {WebSlidesMutationPlugin} from "./plugins/ws-mutation";
import {WebSlidesTouchPlugin} from "./plugins/ws-touch";
import {WebSlidesNavbar} from "./components/web-slides-navbar";
import {WebSlideRouteLink} from "./components/web-slides-route-link";

// Register Core Plugins
WebSlides.registerPlugin('hash', WebSlidesHashPlugin);
WebSlides.registerPlugin('wheel', WebSlidesMouseWheelPlugin); // TODO: Add Device Detection
WebSlides.registerPlugin('touch', WebSlidesTouchPlugin);
WebSlides.registerPlugin('keyboard', WebSlidesKeyboardPlugin); // TODO: Add Device Detection
WebSlides.registerPlugin('mutation', WebSlidesMutationPlugin); // TODO: Possibly can be disabled cause still have no real case

// Register Core Components
customElements.define(WebSlides.is, WebSlides);
customElements.define(WebSlidesNavbar.is, WebSlidesNavbar);
customElements.define(WebSlideRouteLink.is, WebSlideRouteLink, {
    extends: 'a'
});