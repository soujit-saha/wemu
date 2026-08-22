import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import FloatingPlayer from '../../component/FloatingPlayer';
import Loader from '../../utils/helper/Loader';
import { getSectionDetailsRequest } from '../../redux/reducer/SubscriptionReducer';

const { width } = Dimensions.get('window');

const mapItem = (item: any, type: string) => {
  switch (type) {
    case 'artist':
      return {
        id: item.id || item.uuid || Math.random().toString(),
        title: item.name || '',
        subtitle: '',
        image: item.image_path || 'https://picsum.photos/200/200?random=artist',
        raw: item,
      };
    case 'radio':
      return {
        id: item.id || item.uuid || Math.random().toString(),
        title: item.name || '',
        subtitle: item.username ? `@${item.username}` : '',
        image: item.image_path || 'https://picsum.photos/200/200?random=radio',
        raw: item,
      };
    case 'playlist':
      return {
        id: item.id || item.uuid || Math.random().toString(),
        title: item.title || '',
        subtitle: item.description || '',
        image: item.cover_image_path || 'https://picsum.photos/200/200?random=playlist',
        raw: item,
      };
    case 'block':
      return {
        id: item.title || Math.random().toString(),
        title: item.title || '',
        subtitle: item.description || '',
        raw: item,
      };
    case 'song':
    default:
      return {
        id: item.id || item.uuid || Math.random().toString(),
        title: item.title || '',
        subtitle: [item.featured_artists, item.other_artists].filter(Boolean).join(', ') || item.description || '',
        image: item.cover_image_path || 'https://picsum.photos/200/200?random=song',
        raw: item,
      };
  }
};

const SeeAll = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { type_id, title, type: routeType } = route.params || {};

  // Fetch section details from API
  useEffect(() => {
    if (type_id) {
      dispatch(getSectionDetailsRequest({ type_id }));
    }
  }, [dispatch, type_id]);

  const { sectionDetailsRes, isLoading } = useSelector(
    (state: any) => state.SubscriptionReducer
  );

  const items = Array.isArray(sectionDetailsRes)
    ? sectionDetailsRes
    : (sectionDetailsRes?.data?.items || sectionDetailsRes?.items || []);
  const type = routeType || '';
  const titleText = title || 'See All';

  const mappedItems = items.map((item: any) => mapItem(item, type));

  const renderContent = () => {
    if (isLoading) {
      return null;
    }

    if (items.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No items found</Text>
        </View>
      );
    }

    if (type === 'song') {
      return (
        <View style={styles.tracksContainer}>
          {mappedItems.map((track: any) => (
            <TouchableOpacity
              key={track.id}
              style={styles.trackRow}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MusicPlay', { track: track.raw || track })}
            >
              <Image source={{ uri: track.image }} style={styles.trackArt} />
              <View style={styles.trackDetails}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {track.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {track.subtitle}
                </Text>
              </View>
              {/* <TouchableOpacity style={styles.optionsButton} activeOpacity={0.7}>
                <Text style={styles.optionsText}>•••</Text>
              </TouchableOpacity> */}
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (type === 'artist' || type === 'radio') {
      const isArtist = type === 'artist';
      return (
        <View style={styles.gridContainer}>
          {mappedItems.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={styles.artistGridCard}
              activeOpacity={0.8}
              disabled={!isArtist}
              onPress={
                isArtist
                  ? () => navigation.navigate('ArtistsDetails', { artist: item })
                  : undefined
              }
            >
              <Image source={{ uri: item.image }} style={styles.artistGridImage} />
              <Text style={styles.artistGridName} numberOfLines={1}>
                {item.title}
              </Text>
              {item.subtitle ? (
                <Text style={styles.artistGridSubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (type === 'playlist') {
      return (
        <View style={styles.playlistGridContainer}>
          {mappedItems.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={styles.playlistGridCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('PlayList', { playlist: item.raw || item })}
            >
              <Image source={{ uri: item.image }} style={styles.playlistGridImage} />
              <Text style={styles.playlistGridTitle} numberOfLines={1}>
                {item.title}
              </Text>
              {item.subtitle ? (
                <Text style={styles.playlistGridSubtitle} numberOfLines={2}>
                  {item.subtitle}
                </Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>Unsupported section type</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Loader visible={isLoading} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image source={ICONS.leftarrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {titleText}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderContent()}
      </ScrollView>

      {/* Floating Mini Player */}
      <FloatingPlayer />
    </SafeAreaView>
  );
};

export default SeeAll;

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
    maxWidth: width - ms(120),
  },
  headerSpacer: {
    width: ms(36),
  },
  scrollContent: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(140), // spacing for floating player
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ms(100),
  },
  noDataText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(16),
    color: '#6B7280',
    includeFontPadding: false,
  },
  // Tracks styles
  tracksContainer: {
    gap: ms(16),
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(56),
  },
  trackArt: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(4),
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
    marginTop: ms(4),
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
  // Grid styles for Artist/Radio
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: ms(16),
  },
  artistGridCard: {
    width: (width - ms(64)) / 3, // 3 columns
    alignItems: 'center',
    marginBottom: ms(16),
  },
  artistGridImage: {
    width: (width - ms(64)) / 3 - ms(8),
    height: (width - ms(64)) / 3 - ms(8),
    borderRadius: ((width - ms(64)) / 3 - ms(8)) / 2,
    backgroundColor: '#F3F4F6',
    resizeMode: 'cover',
    marginBottom: ms(8),
  },
  artistGridName: {
    fontFamily: FONTS.medium24,
    fontSize: ms(12),
    color: '#111827',
    textAlign: 'center',
    includeFontPadding: false,
  },
  artistGridSubtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(10),
    color: '#6B7280',
    textAlign: 'center',
    includeFontPadding: false,
    marginTop: ms(2),
  },
  // Playlist grid styles
  playlistGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playlistGridCard: {
    width: (width - ms(48)) / 2, // 2 columns
    marginBottom: ms(20),
  },
  playlistGridImage: {
    width: '100%',
    height: (width - ms(48)) / 2,
    borderRadius: ms(8),
    backgroundColor: '#F3F4F6',
    resizeMode: 'cover',
    marginBottom: ms(8),
  },
  playlistGridTitle: {
    fontFamily: FONTS.bold24,
    fontSize: ms(13),
    color: '#111827',
    includeFontPadding: false,
    marginBottom: ms(4),
  },
  playlistGridSubtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(11),
    color: '#6B7280',
    includeFontPadding: false,
    lineHeight: ms(14),
  },
});
