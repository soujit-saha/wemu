import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Modal,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import ToastAlert from '../../utils/helper/Toast';

const Offline = ({ navigation }: any) => {
  const isScreen = !!navigation;
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!isScreen) {
      const unsubscribe = NetInfo.addEventListener(state => {
        // Only trigger offline modal if connectivity is explicitly false
        setIsOffline(state.isConnected === false);
      });
      return () => unsubscribe();
    }
  }, [isScreen]);

  const handleGoOnline = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setIsOffline(false);
        ToastAlert('Back online!');
        if (isScreen && navigation.canGoBack()) {
          navigation.goBack();
        }
      } else {
        ToastAlert('Opening network settings to connect...');
        if (Platform.OS === 'android') {
          Linking.sendIntent('android.settings.panel.action.INTERNET_CONNECTIVITY').catch(() => {
            Linking.sendIntent('android.settings.WIRELESS_SETTINGS').catch(() => {
              ToastAlert('Please enable Wi-Fi or Mobile Data manually.');
            });
          });
        } else {
          Linking.openURL('App-Prefs:root=WIFI').catch(() => {
            Linking.openURL('app-settings:').catch(() => {
              ToastAlert('Please enable Wi-Fi or Mobile Data manually.');
            });
          });
        }
      }
    });
  };

  const renderContent = () => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Offline Mode</Text>
        </View>

        {/* Main Content Area */}
        <View style={styles.contentContainer}>
          {/* Airplane Icon */}
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: 'https://img.icons8.com/ios-filled/150/000000/airplane.png' }}
              style={styles.airplaneIcon}
            />
          </View>

          {/* Status Texts */}
          <Text style={styles.titleText}>You're in Offline Mode</Text>
          <Text style={styles.subtitleText}>Enjoy your downloaded music</Text>

          {/* Go Online Button */}
          <TouchableOpacity
            style={styles.goOnlineButton}
            activeOpacity={0.8}
            onPress={handleGoOnline}
          >
            <Text style={styles.goOnlineText}>Go Online</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Floating Mini Player Card */}
        <View style={styles.playerCardContainer}>
          <LinearGradient
            colors={[COLORS.playGradientStart, COLORS.playGradientMiddle, COLORS.playGradientEnd]}
            style={styles.playerCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {/* Album Artwork */}
            <Image
              source={{ uri: 'https://picsum.photos/200/200?random=108' }}
              style={styles.albumArt}
            />

            {/* Track and Artist Metadata */}
            <View style={styles.metadataContainer}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                Blinding Lights
              </Text>
              <Text style={styles.artistName} numberOfLines={1}>
                The Weeknd
              </Text>
            </View>

            {/* Skip Next Play Control Button */}
            <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
              <Image
                source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/end.png' }}
                style={styles.playIcon}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    );
  };

  if (isScreen) {
    return renderContent();
  }

  return (
    <Modal
      visible={isOffline}
      animationType="slide"
      transparent={false}
      onRequestClose={() => {
        if (!isOffline) {
          setIsOffline(false);
        }
      }}
    >
      {renderContent()}
    </Modal>
  );
};

export default Offline;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: ms(56),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#000000',
    includeFontPadding: false,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: ms(100),
  },
  iconContainer: {
    width: ms(140),
    height: ms(140),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(40),
  },
  airplaneIcon: {
    width: ms(84),
    height: ms(84),
    resizeMode: 'contain',
    tintColor: COLORS.Primary,
  },
  titleText: {
    fontFamily: FONTS.bold28,
    fontSize: ms(20),
    color: '#111827',
    textAlign: 'center',
    includeFontPadding: false,
  },
  subtitleText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(15),
    color: '#6B7280',
    textAlign: 'center',
    marginTop: ms(10),
    includeFontPadding: false,
  },
  goOnlineButton: {
    backgroundColor: COLORS.Primary,
    paddingHorizontal: ms(40),
    height: ms(48),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ms(44),
    shadowColor: COLORS.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  goOnlineText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(15),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  playerCardContainer: {
    position: 'absolute',
    bottom: ms(24),
    left: ms(24),
    right: ms(24),
    borderRadius: ms(16),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  playerCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(12),
    height: ms(72),
  },
  albumArt: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(8),
    resizeMode: 'cover',
  },
  metadataContainer: {
    flex: 1,
    marginLeft: ms(14),
    justifyContent: 'center',
  },
  trackTitle: {
    fontFamily: FONTS.bold24,
    fontSize: ms(14),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  artistName: {
    fontFamily: FONTS.regular24,
    fontSize: ms(12),
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: ms(2),
    includeFontPadding: false,
  },
  playButton: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: ms(14),
    height: ms(14),
    resizeMode: 'contain',
    tintColor: '#2C6BDD',
  },
});
