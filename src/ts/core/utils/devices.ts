const ua = window.navigator.userAgent;

export class DeviceDetector {

    static isMobileIOS() {
        return /iPad|iPhone|iPod/i.test(ua);
    }

    static isMobileSafari = () => {
        return DeviceDetector.isMobileIOS() && /WebKit/i.test(ua) && /CriOS/i.test(ua);
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