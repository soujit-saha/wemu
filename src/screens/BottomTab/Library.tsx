import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  myPlaylistsRequest,
  albumsRequest,
  artistsRequest,
} from '../../redux/reducer/SongReducer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { useTranslation } from '../../utils/hooks/useTranslation';

import { TextInput, FlatList } from 'react-native';

const Library = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<
    'playlists' | 'albums' | 'artists'
  >('playlists');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [localData, setLocalData] = useState<any[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const per_page = 15;

  const { myPlaylistsRes, albumsRes, artistsRes, isLoading } = useSelector(
    (state: any) => state.SongReducer,
  );

  const fetchData = (
    pageNum: number,
    searchKey: string,
    currentTab: string,
  ) => {
    const payload = { page: pageNum, per_page, keyword: searchKey };
    if (currentTab === 'playlists') dispatch(myPlaylistsRequest(payload));
    else if (currentTab === 'albums') dispatch(albumsRequest(payload));
    else if (currentTab === 'artists') dispatch(artistsRequest(payload));
  };

  const skipSearchEffect = React.useRef(true);

  // When tab changes or screen comes into focus, reset everything and fetch
  useFocusEffect(
    useCallback(() => {
      setPage(1);
      skipSearchEffect.current = true;
      setKeyword('');
      setLocalData([]);
      setIsSearchVisible(false);
      fetchData(1, '', activeTab);
    }, [activeTab, dispatch])
  );

  // Handle debounced search
  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }
    const delay = setTimeout(() => {
      setPage(1);
      setLocalData([]); // Clear previous results immediately on search
      fetchData(1, keyword, activeTab);
    }, 500);
    return () => clearTimeout(delay);
  }, [keyword]);

  // Sync Redux response to localData for appending (pagination)
  useFocusEffect(
    useCallback(() => {
      let newData: any[] = [];
      if (activeTab === 'playlists')
        newData = myPlaylistsRes?.data?.result || myPlaylistsRes?.data || [];
      else if (activeTab === 'albums') newData = albumsRes?.data?.result || [];
      else if (activeTab === 'artists')
        newData = artistsRes?.data?.result || [];

      if (!Array.isArray(newData)) newData = [];

      if (page === 1) {
        setLocalData(newData);
      } else {
        setLocalData(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const filtered = newData.filter(n => !existingIds.has(n.id));
          return [...prev, ...filtered];
        });
      }
    }, [myPlaylistsRes, albumsRes, artistsRes]),
  );

  const loadMore = () => {
    if (
      !isLoading &&
      localData.length > 0 &&
      localData.length % per_page === 0
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, keyword, activeTab);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{t('yourLibrary')}</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Search Icon */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconButton}
            onPress={() => setIsSearchVisible(!isSearchVisible)}
          >
            <Image source={ICONS.search} style={styles.headerIcon} />
          </TouchableOpacity>
          {/* Add Icon */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconButton}
            onPress={() => navigation.navigate('CreatePlayList')}
          >
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar (Conditionally Visible) */}
      {isSearchVisible && (
        <View style={{ paddingHorizontal: ms(16), marginBottom: ms(8) }}>
          <TextInput
            style={{
              height: ms(40),
              backgroundColor: '#F3F4F6',
              borderRadius: ms(20),
              paddingHorizontal: ms(16),
              fontFamily: FONTS.regular24,
              fontSize: ms(14),
              color: '#111827',
            }}
            placeholder={t('search')}
            placeholderTextColor="#9CA3AF"
            value={keyword}
            onChangeText={setKeyword}
          />
        </View>
      )}

      {/* Filter Tag scrollview */}
      <View style={styles.tagsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsScroll}
        >
          <TouchableOpacity
            style={
              activeTab === 'playlists' ? styles.activeTag : styles.inactiveTag
            }
            activeOpacity={0.8}
            onPress={() => setActiveTab('playlists')}
          >
            <Text
              style={
                activeTab === 'playlists'
                  ? styles.activeTagText
                  : styles.inactiveTagText
              }
            >
              {t('playlists')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              activeTab === 'albums' ? styles.activeTag : styles.inactiveTag
            }
            activeOpacity={0.8}
            onPress={() => setActiveTab('albums')}
          >
            <Text
              style={
                activeTab === 'albums'
                  ? styles.activeTagText
                  : styles.inactiveTagText
              }
            >
              {t('albums')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              activeTab === 'artists' ? styles.activeTag : styles.inactiveTag
            }
            activeOpacity={0.8}
            onPress={() => setActiveTab('artists')}
          >
            <Text
              style={
                activeTab === 'artists'
                  ? styles.activeTagText
                  : styles.inactiveTagText
              }
            >
              {t('artists')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={localData}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={[
          styles.listScrollContent,
          { paddingBottom: insets.bottom + ms(90) },
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={() => (
          <View style={styles.sortRow}>
            <TouchableOpacity style={styles.sortButton} activeOpacity={0.7}>
              <Text style={styles.sortText}>⇅ {t('recents')}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() =>
          !isLoading ? (
            <View style={{ alignItems: 'center', marginTop: ms(40) }}>
              <Text
                style={{
                  color: '#6B7280',
                  fontFamily: FONTS.medium24,
                  fontSize: ms(14),
                }}
              >
                No {activeTab} found.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={() =>
          isLoading ? (
            <ActivityIndicator
              size="large"
              color="#6337EB"
              style={{ marginVertical: ms(20) }}
            />
          ) : null
        }
        renderItem={({ item }) => {
          if (activeTab === 'playlists') {
            return (
              <TouchableOpacity
                style={styles.artistItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('PlayList', { id: item.id })}
              >
                {item.cover_image_path || item.cover_image ? (
                  <Image
                    source={{ uri: item.cover_image_path || item.cover_image }}
                    style={styles.artistImage}
                  />
                ) : (
                  <View
                    style={[
                      styles.artistImage,
                      {
                        backgroundColor: '#581C87',
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                  >
                    <Text style={{ fontSize: ms(22) }}>🎵</Text>
                  </View>
                )}
                <View style={styles.artistDetails}>
                  <Text style={styles.artistName}>
                    {item.title || item.name}
                  </Text>
                  <Text style={styles.artistRole}>
                    {t('playlist')} • {item.songs_count || 0} {t('songs')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          if (activeTab === 'albums') {
            return (
              <TouchableOpacity
                style={styles.artistItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Album', { id: item })}
              >
                <Image
                  source={{
                    uri:
                      item.image ||
                      item.cover_image ||
                      'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop',
                  }}
                  style={styles.artistImage}
                />
                <View style={styles.artistDetails}>
                  <Text style={styles.artistName}>
                    {item.title || item.name}
                  </Text>
                  <Text style={styles.artistRole}>
                    {t('album')}{' '}
                    {item.artist_name ? `• ${item.artist_name}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          if (activeTab === 'artists') {
            return (
              <TouchableOpacity style={styles.artistItem} activeOpacity={0.7} onPress={() => navigation.navigate('ArtistsDetails', { artist: item })}>
                <Image
                  source={{
                    uri:
                      item.cover_image_path ||
                      item.image ||
                      'https://picsum.photos/200',
                  }}
                  style={styles.artistImage}
                />
                <View style={styles.artistDetails}>
                  <Text style={styles.artistName}>
                    {item.name || item.title}
                  </Text>
                  <Text style={styles.artistRole}>{t('artist')}</Text>
                </View>
              </TouchableOpacity>
            );
          }

          return null;
        }}
      />
    </View>
  );
};

export default Library;

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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: '#6337EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: FONTS.bold28,
    fontSize: ms(15),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  headerTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(20),
    color: '#111827',
    // marginLeft: ms(16),
    includeFontPadding: false,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
  },
  iconButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: ms(22),
    height: ms(22),
    tintColor: '#111827',
    resizeMode: 'contain',
  },
  plusText: {
    fontSize: ms(26),
    color: '#111827',
    fontFamily: FONTS.medium24,
    includeFontPadding: false,
  },
  tagsContainer: {
    height: ms(44),
    marginTop: ms(8),
    marginBottom: ms(8),
  },
  tagsScroll: {
    paddingHorizontal: ms(16),
    alignItems: 'center',
    gap: ms(8),
  },
  activeTag: {
    backgroundColor: '#6337EB',
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    borderRadius: ms(20),
  },
  activeTagText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(13),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  inactiveTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    borderRadius: ms(20),
  },
  inactiveTagText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(13),
    color: '#4B5563',
    includeFontPadding: false,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    height: ms(40),
    marginBottom: ms(8),
  },
  sortButton: {
    paddingVertical: ms(4),
  },
  sortText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(13),
    color: '#6B7280',
    includeFontPadding: false,
  },
  layoutButton: {
    width: ms(32),
    height: ms(32),
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  gridIconContainer: {
    width: ms(16),
    height: ms(16),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  gridSquare: {
    width: ms(7),
    height: ms(7),
    backgroundColor: '#111827',
    borderRadius: ms(1),
  },
  listScrollContent: {
    paddingHorizontal: ms(16),
    paddingTop: ms(8),
    gap: ms(16),
  },
  importBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    borderRadius: ms(12),
    paddingHorizontal: ms(16),
    paddingVertical: ms(14),
    marginBottom: ms(8),
  },
  importBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  importIconCircle: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerDownloadIcon: {
    width: ms(20),
    height: ms(20),
    tintColor: '#111827',
    resizeMode: 'contain',
  },
  importBannerText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(13),
    color: '#111827',
    marginLeft: ms(16),
    includeFontPadding: false,
    lineHeight: ms(18),
  },
  chevronRight: {
    fontSize: ms(16),
    fontFamily: FONTS.medium24,
    color: '#6B7280',
  },
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(68),
  },
  artistImage: {
    width: ms(68),
    height: ms(68),
    borderRadius: ms(34),
    resizeMode: 'cover',
  },
  artistDetails: {
    flex: 1,
    marginLeft: ms(16),
    justifyContent: 'center',
  },
  artistName: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(15),
    color: '#111827',
    includeFontPadding: false,
  },
  artistRole: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13),
    color: '#6B7280',
    marginTop: ms(4),
    includeFontPadding: false,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(56),
  },
  actionIconCircle: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(28),
    backgroundColor: '#F3F4F6',
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconText: {
    fontSize: ms(24),
    color: '#111827',
    fontFamily: FONTS.medium24,
    includeFontPadding: false,
  },
  actionDownloadIcon: {
    width: ms(20),
    height: ms(20),
    tintColor: '#111827',
    resizeMode: 'contain',
  },
  actionName: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(15),
    color: '#111827',
    marginLeft: ms(16),
    includeFontPadding: false,
  },
  miniPlayerContainer: {
    position: 'absolute',
    left: ms(8),
    right: ms(8),
    height: ms(64),
    borderRadius: ms(8),
    backgroundColor: '#F3F4F6',
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  miniPlayerInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(8),
  },
  playerArt: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(6),
    resizeMode: 'cover',
  },
  playerDetails: {
    flex: 1,
    marginLeft: ms(12),
    justifyContent: 'center',
  },
  playerTitle: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(13),
    color: '#111827',
    includeFontPadding: false,
  },
  playerArtist: {
    fontFamily: FONTS.regular24,
    fontSize: ms(11),
    color: '#6B7280',
    marginTop: ms(2),
    includeFontPadding: false,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
  },
  controlIconBtn: {
    width: ms(36),
    height: ms(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    width: ms(22),
    height: ms(22),
    tintColor: '#111827',
    resizeMode: 'contain',
  },
  playArrowIcon: {
    width: ms(18),
    height: ms(18),
    tintColor: '#111827',
    resizeMode: 'contain',
  },
  progressLineBackground: {
    height: ms(2),
    width: '100%',
    backgroundColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
  },
  progressLineActive: {
    height: '100%',
    width: '45%', // Simulate 45% progress
    backgroundColor: '#6337EB',
  },
});
