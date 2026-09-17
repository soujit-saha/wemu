import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { songsByAlbumRequest } from '../../redux/reducer/SongReducer';
import TrackPlayer, {
  State,
  usePlaybackState,
  useActiveTrack,
} from 'react-native-track-player';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import FloatingPlayer from '../../component/FloatingPlayer';
import { useTranslation } from '../../utils/hooks/useTranslation';

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
  const route = useRoute<any>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const albumData = route.params?.id || {};
  const artworkUrl =
    albumData.image ||
    albumData.cover_image_path ||
    albumData.cover_image ||
    'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop';
  const title = albumData.title || albumData.name || 'Unknown Album';
  const artistName = albumData?.artist?.name || albumData?.created_by?.name || albumData?.artist_name || 'Unknown Artist';

  const { songsByAlbumRes, isLoading } = useSelector(
    (state: any) => state.SongReducer
  );

  const [page, setPage] = useState(1);
  const [localItems, setLocalItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const albumId = albumData?.id || albumData?.uuid;
    if (albumId) {
      setPage(1);
      setLocalItems([]);
      setHasMore(true);
      dispatch(songsByAlbumRequest({ id: albumId, page: 1 }));
    }
  }, [albumData?.id, albumData?.uuid]);

  const albumTracksRes = songsByAlbumRes?.data?.result || songsByAlbumRes?.data || [];

  useEffect(() => {
    if (songsByAlbumRes) {
      if (page === 1) {
        setLocalItems(albumTracksRes);
      } else {
        if (albumTracksRes && albumTracksRes.length > 0) {
          setLocalItems(prev => {
            const newItems = albumTracksRes.filter((item: any) => 
              !prev.some((p: any) => (p.id || p.uuid) === (item.id || item.uuid))
            );
            return [...prev, ...newItems];
          });
          
          if (albumTracksRes.length < 15) {
            setHasMore(false);
          }
        }
        if (!albumTracksRes || albumTracksRes.length === 0) {
          setHasMore(false);
        }
      }
      setIsLoadingMore(false);
    }
  }, [songsByAlbumRes]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoadingMore(false);
    }
  }, [isLoading]);

  const loadMore = () => {
    if (!isLoading && !isLoadingMore && hasMore && localItems.length > 0) {
      const nextPage = page + 1;
      const albumId = albumData?.id || albumData?.uuid;
      setIsLoadingMore(true);
      setPage(nextPage);
      dispatch(songsByAlbumRequest({ id: albumId, page: nextPage }));
    }
  };

  const playbackState = usePlaybackState();
  const activeTrack = useActiveTrack();
  const stateVal =
    typeof playbackState === 'object' && playbackState !== null
      ? (playbackState as any).state
      : playbackState;
  const isPlaying =
    stateVal === State.Playing ||
    stateVal === 'playing' ||
    stateVal === 'buffering' ||
    stateVal === State.Buffering;

  const handlePlayPlaylist = async () => {
    if (localItems.length === 0) return;

    const isCurrentlyPlayingPlaylist = localItems.some(
      (t: any) => t.id?.toString() === activeTrack?.id,
    );

    try {
      try {
        await TrackPlayer.setupPlayer({});
      } catch (e) { }

      if (isCurrentlyPlayingPlaylist) {
        if (isPlaying) {
          await TrackPlayer.pause();
        } else {
          await TrackPlayer.play();
          const currentPlaying =
            localItems.find((t: any) => t.id?.toString() === activeTrack?.id) ||
            localItems[0];
          navigation.navigate('MusicPlay', { track: currentPlaying, fromScreen: 'Album' });
        }
      } else {
        await TrackPlayer.reset();

        const trackQueue = localItems.map((trackItem: any) => ({
          id: trackItem.id?.toString(),
          url:
            trackItem.audio_file_path ||
            trackItem.url ||
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          title: trackItem.title || trackItem.name || 'Unknown Title',
          artist:
            trackItem.other_artists ||
            trackItem.artist_name ||
            'Unknown Artist',
          artwork:
            trackItem.cover_image_path ||
            trackItem.image ||
            'https://picsum.photos/200',
          duration:
            parseFloat(trackItem.duration || trackItem.total_duration) || 0,
        }));

        await TrackPlayer.add(trackQueue);
        await TrackPlayer.play();

        navigation.navigate('MusicPlay', { track: localItems[0], fromScreen: 'Album' });
      }
    } catch (error) {
      console.error('Error playing album:', error);
    }
  };

  const handlePlaySpecificSong = async (track: any, index: number) => {
    try {
      try {
        await TrackPlayer.setupPlayer({});
      } catch (e) { }

      const isCurrentlyPlayingThisSong =
        activeTrack?.id === track.id?.toString();

      if (isCurrentlyPlayingThisSong) {
        if (!isPlaying) {
          await TrackPlayer.play();
        }
        navigation.navigate('MusicPlay', { track, fromScreen: 'Album' });
        return;
      }

      await TrackPlayer.reset();

      const trackQueue = localItems.map((trackItem: any) => ({
        id: trackItem.id?.toString(),
        url:
          trackItem.audio_file_path ||
          trackItem.url ||
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        title: trackItem.title || trackItem.name || 'Unknown Title',
        artist:
          trackItem.other_artists || trackItem.artist_name || 'Unknown Artist',
        artwork:
          trackItem.cover_image_path ||
          trackItem.image ||
          'https://picsum.photos/200',
        duration:
          parseFloat(trackItem.duration || trackItem.total_duration) || 0,
      }));

      await TrackPlayer.add(trackQueue);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();

      navigation.navigate('MusicPlay', { track, fromScreen: 'Album' });
    } catch (error) {
      console.error('Error playing specific song:', error);
    }
  };

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
        <Text style={styles.headerTitle}>{t('album')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        data={localItems}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            {/* Album Artwork */}
            <View style={styles.artworkContainer}>
              <Image
                source={{ uri: artworkUrl }}
                style={styles.artworkImage}
              />
            </View>

            {/* Album Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.albumTitle}>{title}</Text>
              <Text style={styles.albumMetadata}>{artistName}</Text>
            </View>

            {/* Control Buttons */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.playButton}
                activeOpacity={0.8}
                onPress={handlePlayPlaylist}
              >
                {isPlaying &&
                  localItems.some((t: any) => t.id?.toString() === activeTrack?.id) ? (
                  <View style={{ flexDirection: 'row', gap: ms(4) }}>
                    <View style={{ width: ms(3), height: ms(14), backgroundColor: '#FFF', borderRadius: ms(0.5) }} />
                    <View style={{ width: ms(3), height: ms(14), backgroundColor: '#FFF', borderRadius: ms(0.5) }} />
                  </View>
                ) : (
                  <>
                    <Text style={styles.playButtonIcon}>▶</Text>
                    <Text style={styles.playButtonText}>{t('play')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item: track, index }) => (
          <TouchableOpacity
            style={styles.trackRow}
            activeOpacity={0.7}
            onPress={() => handlePlaySpecificSong(track, index)}
          >
            {/* Cover Art */}
            <Image
              source={{
                uri:
                  track.cover_image_path ||
                  track.image ||
                  'https://picsum.photos/200',
              }}
              style={styles.trackArt}
            />

            {/* Track Info */}
            <View style={styles.trackDetails}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {track.title || track.name}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {track.other_artists ||
                  track.artist_name ||
                  'Unknown Artist'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: ms(16) }} />}
        ListEmptyComponent={
          isLoading && page === 1 ? (
            <ActivityIndicator size="large" color="#6337EB" style={{ marginTop: ms(20) }} />
          ) : (
            <View style={{ alignItems: 'center', marginTop: ms(20) }}>
              <Text style={{ color: '#6B7280', fontFamily: FONTS.medium24, fontSize: ms(14) }}>
                {t('noSongsFound')}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          localItems.length > 0 && isLoadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator size="large" color="#6337EB" />
            </View>
          ) : <View style={{ height: ms(20) }} />
        }
      />

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
