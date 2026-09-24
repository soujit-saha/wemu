import { useEffect, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// Use Test ID in development, and actual Ad Unit ID in production
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-7682293002309363/6619440666';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
});

export const useInterstitialAd = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setLoaded(true);
        });

        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            setLoaded(false);
            // Preload the next ad once the current one is closed
            interstitial.load();
        });

        const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
            console.error('Interstitial Ad failed to load: ', error);
            setLoaded(false);
        });

        // Start loading the interstitial straight away
        interstitial.load();

        return () => {
            unsubscribeLoaded();
            unsubscribeClosed();
            unsubscribeError();
        };
    }, []);

    const showAd = () => {
        if (loaded) {
            interstitial.show();
        } else {
            console.log('Interstitial Ad is not ready yet.');
        }
    };

    return { loaded, showAd };
};
