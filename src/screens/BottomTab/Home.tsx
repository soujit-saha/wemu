import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { myProfileRequest, getDashboardRequest } from '../../redux/reducer/MainReducer';
import Loader from '../../utils/helper/Loader';



const BellIcon = () => (
  <View style={{ width: ms(24), height: ms(24), justifyContent: 'center', alignItems: 'center' }}>
    {/* Bell body */}
    <View style={{ width: ms(14), height: ms(14), borderTopLeftRadius: ms(7), borderTopRightRadius: ms(7), borderWidth: ms(2), borderColor: '#111827', position: 'relative', alignItems: 'center' }}>
      {/* Top small loop */}
      <View style={{ width: ms(4), height: ms(4), borderRadius: ms(2), borderWidth: ms(1.5), borderColor: '#111827', position: 'absolute', top: ms(-5) }} />
    </View>
    {/* Rim */}
    <View style={{ width: ms(18), height: ms(2), backgroundColor: '#111827', borderRadius: ms(1), marginTop: ms(-1) }} />
    {/* Clapper */}
    <View style={{ width: ms(5), height: ms(3), borderBottomLeftRadius: ms(2.5), borderBottomRightRadius: ms(2.5), backgroundColor: '#111827', marginTop: ms(0.5) }} />
  </View>
);

const DownloadIcon = () => (
  <View style={{ width: ms(24), height: ms(24), justifyContent: 'center', alignItems: 'center' }}>
    {/* Downward arrow stem */}
    <View style={{ width: ms(3), height: ms(12), backgroundColor: '#111827', borderRadius: ms(1.5), position: 'absolute', top: ms(2) }} />
    {/* Arrow head */}
    <View style={{ width: ms(8), height: ms(8), borderBottomWidth: ms(3), borderRightWidth: ms(3), borderColor: '#111827', transform: [{ rotate: '45deg' }], position: 'absolute', bottom: ms(6) }} />
    {/* Tray/line at the bottom */}
    <View style={{ width: ms(16), height: ms(2), backgroundColor: '#111827', borderRadius: ms(1), position: 'absolute', bottom: ms(2) }} />
  </View>
);

