import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { useTranslation } from '../../utils/hooks/useTranslation';
import {
  getPlaylistDetailsRequest,
  addRemovePlaylistSongRequest,
  songsToAddRequest,
} from '../../redux/reducer/SongReducer';
import TrackPlayer, {
  State,
  usePlaybackState,
  useActiveTrack,
} from 'react-native-track-player';
import BannerAdComponent from '../../component/BannerAdComponent';

const PlayList = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const { t } = useTranslation();

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

  const [isShuffle, setIsShuffle] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Add Songs Modal State
  const [isAddSongsModalVisible, setIsAddSongsModalVisible] = useState(false);
  const [addSongsKeyword, setAddSongsKeyword] = useState('');
  const [addSongsPage, setAddSongsPage] = useState(1);
  const [localSongsToAdd, setLocalSongsToAdd] = useState<any[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Set<number>>(new Set());

  const playlistId = route.params?.id || route.params?.playlist?.id;
  const hideAddSong = route.params?.hideAddSong;
  const { playlistDetailsRes, songsToAddRes, isLoading } = useSelector(
    (state: any) => state.SongReducer,
  );

  const playlistData = playlistDetailsRes?.data;
  const tracks = playlistData?.songs?.result || [];
  const currentPlaylistId = playlistData?.id || playlistId;

  useEffect(() => {
    if (playlistId) {
      dispatch(getPlaylistDetailsRequest(playlistId));
    }
  }, [dispatch, playlistId]);

  // Handle Add Songs search and initial fetch
  useEffect(() => {
    if (isAddSongsModalVisible) {
      const timer = setTimeout(() => {
        setAddSongsPage(1);
        dispatch(
          songsToAddRequest({
            playlist_id: currentPlaylistId,
            keyword: addSongsKeyword,
            page: 1,
            per_page: 15,
          }),
        );
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [addSongsKeyword, isAddSongsModalVisible, dispatch, currentPlaylistId]);

  // Sync songsToAddRes with local array
  useEffect(() => {
    if (songsToAddRes?.data) {
      const newSongs = songsToAddRes.data.result || songsToAddRes.data || [];
      if (addSongsPage === 1) {
        setLocalSongsToAdd(newSongs);
      } else {
        setLocalSongsToAdd(prev => {
          const existing = new Set(prev.map(p => p.id));
          return [...prev, ...newSongs.filter((n: any) => !existing.has(n.id))];
        });
      }
    }
  }, [songsToAddRes]);

  const loadMoreSongsToAdd = () => {
    if (
      !isLoading &&
      localSongsToAdd.length > 0 &&
      localSongsToAdd.length % 15 === 0
    ) {
      const nextPage = addSongsPage + 1;
      setAddSongsPage(nextPage);
      dispatch(
        songsToAddRequest({
          playlist_id: currentPlaylistId,
          keyword: addSongsKeyword,
          page: nextPage,
          per_page: 15,
        }),
      );
    }
  };

  const toggleSongSelection = (songId: number) => {
    setSelectedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) newSet.delete(songId);
      else newSet.add(songId);
      return newSet;
    });
  };

  const submitSelectedSongs = () => {
    dispatch(
      addRemovePlaylistSongRequest({
        playlist_id: currentPlaylistId,
        song_ids: Array.from(selectedSongs),
        action: 'add',
      }),
    );
    setIsAddSongsModalVisible(false);
    setSelectedSongs(new Set());
  };

  const handleRemoveSong = () => {
    if (selectedTrack && currentPlaylistId) {
      dispatch(
        addRemovePlaylistSongRequest({
          playlist_id: currentPlaylistId,
          song_ids: [selectedTrack.id],
          action: 'remove',
        }),
      );
      setIsPopupVisible(false);
    }
  };

  const handlePlayPlaylist = async () => {
    if (tracks.length === 0) return;

    // Check if the current active track is one of the tracks in this playlist
    const isCurrentlyPlayingPlaylist = tracks.some(
      (t: any) => t.id?.toString() === activeTrack?.id,
    );

    try {
      // Ensure player is initialized before attempting playback
      try {
        await TrackPlayer.setupPlayer({});
      } catch (e) {
        // Player is already initialized; safe to ignore
      }

      if (isCurrentlyPlayingPlaylist) {
        if (isPlaying) {
          await TrackPlayer.pause();
        } else {
          await TrackPlayer.play();
          // If we resume, optionally navigate to player
          const currentPlaying =
            tracks.find((t: any) => t.id?.toString() === activeTrack?.id) ||
            tracks[0];
          navigation.navigate('MusicPlay', { track: currentPlaying, fromScreen: 'PlayList' });
        }
      } else {
        await TrackPlayer.reset();

        // Map all playlist tracks for TrackPlayer
        const trackQueue = tracks.map((trackItem: any) => ({
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
          track: trackItem,
        }));

        await TrackPlayer.add(trackQueue);
        await TrackPlayer.play();

        // Navigate to the full screen player with the first song
        navigation.navigate('MusicPlay', { track: tracks[0], fromScreen: 'PlayList' });
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  const handlePlaySpecificSong = async (track: any, index: number) => {
    try {
      try {
        await TrackPlayer.setupPlayer({});
      } catch (e) { }

      // Check if this specific song is already active
      const isCurrentlyPlayingThisSong =
        activeTrack?.id === track.id?.toString();

      if (isCurrentlyPlayingThisSong) {
        if (!isPlaying) {
          await TrackPlayer.play();
        }
        navigation.navigate('MusicPlay', { track, fromScreen: 'PlayList' });
        return;
      }

      await TrackPlayer.reset();

      const trackQueue = tracks.map((trackItem: any) => ({
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
        track: trackItem,
      }));

      await TrackPlayer.add(trackQueue);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();

      navigation.navigate('MusicPlay', { track, fromScreen: 'PlayList' });
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
        <Text style={styles.headerTitle}>{t('playlist')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <BannerAdComponent />

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6337EB" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Playlist Cover Art with Premium Gradient & Vibe Text Overlay */}
          <View style={styles.coverContainer}>
            {playlistData?.cover_image_path ? (
              <Image
                source={{ uri: playlistData?.cover_image_path }}
                style={styles.coverImage}
              />
            ) : (
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
            )}
          </View>

          {/* Playlist Metadata */}
          <View style={styles.infoContainer}>
            <Text style={styles.playlistTitle}>
              {playlistData?.title || 'Playlist'}
            </Text>
            <Text style={styles.playlistMetadata}>
              {playlistData?.songs_count || 0} {t('songs')}{' '}
              {playlistData?.description ? `• ${playlistData.description}` : ''}
            </Text>
          </View>

          {/* Action Controls Row */}
          <View style={styles.controlsRow}>
            {/* Add songs capsule button */}
            {!hideAddSong && (
              <TouchableOpacity
                style={styles.addSongsBtn}
                activeOpacity={0.8}
                onPress={() => setIsAddSongsModalVisible(true)}
              >
                <Text style={styles.addSongsIcon}>+</Text>
                <Text style={styles.addSongsText}>{t('addSongs')}</Text>
              </TouchableOpacity>
            )}

            {/* Shuffle Toggle Button */}
            <TouchableOpacity
              style={[
                styles.shuffleButton,
                isShuffle && styles.shuffleButtonActive,
              ]}
              activeOpacity={0.7}
              onPress={() => setIsShuffle(!isShuffle)}
            >
              <Image
                source={ICONS.shuffle}
                style={[
                  styles.shuffleIcon,
                  isShuffle && styles.shuffleIconActive,
                ]}
              />
            </TouchableOpacity>

            {/* Round Play/Pause button */}
            <TouchableOpacity
              style={styles.playButton}
              activeOpacity={0.8}
              onPress={handlePlayPlaylist}
            >
              {isPlaying &&
                tracks.some((t: any) => t.id?.toString() === activeTrack?.id) ? (
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
            {tracks.map((track: any, index: number) => (
              <TouchableOpacity
                key={track.id || index}
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

                {/* Options Button */}
                {!hideAddSong && (
                  <TouchableOpacity
                    style={styles.optionsButton}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedTrack(track);
                      setIsPopupVisible(true);
                    }}
                  >
                    <Text style={styles.optionsText}>•••</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Remove Song Modal */}
      <Modal visible={isPopupVisible} transparent={true} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsPopupVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedTrack?.title}
            </Text>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={handleRemoveSong}
            >
              <Text style={styles.removeBtnText}>
                {t('removeFromPlaylist')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsPopupVisible(false)}
            >
              <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Songs Modal */}
      <Modal
        visible={isAddSongsModalVisible}
        transparent={true}
        animationType="slide"
      >
        <SafeAreaView style={styles.fullScreenModalContainer}>
          <View style={styles.addSongsModalHeader}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => {
                setIsAddSongsModalVisible(false);
                setSelectedSongs(new Set());
                setAddSongsKeyword('');
              }}
            >
              <Text style={styles.closeModalText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.addSongsModalTitle}>{t('addSongs')}</Text>
            <View style={{ width: ms(40) }} />
          </View>

          <View style={styles.modalSearchBar}>
            <Image source={ICONS.search} style={styles.modalSearchIcon} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder={t('searchSongs')}
              placeholderTextColor="#9CA3AF"
              value={addSongsKeyword}
              onChangeText={setAddSongsKeyword}
            />
          </View>

          <FlatList
            data={localSongsToAdd}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.addSongsListContent}
            onEndReached={loadMoreSongsToAdd}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.Primary}
                  style={{ marginVertical: ms(16) }}
                />
              ) : null
            }
            renderItem={({ item }) => {
              const isSelected = selectedSongs.has(item.id);
              return (
                <TouchableOpacity
                  style={styles.addSongRow}
                  activeOpacity={0.7}
                  onPress={() => toggleSongSelection(item.id)}
                >
                  <Image
                    source={{
                      uri:
                        item.cover_image_path ||
                        item.image ||
                        'https://picsum.photos/200',
                    }}
                    style={styles.addSongImage}
                  />
                  <View style={styles.addSongDetails}>
                    <Text style={styles.addSongTitle} numberOfLines={1}>
                      {item.title || item.name}
                    </Text>
                    <Text style={styles.addSongArtist} numberOfLines={1}>
                      {item.other_artists ||
                        item.artist_name ||
                        'Unknown Artist'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.checkboxCircle,
                      isSelected && styles.checkboxCircleActive,
                    ]}
                  >
                    {isSelected && <Text style={styles.checkmarkIcon}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {selectedSongs.size > 0 && (
            <View style={styles.stickyAddButtonContainer}>
              <TouchableOpacity
                style={styles.stickyAddButton}
                activeOpacity={0.8}
                onPress={submitSelectedSongs}
              >
                <Text style={styles.stickyAddButtonText}>{t('addSongs')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: ms(260),
    height: ms(260),
    borderRadius: ms(16),
    resizeMode: 'cover',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    padding: ms(24),
    paddingBottom: ms(40),
  },
  modalTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#111827',
    marginBottom: ms(24),
    textAlign: 'center',
    includeFontPadding: false,
  },
  removeBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: ms(14),
    borderRadius: ms(12),
    alignItems: 'center',
    marginBottom: ms(12),
  },
  removeBtnText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(15),
    color: '#EF4444',
    includeFontPadding: false,
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: ms(14),
    borderRadius: ms(12),
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(15),
    color: '#374151',
    includeFontPadding: false,
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  addSongsModalHeader: {
    height: ms(56),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
  },
  closeModalButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  closeModalText: {
    fontSize: ms(20),
    color: '#111827',
  },
  addSongsModalTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#111827',
    includeFontPadding: false,
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: ms(16),
    marginTop: ms(8),
    marginBottom: ms(16),
    borderRadius: ms(12),
    paddingHorizontal: ms(12),
    height: ms(44),
  },
  modalSearchIcon: {
    width: ms(18),
    height: ms(18),
    tintColor: '#9CA3AF',
    marginRight: ms(8),
  },
  modalSearchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular24,
    fontSize: ms(14),
    color: '#111827',
  },
  addSongsListContent: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(100), // space for bottom sticky button
  },
  addSongRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(12),
    borderBottomWidth: ms(1),
    borderBottomColor: '#F3F4F6',
  },
  addSongImage: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(8),
    backgroundColor: '#F3F4F6',
  },
  addSongDetails: {
    flex: 1,
    marginLeft: ms(12),
    justifyContent: 'center',
  },
  addSongTitle: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(14),
    color: '#111827',
    includeFontPadding: false,
  },
  addSongArtist: {
    fontFamily: FONTS.regular24,
    fontSize: ms(12),
    color: '#6B7280',
    marginTop: ms(2),
    includeFontPadding: false,
  },
  checkboxCircle: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    borderWidth: ms(2),
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ms(12),
  },
  checkboxCircleActive: {
    borderColor: COLORS.Primary || '#6337EB',
    backgroundColor: COLORS.Primary || '#6337EB',
  },
  checkmarkIcon: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: 'bold',
  },
  stickyAddButtonContainer: {
    position: 'absolute',
    bottom: ms(20),
    left: ms(24),
    right: ms(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stickyAddButton: {
    backgroundColor: '#3B82F6', // Blue as per image, or use COLORS.Primary
    height: ms(50),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyAddButtonText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(16),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
