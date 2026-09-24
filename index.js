/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import Store from './src/redux/Store';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './src/services/playbackService';
import mobileAds from 'react-native-google-mobile-ads';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

mobileAds()
  .initialize()
  .then(adapterStatuses => {
    console.log('Mobile Ads Initialized', adapterStatuses);
  });


const WemuApp = () => {
    return (
        <Provider store={Store}>
            <App />
        </Provider>
    );
};

AppRegistry.registerComponent(appName, () => WemuApp);
TrackPlayer.registerPlaybackService(() => playbackService);

