const ua = window.navigator.userAgent;

export class DeviceDetector {

    static isMobileIOS() {
        return /iPad|iPhone|iPod/i.test(ua);
    }

    static isMobileSafari = () => {
        return DeviceDetector.isMobileIOS() && /WebKit/i.test(ua) && /CriOS/i.test(ua);
    };

    /** Detects print emulation */
    static isPrint = () => {
        return window.matchMedia('print').matches;
    };

    static isAndroid() {
        return /Android/i.test(ua);
    }

    static isMobile() {
        return DeviceDetector.isMobileIOS() ||
            DeviceDetector.isAndroid() ||
            /webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isTouchDevice() {
        return 'ontouchstart' in document.documentElement ||
            // @ts-ignore
            navigator.MaxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0;
    }
}