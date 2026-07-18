import React from 'react';
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
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';

const ARTISTS = [
  {
    id: '1',
    name: 'Darshan Raval',
    image: 'https://picsum.photos/200/200?random=101',
  },
  {
    id: '2',
    name: 'Tulsi Kumar',
    image: 'https://picsum.photos/200/200?random=102',
  },
  {
    id: '3',
    name: 'Badshah',
    image: 'https://picsum.photos/200/200?random=103',
  },
  {
    id: '4',
    name: 'Arijit Singh',
    image: 'https://picsum.photos/200/200?random=104',
  },
];

const Library = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
      <View style={[styles.header, { marginTop: insets.top }]}>
        <View style={styles.headerLeft}>
          {/* Green Circle with initials */}

          <Text style={styles.headerTitle}>Your Library</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Search Icon */}
          <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
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

      {/* Filter Tag scrollview */}
      <View style={styles.tagsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
          <TouchableOpacity style={styles.activeTag} activeOpacity={0.8}>
            <Text style={styles.activeTagText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTag} activeOpacity={0.8}>
            <Text style={styles.inactiveTagText}>Playlists</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTag} activeOpacity={0.8}>
            <Text style={styles.inactiveTagText}>Albums</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTag} activeOpacity={0.8}>
            <Text style={styles.inactiveTagText}>Artists</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Sorting & Layout Toggle Row */}
      <View style={styles.sortRow}>
        <TouchableOpacity style={styles.sortButton} activeOpacity={0.7}>
          <Text style={styles.sortText}>⇅ Recents</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.layoutButton} activeOpacity={0.7}>
          <View style={styles.gridIconContainer}>
            <View style={styles.gridSquare} />
            <View style={styles.gridSquare} />
            <View style={styles.gridSquare} />
            <View style={styles.gridSquare} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Main List content */}
      <ScrollView
        contentContainerStyle={[styles.listScrollContent, { paddingBottom: insets.bottom + ms(90) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Import Banner Callout */}
        {/* <TouchableOpacity style={styles.importBanner} activeOpacity={0.85}>
          <View style={styles.importBannerLeft}>
            <View style={styles.importIconCircle}>
              <Image
                source={{ uri: 'https://img.icons8.com/material-outlined/60/000000/download.png' }}
                style={styles.bannerDownloadIcon}
              />
            </View>
            <Text style={styles.importBannerText}>Import your music from{"\n"}other apps</Text>
          </View>
          <Text style={styles.chevronRight}>&gt;</Text>
        </TouchableOpacity> */}

        {/* Playlist item */}
        <TouchableOpacity
          style={styles.artistItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PlayList')}
        >
          <View style={[styles.artistImage, { backgroundColor: '#581C87', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: ms(22) }}>🎵</Text>
          </View>
          <View style={styles.artistDetails}>
            <Text style={styles.artistName}>Chill Vibes</Text>
            <Text style={styles.artistRole}>Playlist • 45 songs</Text>
          </View>
        </TouchableOpacity>

        {/* Album item */}
        <TouchableOpacity
          style={styles.artistItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Album')}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop' }}
            style={styles.artistImage}
          />
          <View style={styles.artistDetails}>
            <Text style={styles.artistName}>After Hours</Text>
            <Text style={styles.artistRole}>Album • The Weeknd</Text>
          </View>
        </TouchableOpacity>

        {/* Artist list items */}
        {ARTISTS.map((artist) => (
          <TouchableOpacity key={artist.id} style={styles.artistItem} activeOpacity={0.7}>
            <Image source={{ uri: artist.image }} style={styles.artistImage} />
            <View style={styles.artistDetails}>
              <Text style={styles.artistName}>{artist.name}</Text>
              <Text style={styles.artistRole}>Artist</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Action List items */}
        <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIconText}>+</Text>
          </View>
          <Text style={styles.actionName}>Add artists</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIconText}>+</Text>
          </View>
          <Text style={styles.actionName}>Add podcasts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
          <View style={styles.actionIconCircle}>
            <Text style={styles.actionIconText}>+</Text>
          </View>
          <Text style={styles.actionName}>Add events and venues</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
          <View style={styles.actionIconCircle}>
            <Image
              source={{ uri: 'https://img.icons8.com/material-outlined/60/000000/download.png' }}
              style={styles.actionDownloadIcon}
            />
          </View>
          <Text style={styles.actionName}>Import your music</Text>
        </TouchableOpacity>

        <View style={{ height: ms(100) }} />
      </ScrollView>


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