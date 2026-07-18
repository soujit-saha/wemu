import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';

interface PlaylistItemTrack {
  id: string;
  title: string;
  artist: string;
  image: string;
}

const PLAYLIST_TRACKS: PlaylistItemTrack[] = [
  {
    id: 'pt1',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    image: 'https://picsum.photos/200/200?random=301',
  },
  {
    id: 'pt2',
    title: 'Night Changes',
    artist: 'One Direction',
    image: 'https://picsum.photos/200/200?random=302',
  },
  {
    id: 'pt3',
    title: 'Let Me Love You',
    artist: 'Mario',
    image: 'https://picsum.photos/200/200?random=303',
  },
  {
    id: 'pt4',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    image: 'https://picsum.photos/200/200?random=304',
  },
  {
    id: 'pt5',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    image: 'https://picsum.photos/200/200?random=305',
  },
];

const PlayList = () => {
  const navigation = useNavigation<any>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image source={ICONS.leftarrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playlist</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Playlist Cover Art with Premium Gradient & Vibe Text Overlay */}
        <View style={styles.coverContainer}>
          <LinearGradient
            colors={['#1E1B4B', '#581C87', '#3B0764']}
            style={styles.coverGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.overlayTextContainer}>
              <Text style={styles.overlayTextTitle}>CHILL</Text>
              <Text style={styles.overlayTextSubtitle}>VIBES</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Playlist Metadata */}
        <View style={styles.infoContainer}>
          <Text style={styles.playlistTitle}>Chill Vibes</Text>
          <Text style={styles.playlistMetadata}>45 songs • 2h 20m</Text>
        </View>

        {/* Action Controls Row */}
        <View style={styles.controlsRow}>
          {/* Add songs capsule button */}
          <TouchableOpacity
            style={styles.addSongsBtn}
            activeOpacity={0.8}
          // onPress={() => navigation.navigate('CreatePlayList')}
          >
            <Text style={styles.addSongsIcon}>+</Text>
            <Text style={styles.addSongsText}>Add songs</Text>
          </TouchableOpacity>

          {/* Shuffle Toggle Button */}
          <TouchableOpacity
            style={[styles.shuffleButton, isShuffle && styles.shuffleButtonActive]}
            activeOpacity={0.7}
            onPress={() => setIsShuffle(!isShuffle)}
          >
            <Image
              source={ICONS.shuffle}
              style={[styles.shuffleIcon, isShuffle && styles.shuffleIconActive]}
            />
          </TouchableOpacity>

          {/* Round Play/Pause button */}
          <TouchableOpacity
            style={styles.playButton}
            activeOpacity={0.8}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <View style={styles.pauseIconContainer}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            ) : (
              <Text style={styles.playArrowIcon}>▶</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Tracks List */}
        <View style={styles.tracksContainer}>
          {PLAYLIST_TRACKS.map((track) => (
            <View key={track.id} style={styles.trackRow}>
              {/* Cover Art */}
              <Image source={{ uri: track.image }} style={styles.trackArt} />

              {/* Track Info */}
              <View style={styles.trackDetails}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {track.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {track.artist}
                </Text>
              </View>

              {/* Options Button */}
              <TouchableOpacity style={styles.optionsButton} activeOpacity={0.7}>
                <Text style={styles.optionsText}>•••</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlayList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: ms(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
  },
  backButton: {
    width: ms(36),
    height: ms(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: ms(22),
    height: ms(22),
    tintColor: '#111827',
    resizeMode: 'contain',
  },
  headerTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#000000',
    includeFontPadding: false,
  },
  headerSpacer: {
    width: ms(36),
  },
  scrollContent: {
    paddingHorizontal: ms(24),
    paddingTop: ms(16),
    paddingBottom: ms(40),
  },
  coverContainer: {
    alignItems: 'center',
    marginVertical: ms(12),
  },
  coverGradient: {
    width: ms(260),
    height: ms(260),
    borderRadius: ms(16),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#581C87',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  overlayTextContainer: {
    alignItems: 'center',
  },
  overlayTextTitle: {
    fontFamily: FONTS.black28,
    fontSize: ms(40),
    color: '#FFFFFF',
    letterSpacing: ms(4),
    includeFontPadding: false,
  },
  overlayTextSubtitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(22),
    color: '#F472B6',
    letterSpacing: ms(2),
    marginTop: ms(-4),
    includeFontPadding: false,
  },
  infoContainer: {
    marginTop: ms(16),
    marginBottom: ms(20),
  },
  playlistTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(22),
    color: '#111827',
    includeFontPadding: false,
  },
  playlistMetadata: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13),
    color: '#6B7280',
    marginTop: ms(6),
    includeFontPadding: false,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(28),
    gap: ms(12),
  },
  addSongsBtn: {
    flex: 1.2,
    height: ms(44),
    borderRadius: ms(22),
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(6),
  },
  addSongsIcon: {
    fontSize: ms(18),
    color: '#111827',
    includeFontPadding: false,
  },
  addSongsText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(13.5),
    color: '#111827',
    includeFontPadding: false,
  },
  shuffleButton: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shuffleButtonActive: {
    backgroundColor: 'rgba(99, 55, 235, 0.1)',
  },
  shuffleIcon: {
    width: ms(18),
    height: ms(18),
    tintColor: '#4B5563',
    resizeMode: 'contain',
  },
  shuffleIconActive: {
    tintColor: COLORS.Primary || '#6337EB',
  },
  playButton: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: COLORS.Primary || '#6337EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.Primary || '#6337EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  playArrowIcon: {
    color: '#FFFFFF',
    fontSize: ms(16),
    marginLeft: ms(2),
  },
  pauseIconContainer: {
    flexDirection: 'row',
    width: ms(10),
    height: ms(14),
    justifyContent: 'space-between',
  },
  pauseBar: {
    width: ms(3),
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: ms(0.5),
  },
  tracksContainer: {
    gap: ms(16),
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(56),
  },
  trackArt: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(8),
    backgroundColor: '#F3F4F6',
  },
  trackDetails: {
    flex: 1,
    marginLeft: ms(14),
    justifyContent: 'center',
  },
  trackTitle: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(14),
    color: '#111827',
    includeFontPadding: false,
  },
  trackArtist: {
    fontFamily: FONTS.regular24,
    fontSize: ms(12),
    color: '#6B7280',
    marginTop: ms(2),
    includeFontPadding: false,
  },
  optionsButton: {
    paddingHorizontal: ms(8),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsText: {
    color: '#9CA3AF',
    fontSize: ms(14),
    letterSpacing: ms(-1),
  },
});
