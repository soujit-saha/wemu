import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import FloatingPlayer from '../../component/FloatingPlayer';
import { useTranslation } from '../../utils/hooks/useTranslation';
import { searchSongRequest } from '../../redux/reducer/SongReducer';
import BannerAdComponent from '../../component/BannerAdComponent';

const { width } = Dimensions.get('window');

const BROWSE_CATEGORIES = [
  { id: '1', name: 'Pop', bg: '#C4D9FC', text: '#1E3A8A' },
  { id: '2', name: 'Hip Hop', bg: '#FDE6C8', text: '#92400E' },
  { id: '3', name: 'Workout', bg: '#DDD6FE', text: '#5B21B6' },
  { id: '4', name: 'Romance', bg: '#CCFBF1', text: '#0F766E' },
  { id: '5', name: 'Chill', bg: '#FEE2E2', text: '#991B1B' },
  { id: '6', name: 'Party', bg: '#E0F2FE', text: '#075985' },
];

const TRENDING_SEARCHES = [
  'The Weeknd',
  'Coldplay',
  'Arijit Singh',
  'Imagine Dragons',
  'Olivia Rodrigo',
];

const FILTER_TABS = ['Songs', 'Albums', 'Artists', 'Playlists'];

const Search = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('Songs');
  const [page, setPage] = useState(1);

  const [localSongs, setLocalSongs] = useState<any[]>([]);
  const [localAlbums, setLocalAlbums] = useState<any[]>([]);
  const [localArtists, setLocalArtists] = useState<any[]>([]);
  const [localPlaylists, setLocalPlaylists] = useState<any[]>([]);

  const { searchSongRes, isLoading } = useSelector(
    (state: any) => state.SongReducer,
  );

  const getSearchType = (tab: string) => {
    switch (tab) {
      case 'Albums':
        return 'album';
      case 'Artists':
        return 'artist';
      case 'Playlists':
        return 'playlist';
      case 'Songs':
        return 'song';
    }
  };

  // Debounced search when query or tab changes
  useEffect(() => {
    const query = searchText.trim();
    if (query.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setPage(1);
      dispatch(
        searchSongRequest({
          keywords: query,
          page: 1,
          per_page: 15,
          type: getSearchType(activeTab),
        }),
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText, activeTab, dispatch]);

  const handleClearSearch = () => {
    setSearchText('');
  };

  const handleSearchItemPress = (itemText: string) => {
    setSearchText(itemText);
    setPage(1);
    dispatch(
      searchSongRequest({
        keywords: itemText,
        page: 1,
        per_page: 15,
        type: getSearchType(activeTab),
      }),
    );
  };

  const handleSearchSubmit = () => {
    const query = searchText.trim();
    if (query.length > 0) {
      setPage(1);
      dispatch(
        searchSongRequest({
          keywords: query,
          page: 1,
          per_page: 15,
          type: getSearchType(activeTab),
        }),
      );
    }
  };

  // Sync Redux response to local state for appending (pagination)
  useEffect(() => {
    const rawData = searchSongRes?.data ?? searchSongRes;
    if (!rawData) return;

    let newSongs = [];
    if (Array.isArray(rawData)) newSongs = rawData;
    else if (Array.isArray(rawData.songs?.result))
      newSongs = rawData.songs.result;
    else if (Array.isArray(rawData.song?.result))
      newSongs = rawData.song.result;
    else if (Array.isArray(rawData.tracks?.result))
      newSongs = rawData.tracks.result;
    else if (Array.isArray(rawData.data?.result))
      newSongs = rawData.data?.result;

    let newAlbums = [];
    if (!Array.isArray(rawData)) {
      if (Array.isArray(rawData.albums?.result))
        newAlbums = rawData.albums.result;
      else if (Array.isArray(rawData.album?.result))
        newAlbums = rawData.album.result;
    }

    let newArtists = [];
    if (!Array.isArray(rawData)) {
      if (Array.isArray(rawData.artists?.result))
        newArtists = rawData.artists.result;
      else if (Array.isArray(rawData.artist?.result))
        newArtists = rawData.artist.result;
    }

    let newPlaylists = [];
    if (!Array.isArray(rawData)) {
      if (Array.isArray(rawData.playlists?.result))
        newPlaylists = rawData.playlists.result;
      else if (Array.isArray(rawData.playlist?.result))
        newPlaylists = rawData.playlist.result;
    }

    if (page === 1) {
      setLocalSongs(newSongs || []);
      setLocalAlbums(newAlbums || []);
      setLocalArtists(newArtists || []);
      setLocalPlaylists(newPlaylists || []);
    } else {
      const appendUnique = (prev: any[], next: any[]) => {
        if (!next || next.length === 0) return prev;
        const existing = new Set(prev.map(p => p.id || p.uuid));
        return [...prev, ...next.filter(n => !existing.has(n.id || n.uuid))];
      };
      setLocalSongs(prev => appendUnique(prev, newSongs));
      setLocalAlbums(prev => appendUnique(prev, newAlbums));
      setLocalArtists(prev => appendUnique(prev, newArtists));
      setLocalPlaylists(prev => appendUnique(prev, newPlaylists));
    }
  }, [searchSongRes]);

  const loadMore = () => {
    if (isLoading) return;
    const perPage = 15;

    // Check if any of the displayed lists indicate there might be more data
    let totalItems = 0;
    if (activeTab === 'Top' || activeTab === 'Songs')
      totalItems = localSongs.length;
    else if (activeTab === 'Albums') totalItems = localAlbums.length;
    else if (activeTab === 'Artists') totalItems = localArtists.length;
    else if (activeTab === 'Playlists') totalItems = localPlaylists.length;

    if (totalItems > 0 && totalItems % perPage === 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(
        searchSongRequest({
          keywords: searchText.trim(),
          page: nextPage,
          per_page: perPage,
          type: getSearchType(activeTab),
        }),
      );
    }
  };

  const songsData = localSongs;
  const albumsData = localAlbums;
  const artistsData = localArtists;
  const playlistsData = localPlaylists;

  // Header Search Input
  const renderSearchInput = () => (
    <View
      style={[styles.searchBarContainer, { marginTop: insets.top + ms(10) }]}
    >
      <View style={styles.searchBarInner}>
        <Image source={ICONS.search} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={handleSearchSubmit}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Idle browse state (Browse categories & Trending searches)
  const renderBrowseState = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>{t('browseAll')}</Text>

      {/* 2-column Grid of Categories */}
      <View style={styles.categoriesGrid}>
        {BROWSE_CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryCard, { backgroundColor: cat.bg }]}
            activeOpacity={0.8}
            onPress={() => handleSearchItemPress(cat.name)}
          >
            <Text style={[styles.categoryText, { color: cat.text }]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: ms(32) }]}>
        {t('trendingSearches')}
      </Text>

      {/* List of Trending Searches */}
      <View style={styles.trendingList}>
        {TRENDING_SEARCHES.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.trendingItem}
            activeOpacity={0.7}
            onPress={() => handleSearchItemPress(item)}
          >
            <Text style={styles.trendArrow}>↗</Text>
            <Text style={styles.trendingText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Spacer to prevent overlapping with floating player */}
      <View style={{ height: ms(100) }} />
    </ScrollView>
  );

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'Songs':
        return t('songs').charAt(0).toUpperCase() + t('songs').slice(1);
      case 'Albums':
        return t('albums');
      case 'Artists':
        return t('artists');
      case 'Playlists':
        return t('playlists');
      default:
        return tab;
    }
  };

  const hasResultsForTab = useMemo(() => {
    switch (activeTab) {
      case 'Songs':
        return songsData.length > 0;
      case 'Albums':
        return albumsData.length > 0;
      case 'Artists':
        return artistsData.length > 0;
      case 'Playlists':
        return playlistsData.length > 0;
      // default:
      //   return (
      //     songsData.length > 0 ||
      //     albumsData.length > 0 ||
      //     artistsData.length > 0 ||
      //     playlistsData.length > 0
      //   );
    }
  }, [activeTab, songsData, albumsData, artistsData, playlistsData]);

  // Search Results state
  const renderResultsState = () => (
    <View style={{ flex: 1 }}>
      {/* Filter Tabs pill bar */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_TABS.map(tab => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextColor,
                  ]}
                >
                  {getTabLabel(tab)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.Primary} />
        </View>
      ) : !hasResultsForTab ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('noItemsFound')}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            const isCloseToBottom =
              nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
              nativeEvent.contentSize.height - 400;
            if (isCloseToBottom) {
              loadMore();
            }
          }}
          scrollEventThrottle={16}
        >
          {/* Songs Section */}
          {activeTab === 'Songs' && songsData.length > 0 && (
            <View style={{ marginBottom: ms(24) }}>
              <Text style={styles.sectionTitle}>
                {t('songs').charAt(0).toUpperCase() + t('songs').slice(1)}
              </Text>
              <View style={styles.songsList}>
                {songsData.map((song: any, index: number) => {
                  const songId = song.id || song.uuid || `song-${index}`;
                  const title = song.title || song.name || 'Unknown';
                  const artist =
                    [song.featured_artists, song.other_artists]
                      .filter(Boolean)
                      .join(', ') ||
                    song.artist ||
                    song.artist_name ||
                    song.singer ||
                    song.description ||
                    '';
                  const image =
                    song.cover_image_path ||
                    song.image_path ||
                    song.image ||
                    `https://picsum.photos/200/200?random=${index + 10}`;

                  return (
                    <TouchableOpacity
                      key={songId}
                      style={styles.songRow}
                      activeOpacity={0.7}
                      onPress={() =>
                        navigation.navigate('MusicPlay', {
                          track: song.raw || song,
                          fromScreen: 'Search',
                          keyword: searchText,
                        })
                      }
                    >
                      <Image source={{ uri: image }} style={styles.songImage} />
                      <View style={styles.songDetails}>
                        <Text style={styles.songTitle} numberOfLines={1}>
                          {title}
                        </Text>
                        {artist.length > 0 && (
                          <Text style={styles.songArtist} numberOfLines={1}>
                            {artist}
                          </Text>
                        )}
                      </View>
                      {/* <TouchableOpacity
                        style={styles.moreButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.moreText}>•••</Text>
                      </TouchableOpacity> */}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Albums Section */}
          {activeTab === 'Albums' && albumsData.length > 0 && (
            <View style={{ marginBottom: ms(24) }}>
              <Text style={styles.sectionTitle}>{t('albums')}</Text>
              <View style={styles.libraryListContainer}>
                {albumsData.map((album: any, index: number) => {
                  const albumId = album.id || album.uuid || `album-${index}`;
                  const title = album.title || album.name || 'Unknown Album';
                  const image =
                    album.image ||
                    album.cover_image ||
                    album.cover_image_path ||
                    album.image_path ||
                    `https://picsum.photos/200/200?random=${index + 20}`;

                  return (
                    <TouchableOpacity
                      key={albumId}
                      style={styles.libraryRowItem}
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate('Album', { id: album })}
                    >
                      <Image
                        source={{ uri: image }}
                        style={styles.libraryRowImage}
                      />
                      <View style={styles.libraryRowDetails}>
                        <Text style={styles.libraryRowTitle} numberOfLines={1}>
                          {title}
                        </Text>
                        <Text style={styles.libraryRowSubtitle}>
                          {t('album')}{' '}
                          {album.artist_name ? `• ${album.artist_name}` : ''}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Artists Section */}
          {activeTab === 'Artists' && artistsData.length > 0 && (
            <View style={{ marginBottom: ms(24) }}>
              <Text style={styles.sectionTitle}>{t('artists')}</Text>
              <View style={styles.libraryListContainer}>
                {artistsData.map((artist: any, index: number) => {
                  const artistId =
                    artist.id || artist.uuid || `artist-${index}`;
                  const name = artist.name || artist.title || 'Unknown Artist';
                  const image =
                    artist.cover_image_path ||
                    artist.image_path ||
                    artist.image ||
                    `https://picsum.photos/200/200?random=${index + 30}`;

                  return (
                    <TouchableOpacity
                      key={artistId}
                      style={styles.libraryRowItem}
                      activeOpacity={0.7}
                      onPress={() =>
                        navigation.navigate('ArtistsDetails', { artist })
                      }
                    >
                      <Image
                        source={{ uri: image }}
                        style={styles.libraryRowImage}
                      />
                      <View style={styles.libraryRowDetails}>
                        <Text style={styles.libraryRowTitle} numberOfLines={1}>
                          {name}
                        </Text>
                        <Text style={styles.libraryRowSubtitle}>
                          {t('artist')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Playlists Section */}
          {activeTab === 'Playlists' && playlistsData.length > 0 && (
            <View style={{ marginBottom: ms(24) }}>
              <Text style={styles.sectionTitle}>{t('playlists')}</Text>
              <View style={styles.libraryListContainer}>
                {playlistsData.map((pl: any, index: number) => {
                  const plId = pl.id || pl.uuid || `pl-${index}`;
                  const title = pl.title || pl.name || 'Unknown Playlist';
                  const image =
                    pl.cover_image_path ||
                    pl.image_path ||
                    pl.image ||
                    pl.cover_image ||
                    `https://picsum.photos/200/200?random=${index + 40}`;

                  return (
                    <TouchableOpacity
                      key={plId}
                      style={styles.libraryRowItem}
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate('PlayList', { id: plId, hideAddSong: true })}
                    >
                      <Image
                        source={{ uri: image }}
                        style={styles.libraryRowImage}
                      />
                      <View style={styles.libraryRowDetails}>
                        <Text style={styles.libraryRowTitle} numberOfLines={1}>
                          {title}
                        </Text>
                        <Text style={styles.libraryRowSubtitle}>
                          {t('playlist')} • {pl.songs_count || 0} {t('songs')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {isLoading && page > 1 && (
            <ActivityIndicator
              size="large"
              color={COLORS.Primary}
              style={{ marginVertical: ms(20) }}
            />
          )}

          {/* Spacer to prevent overlapping with floating player */}
          <View style={{ height: ms(100) }} />
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />



      {/* Search Header Input */}
      {renderSearchInput()}

      <BannerAdComponent />

      {/* Conditional Content based on Search Input Text */}
      {searchText.length === 0 ? renderBrowseState() : renderResultsState()}

      {/* Floating mini player above bottom tab bar */}
      <FloatingPlayer />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchBarContainer: {
    paddingHorizontal: ms(24),
    marginBottom: ms(16),
  },
  searchBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(52),
    backgroundColor: '#F3F4F6',
    borderRadius: ms(14),
    paddingHorizontal: ms(16),
  },
  searchIcon: {
    width: ms(20),
    height: ms(20),
    marginRight: ms(12),
    resizeMode: 'contain',
    tintColor: '#9CA3AF',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular24,
    fontSize: ms(15),
    color: '#1F2937',
  },
  clearButton: {
    padding: ms(4),
  },
  clearText: {
    fontSize: ms(16),
    color: '#9CA3AF',
  },
  scrollContent: {
    paddingHorizontal: ms(24),
    paddingTop: ms(8),
  },
  sectionTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(20),
    color: '#111827',
    marginBottom: ms(16),
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: ms(14),
  },
  categoryCard: {
    width: (width - ms(62)) / 2, // Calculate exact half width considering margins
    height: ms(86),
    borderRadius: ms(16),
    justifyContent: 'center',
    paddingLeft: ms(18),
  },
  categoryText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(17),
  },
  trendingList: {
    gap: ms(18),
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendArrow: {
    fontFamily: FONTS.medium24,
    fontSize: ms(16),
    color: COLORS.Primary,
    marginRight: ms(12),
  },
  trendingText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(16),
    color: '#374151',
  },
  filterBar: {
    height: ms(44),
    marginBottom: ms(20),
  },
  filterScroll: {
    paddingHorizontal: ms(24),
    alignItems: 'center',
    gap: ms(10),
  },
  filterTab: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    borderRadius: ms(20),
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  filterTabActive: {
    backgroundColor: COLORS.Primary,
    borderColor: COLORS.Primary,
  },
  filterTabText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(14),
    color: '#4B5563',
  },
  filterTabTextColor: {
    color: '#FFFFFF',
  },
  songsList: {
    gap: ms(16),
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(56),
  },
  songImage: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(12),
    resizeMode: 'cover',
  },
  songDetails: {
    flex: 1,
    marginLeft: ms(16),
    justifyContent: 'center',
  },
  songTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(15),
    color: '#111827',
    includeFontPadding: false,
  },
  songArtist: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13),
    color: '#6B7280',
    marginTop: ms(4),
    includeFontPadding: false,
  },
  moreButton: {
    paddingHorizontal: ms(8),
    height: '100%',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: ms(12),
    color: '#9CA3AF',
    letterSpacing: ms(1),
  },
  libraryListContainer: {
    gap: ms(16),
  },
  libraryRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(68),
  },
  libraryRowImage: {
    width: ms(68),
    height: ms(68),
    borderRadius: ms(34),
    resizeMode: 'cover',
  },
  libraryRowDetails: {
    flex: 1,
    marginLeft: ms(16),
    justifyContent: 'center',
  },
  libraryRowTitle: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(15),
    color: '#111827',
    includeFontPadding: false,
  },
  libraryRowSubtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13),
    color: '#6B7280',
    marginTop: ms(4),
    includeFontPadding: false,
  },
  albumCard: {
    width: ms(110),
  },
  albumImage: {
    width: ms(110),
    height: ms(110),
    borderRadius: ms(16),
    resizeMode: 'cover',
    marginBottom: ms(8),
  },
  albumTitle: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(14),
    color: '#111827',
    includeFontPadding: false,
  },
  albumSubText: {
    fontFamily: FONTS.regular24,
    fontSize: ms(12),
    color: '#6B7280',
    marginTop: ms(2),
  },
  artistCard: {
    width: '31%',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  artistImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 100,
    resizeMode: 'cover',
    marginBottom: ms(8),
  },
  artistName: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(13),
    color: '#111827',
    textAlign: 'center',
  },
  artistsGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ms(60),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ms(60),
  },
  emptyText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(15),
    color: '#9CA3AF',
  },
});
