import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS } from '../utils/constants';
import { ms } from '../utils/helper/metric';

const FloatingPlayer = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.floatingPlayer, { bottom: ms(66) + insets.bottom + ms(8) }]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('MusicPlay')}
    >
      <LinearGradient
        colors={[COLORS.playGradientStart, COLORS.playGradientMiddle, COLORS.playGradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      <View style={styles.playerInner}>
        <Image
          source={{ uri: 'https://picsum.photos/200/200?random=106' }}
          style={styles.playerArt}
        />
        <View style={styles.playerDetails}>
          <Text style={styles.playerTitle} numberOfLines={1}>Blinding Lights</Text>
          <Text style={styles.playerArtist} numberOfLines={1}>The Weeknd</Text>
        </View>

        <TouchableOpacity
          style={styles.playerPlayBtn}
          onPress={() => setIsPlaying(!isPlaying)}
          activeOpacity={0.8}
        >
          {isPlaying ? (
            <View style={styles.miniPauseIcon}>
              <View style={styles.miniPauseBar} />
              <View style={styles.miniPauseBar} />
            </View>
          ) : (
            <View style={styles.miniPlayTriangle} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default FloatingPlayer;

const styles = StyleSheet.create({
  floatingPlayer: {
    position: 'absolute',
    left: ms(20),
    right: ms(20),
    height: ms(62),
    borderRadius: ms(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  playerInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(14),
  },
  playerArt: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(8),
  },
  playerDetails: {
    flex: 1,
    marginLeft: ms(12),
    justifyContent: 'center',
  },
  playerTitle: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(14),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  playerArtist: {
    fontFamily: FONTS.regular24,
    fontSize: ms(12),
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: ms(2),
    includeFontPadding: false,
  },
  playerPlayBtn: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPauseIcon: {
    flexDirection: 'row',
    width: ms(8),
    height: ms(11),
    justifyContent: 'space-between',
  },
  miniPauseBar: {
    width: ms(2.5),
    height: '100%',
    backgroundColor: '#3E7FF3',
    borderRadius: ms(0.5),
  },
  miniPlayTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: ms(10),
    borderTopWidth: ms(6),
    borderBottomWidth: ms(6),
    borderLeftColor: '#3E7FF3',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: ms(2.5),
  },
});
