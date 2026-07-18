import React from 'react';
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
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import FloatingPlayer from '../../component/FloatingPlayer';

interface TrackItem {
  id: string;
  number: string;
  title: string;
}

const ALBUM_TRACKS: TrackItem[] = [
  { id: 't1', number: '1', title: 'Alone Again' },
  { id: 't2', number: '2', title: 'Too Late' },
  { id: 't3', number: '3', title: 'Hardest To Love' },
  { id: 't4', number: '4', title: 'Scared To Live' },
  { id: 't5', number: '5', title: 'Blinding Lights' },
  { id: 't6', number: '6', title: 'In Your Eyes' },
  { id: 't7', number: '7', title: 'Save Your Tears' },
];

const Album = () => {
  const navigation = useNavigation<any>();

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
        <Text style={styles.headerTitle}>Album</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Album Artwork */}
        <View style={styles.artworkContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop' }}
            style={styles.artworkImage}
          />
        </View>

        {/* Album Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.albumTitle}>After Hours</Text>
          <Text style={styles.albumMetadata}>The Weeknd • 2020</Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.playButton} activeOpacity={0.8}>
            <Text style={styles.playButtonIcon}>▶</Text>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Tracklist */}
        <View style={styles.tracklistContainer}>
          {ALBUM_TRACKS.map((track) => (
            <View key={track.id} style={styles.trackRow}>
              <Text style={styles.trackNumber}>{track.number}</Text>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <TouchableOpacity style={styles.optionsButton} activeOpacity={0.7}>
                <Text style={styles.optionsText}>•••</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Mini Player */}
      <FloatingPlayer />
    </SafeAreaView>
  );
};

export default Album;

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
    paddingBottom: ms(150), // Extra padding for FloatingPlayer overlay
  },
  artworkContainer: {
    alignItems: 'center',
    marginVertical: ms(12),
  },
  artworkImage: {
    width: ms(260),
    height: ms(260),
    borderRadius: ms(16),
    backgroundColor: '#F3F4F6',
  },
  infoContainer: {
    marginTop: ms(16),
    marginBottom: ms(20),
  },
  albumTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(22),
    color: '#111827',
    includeFontPadding: false,
  },
  albumMetadata: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13),
    color: '#6B7280',
    marginTop: ms(6),
    includeFontPadding: false,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ms(28),
    gap: ms(16),
  },
  playButton: {
    flex: 1,
    height: ms(48),
    backgroundColor: COLORS.Primary || '#6337EB',
    borderRadius: ms(24),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(8),
    shadowColor: COLORS.Primary || '#6337EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  playButtonIcon: {
    color: '#FFFFFF',
    fontSize: ms(14),
  },
  playButtonText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(15),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  addButton: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  addButtonText: {
    color: '#111827',
    fontSize: ms(22),
    lineHeight: ms(24),
    includeFontPadding: false,
  },
  tracklistContainer: {
    marginTop: ms(8),
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(14),
    borderBottomWidth: ms(1),
    borderBottomColor: '#F3F4F6',
  },
  trackNumber: {
    fontFamily: FONTS.medium24,
    fontSize: ms(14),
    color: '#9CA3AF',
    width: ms(24),
    includeFontPadding: false,
  },
  trackTitle: {
    fontFamily: FONTS.medium24,
    fontSize: ms(14),
    color: '#111827',
    flex: 1,
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