const Home = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { myProfileRes, getDashboardRes, isMainLoading } = useSelector((state: any) => state.MainReducer);

  useEffect(() => {
    dispatch(myProfileRequest({}));
    dispatch(getDashboardRequest({}));
  }, [dispatch]);

  const displayName = myProfileRes?.name || myProfileRes?.data?.name || 'Alex';

  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 17 ? 'Good afternoon' : 'Good evening';

  const BLOCK_GRADIENTS = [
    ['#6337EB', '#3B82F6'],
    ['#EC4899', '#8B5CF6'],
    ['#10B981', '#059669'],
    ['#F59E0B', '#D97706'],
  ];

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

  const renderSectionHeader = (title: string, artistHeader: boolean = false) => {
    if (artistHeader) {
      return (
        <View style={styles.artistHeaderRow}>
          <Image
            source={{ uri: 'https://picsum.photos/200/200?random=33' }}
            style={styles.artistHeaderAvatar}
          />
          <View>
            <Text style={styles.artistHeaderSubtitle}>More from</Text>
            <Text style={styles.artistHeaderTitle}>The Weeknd</Text>
          </View>
        </View>
      );
    }
    return <Text style={styles.sectionTitle}>{title}</Text>;
  };

  const renderSquareList = (data: any[], rounded: boolean = false, onPress?: (item: any) => void) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.cardContainer}
          activeOpacity={onPress ? 0.8 : 1}
          onPress={onPress ? () => onPress(item) : undefined}
          disabled={!onPress}
        >
          <Image
            source={{ uri: item.image }}
            style={[styles.cardImage, rounded && { borderRadius: ms(12) }]}
          />
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderCircleList = (data: any[], onPress?: (item: any) => void) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.circleContainer}
          activeOpacity={onPress ? 0.8 : 1}
          onPress={onPress ? () => onPress(item) : undefined}
          disabled={!onPress}
        >
          <Image source={{ uri: item.image }} style={styles.circleImage} />
          <Text style={styles.circleTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderChartsList = (data: any[], onPress?: (item: any) => void) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.chartCard}
          activeOpacity={onPress ? 0.8 : 1}
          onPress={onPress ? () => onPress(item) : undefined}
          disabled={!onPress}
        >
          <LinearGradient
            colors={item.colors}
            style={styles.chartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.chartTitle}>{item.title}</Text>
            <Text style={styles.chartSubtitle}>{item.subtitle}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const apiSections = getDashboardRes?.data?.sections || getDashboardRes?.sections;
  const hasDynamicSections = Array.isArray(apiSections) && apiSections.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Loader visible={isMainLoading} />

      {/* Top Header Bar */}
      <View style={[styles.headerContainer, { marginTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.usernameText}>{displayName} 👋</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Notification')}
          >
            <Image source={ICONS.notification} style={{ width: ms(22), height: ms(22), resizeMode: 'contain' }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Downloads')}
          >
            <Image source={ICONS.savefile} style={{ width: ms(22), height: ms(22), resizeMode: 'contain' }} />
          </TouchableOpacity>
        </View>
      </View>


      {/* Content Scroll Area */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + ms(140) }]}
        showsVerticalScrollIndicator={false}
      >
        {hasDynamicSections && (
          apiSections.map((section: any, sectionIdx: number) => {
            const { title, type, items } = section;
            if (!items || items.length === 0) return null;

            const mappedItems = items.map((item: any) => mapItem(item, type));

            // 1. If section type is 'artist'
            if (type === 'artist') {
              return (
                <React.Fragment key={title || sectionIdx}>
                  {renderSectionHeader(title)}
                  {renderCircleList(mappedItems)}
                </React.Fragment>
              );
            }

            // 2. If section type is 'radio'
            if (type === 'radio') {
              return (
                <React.Fragment key={title || sectionIdx}>
                  {renderSectionHeader(title)}
                  {renderCircleList(mappedItems)}
                </React.Fragment>
              );
            }

            // 3. If section type is 'block' (gradient list)
            if (type === 'block') {
              const blockItemsWithColors = mappedItems.map((item: any, idx: number) => ({
                ...item,
                colors: BLOCK_GRADIENTS[idx % BLOCK_GRADIENTS.length],
              }));
              return (
                <React.Fragment key={title || sectionIdx}>
                  {renderSectionHeader(title)}
                  {renderChartsList(blockItemsWithColors)}
                </React.Fragment>
              );
            }

            // 4. If section type is 'song' and title is 'New Release' or contains 'New' (Render as vertical list)
            if (type === 'song' && (title === 'New Release' || title.toLowerCase().includes('new'))) {
              return (
                <React.Fragment key={title || sectionIdx}>
                  {renderSectionHeader(title)}
                  <View style={styles.verticalTracksContainer}>
                    {mappedItems.map((track: any) => (
                      <TouchableOpacity
                        key={track.id}
                        style={styles.trackRow}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('MusicPlay', { track: track.raw || track })}
                      >
                        <Image source={{ uri: track.image }} style={styles.trackImage} />
                        <View style={styles.trackDetails}>
                          <Text style={styles.trackTitle} numberOfLines={1}>
                            {track.title}
                          </Text>
                          <Text style={styles.trackSubtitle} numberOfLines={1}>
                            {track.subtitle}
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
                          <Text style={styles.moreButtonText}>⋮</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </View>
                </React.Fragment>
              );
            }

            // 5. Default song / playlist (Render as square list)
            const isPlaylist = type === 'playlist';
            return (
              <React.Fragment key={title || sectionIdx}>
                {renderSectionHeader(title)}
                {renderSquareList(
                  mappedItems,
                  isPlaylist,
                  type === 'song' ? (track) => navigation.navigate('MusicPlay', { track: track.raw || track }) : undefined
                )}
              </React.Fragment>
            );
          })
        )}
      </ScrollView>

    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    // height: ms(64),
    backgroundColor: '#FFFFFF',
    paddingVertical: ms(10)
  },
  headerLeft: {
    justifyContent: 'center',
  },
  greetingText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(14),
    color: '#6B7280',
    includeFontPadding: false,
  },
  usernameText: {
    fontFamily: FONTS.bold28,
    fontSize: ms(20),
    color: '#111827',
    includeFontPadding: false,
    marginTop: ms(8),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
  },
  headerIconButton: {
    width: ms(36),
    height: ms(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: ms(16),
    paddingBottom: ms(8),
    gap: ms(8),
    backgroundColor: '#FFFFFF',
  },
  activeTag: {
    backgroundColor: '#6337EB',
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    borderRadius: ms(20),
  },
  activeTagText: {
    fontFamily: FONTS.bold24,
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
  scrollContent: {
    paddingTop: ms(16),
  },
  sectionTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(20),
    color: '#111827',
    paddingHorizontal: ms(16),
    marginBottom: ms(12),
    includeFontPadding: false,
  },
  artistHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    marginBottom: ms(12),
    gap: ms(12),
  },
  artistHeaderAvatar: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
  },
  artistHeaderSubtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(11),
    color: '#6B7280',
    includeFontPadding: false,
  },
  artistHeaderTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#111827',
    includeFontPadding: false,
    marginTop: ms(2),
  },
  horizontalScroll: {
    paddingLeft: ms(16),
    paddingRight: ms(8),
    marginBottom: ms(28),
  },
  cardContainer: {
    width: ms(132),
    marginRight: ms(14),
  },
  cardImage: {
    width: ms(132),
    height: ms(132),
    borderRadius: ms(4),
    resizeMode: 'cover',
    marginBottom: ms(8),
  },
  cardTitle: {
    fontFamily: FONTS.bold24,
    fontSize: ms(12),
    color: '#111827',
    marginBottom: ms(4),
    includeFontPadding: false,
  },
  cardSubtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(11),
    color: '#6B7280',
    includeFontPadding: false,
    lineHeight: ms(14),
  },
  circleContainer: {
    width: ms(100),
    marginRight: ms(16),
    alignItems: 'center',
  },
  circleImage: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    resizeMode: 'cover',
    marginBottom: ms(8),
  },
  circleTitle: {
    fontFamily: FONTS.medium24,
    fontSize: ms(12),
    color: '#111827',
    textAlign: 'center',
    includeFontPadding: false,
  },
  chartCard: {
    width: ms(140),
    height: ms(140),
    marginRight: ms(14),
    borderRadius: ms(8),
    overflow: 'hidden',
  },
  chartGradient: {
    flex: 1,
    padding: ms(14),
    justifyContent: 'space-between',
  },
  chartTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(16),
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  chartSubtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(10),
    color: 'rgba(255,255,255,0.7)',
    includeFontPadding: false,
  },
  verticalTracksContainer: {
    paddingHorizontal: ms(16),
    marginBottom: ms(28),
    gap: ms(16),
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(56),
  },
  trackImage: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(4),
  },
  trackDetails: {
    flex: 1,
    marginLeft: ms(14),
    justifyContent: 'center',
  },
  trackTitle: {
    fontFamily: FONTS.bold24,
    fontSize: ms(14),
    color: '#111827',
    includeFontPadding: false,
  },
  trackSubtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(12),
    color: '#6B7280',
    marginTop: ms(4),
    includeFontPadding: false,
  },
  moreButton: {
    paddingHorizontal: ms(8),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButtonText: {
    color: '#9CA3AF',
    fontSize: ms(20),
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
    width: '45%',
    backgroundColor: '#6337EB',
  },
});

