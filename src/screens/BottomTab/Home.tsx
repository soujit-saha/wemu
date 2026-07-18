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
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';

// Mock Datasets for Pixel-Perfect Sections
const TOP_STORIES = [
  {
    id: 'ts1',
    title: 'What should I...',
    subtitle: 'My Last Word',
    image: 'https://picsum.photos/200/200?random=1',
  },
  {
    id: 'ts2',
    title: 'Let it go...',
    subtitle: 'Nostalgia',
    image: 'https://picsum.photos/200/200?random=2',
  },
  {
    id: 'ts3',
    title: 'The stories of...',
    subtitle: 'My Passion',
    image: 'https://picsum.photos/200/200?random=3',
  },
  {
    id: 'ts4',
    title: 'Echoes of silence',
    subtitle: 'Lost Dreams',
    image: 'https://picsum.photos/200/200?random=34',
  },
];

const RECOMMENDED = [
  {
    id: 'rec1',
    title: 'Topic',
    subtitle: 'The Weeknd',
    image: 'https://picsum.photos/200/200?random=4',
  },
  {
    id: 'rec2',
    title: 'Album',
    subtitle: 'Taylor Swift',
    image: 'https://picsum.photos/200/200?random=5',
  },
  {
    id: 'rec3',
    title: 'Mix',
    subtitle: 'Daily Mix 1',
    image: 'https://picsum.photos/200/200?random=6',
  },
  {
    id: 'rec4',
    title: 'Artist Radio',
    subtitle: 'Weekend Hits',
    image: 'https://picsum.photos/200/200?random=35',
  },
];

const RADIO_STATIONS = [
  {
    id: 'rad1',
    title: 'The Weeknd',
    subtitle: 'Synthwave Radio',
    image: 'https://picsum.photos/200/200?random=7',
  },
  {
    id: 'rad2',
    title: 'Eminem',
    subtitle: 'Hip Hop Radio',
    image: 'https://picsum.photos/200/200?random=8',
  },
  {
    id: 'rad3',
    title: 'Drake',
    subtitle: 'Rap Radio',
    image: 'https://picsum.photos/200/200?random=9',
  },
  {
    id: 'rad4',
    title: 'Lofi Beats',
    subtitle: 'Chill Study Radio',
    image: 'https://picsum.photos/200/200?random=36',
  },
];

const START_LISTENING = [
  {
    id: 'sl1',
    title: 'Blinding Lights',
    subtitle: 'The Weeknd • After Hours',
    image: 'https://picsum.photos/200/200?random=10',
  },
  {
    id: 'sl2',
    title: 'Shape of You',
    subtitle: 'Ed Sheeran • ÷',
    image: 'https://picsum.photos/200/200?random=11',
  },
  {
    id: 'sl3',
    title: 'Flowers',
    subtitle: 'Miley Cyrus • Endless Summer Vacation',
    image: 'https://picsum.photos/200/200?random=12',
  },
  {
    id: 'sl4',
    title: 'As It Was',
    subtitle: 'Harry Styles • Harry\'s House',
    image: 'https://picsum.photos/200/200?random=37',
  },
];

const FROM_ARIJIT = [
  {
    id: 'fa1',
    title: 'Save Your Tears',
    subtitle: 'The Weeknd',
    image: 'https://picsum.photos/200/200?random=13',
  },
  {
    id: 'fa2',
    title: 'Blinding Lights',
    subtitle: 'The Weeknd',
    image: 'https://picsum.photos/200/200?random=14',
  },
  {
    id: 'fa3',
    title: 'Starboy',
    subtitle: 'The Weeknd ft. Daft Punk',
    image: 'https://picsum.photos/200/200?random=15',
  },
  {
    id: 'fa4',
    title: 'Die For You',
    subtitle: 'The Weeknd',
    image: 'https://picsum.photos/200/200?random=38',
  },
];

const POPULAR_RADIO = [
  {
    id: 'pr1',
    title: 'BBC Radio 1',
    subtitle: '97.1 FM',
    image: 'https://picsum.photos/200/200?random=16',
  },
  {
    id: 'pr2',
    title: 'Capital FM',
    subtitle: '95.8 FM',
    image: 'https://picsum.photos/200/200?random=17',
  },
  {
    id: 'pr3',
    title: 'KIIS FM',
    subtitle: '102.7 FM',
    image: 'https://picsum.photos/200/200?random=39',
  },
  {
    id: 'pr4',
    title: 'Heart FM',
    subtitle: '96.2 FM',
    image: 'https://picsum.photos/200/200?random=40',
  },
];

const PUNJABI = [
  {
    id: 'pun1',
    title: 'Bad Habits',
    subtitle: 'Ed Sheeran',
    image: 'https://picsum.photos/200/200?random=18',
  },
  {
    id: 'pun2',
    title: 'Levitating',
    subtitle: 'Dua Lipa',
    image: 'https://picsum.photos/200/200?random=19',
  },
  {
    id: 'pun3',
    title: 'Stay',
    subtitle: 'The Kid LAROI & Justin Bieber',
    image: 'https://picsum.photos/200/200?random=41',
  },
  {
    id: 'pun4',
    title: 'As It Was',
    subtitle: 'Harry Styles',
    image: 'https://picsum.photos/200/200?random=42',
  },
];

const NEW_RELEASE = [
  {
    id: 'nr1',
    title: 'Anti-Hero',
    subtitle: 'Taylor Swift',
    image: 'https://picsum.photos/200/200?random=20',
  },
  {
    id: 'nr2',
    title: 'Cruel Summer',
    subtitle: 'Taylor Swift',
    image: 'https://picsum.photos/200/200?random=21',
  },
  {
    id: 'nr3',
    title: 'Paint The Town Red',
    subtitle: 'Doja Cat',
    image: 'https://picsum.photos/200/200?random=43',
  },
  {
    id: 'nr4',
    title: 'Vampire',
    subtitle: 'Olivia Rodrigo',
    image: 'https://picsum.photos/200/200?random=44',
  },
];

const POPULAR_ARTISTS = [
  {
    id: 'art1',
    title: 'The Weeknd',
    image: 'https://picsum.photos/200/200?random=22',
  },
  {
    id: 'art2',
    title: 'Taylor Swift',
    image: 'https://picsum.photos/200/200?random=23',
  },
  {
    id: 'art3',
    title: 'Ed Sheeran',
    image: 'https://picsum.photos/200/200?random=24',
  },
  {
    id: 'art4',
    title: 'Drake',
    image: 'https://picsum.photos/200/200?random=45',
  },
];

const SUGGESTED_ARTISTS = [
  {
    id: 'sart1',
    title: 'Billie Eilish',
    image: 'https://picsum.photos/200/200?random=25',
  },
  {
    id: 'sart2',
    title: 'Dua Lipa',
    image: 'https://picsum.photos/200/200?random=26',
  },
  {
    id: 'sart3',
    title: 'Ariana Grande',
    image: 'https://picsum.photos/200/200?random=46',
  },
  {
    id: 'sart4',
    title: 'Bruno Mars',
    image: 'https://picsum.photos/200/200?random=47',
  },
];

const FEATURED_CHARTS = [
  {
    id: 'ch1',
    title: 'Top Songs\nSpanish',
    subtitle: 'Weekly updates',
    colors: ['#E02424', '#7F1D1D'],
  },
  {
    id: 'ch2',
    title: 'Top Songs\nGlobal',
    subtitle: 'Weekly updates',
    colors: ['#1E3A8A', '#1D4ED8'],
  },

];

const TOP_PODCASTS = [
  {
    id: 'pod1',
    title: 'The Daily',
    subtitle: 'The New York Times',
    image: 'https://picsum.photos/200/200?random=27',
  },
  {
    id: 'pod2',
    title: 'The Joe Rogan Exp',
    subtitle: 'Joe Rogan',
    image: 'https://picsum.photos/200/200?random=28',
  },
  {
    id: 'pod3',
    title: 'TED Talks Daily',
    subtitle: 'TED',
    image: 'https://picsum.photos/200/200?random=48',
  },
  {
    id: 'pod4',
    title: 'Call Her Daddy',
    subtitle: 'Alex Cooper',
    image: 'https://picsum.photos/200/200?random=49',
  },
];

const RECENTLY_PLAYED = [
  {
    id: 'rp1',
    title: 'Creepin\'',
    subtitle: 'Metro Boomin, The Weeknd',
    image: 'https://picsum.photos/200/200?random=29',
  },
  {
    id: 'rp2',
    title: 'Flowers',
    subtitle: 'Miley Cyrus',
    image: 'https://picsum.photos/200/200?random=14',
  },
  {
    id: 'rp3',
    title: 'As It Was',
    subtitle: 'Harry Styles',
    image: 'https://picsum.photos/200/200?random=13',
  },
  {
    id: 'rp4',
    title: 'Unholy',
    subtitle: 'Sam Smith, Kim Petras',
    image: 'https://picsum.photos/200/200?random=10',
  },
];

const CLASSIC = [
  {
    id: 'cl1',
    title: 'Bohemian Rhapsody',
    subtitle: 'Queen',
    image: 'https://picsum.photos/200/200?random=30',
  },
  {
    id: 'cl2',
    title: 'Hotel California',
    subtitle: 'Eagles',
    image: 'https://picsum.photos/200/200?random=50',
  },
  {
    id: 'cl3',
    title: 'Imagine',
    subtitle: 'John Lennon',
    image: 'https://picsum.photos/200/200?random=51',
  },
  {
    id: 'cl4',
    title: 'Yesterday',
    subtitle: 'The Beatles',
    image: 'https://picsum.photos/200/200?random=52',
  },
];

const WORKOUT = [
  {
    id: 'wo1',
    title: 'Believer',
    subtitle: 'Imagine Dragons',
    image: 'https://picsum.photos/200/200?random=31',
  },
  {
    id: 'wo2',
    title: 'Eye of the Tiger',
    subtitle: 'Survivor',
    image: 'https://picsum.photos/200/200?random=53',
  },
  {
    id: 'wo3',
    title: 'Remember the Name',
    subtitle: 'Fort Minor',
    image: 'https://picsum.photos/200/200?random=54',
  },
  {
    id: 'wo4',
    title: 'Till I Collapse',
    subtitle: 'Eminem',
    image: 'https://picsum.photos/200/200?random=55',
  },
];

const PARTY = [
  {
    id: 'pty1',
    title: 'One Kiss',
    subtitle: 'Calvin Harris, Dua Lipa',
    image: 'https://picsum.photos/200/200?random=32',
  },
  {
    id: 'pty2',
    title: 'Don\'t Start Now',
    subtitle: 'Dua Lipa',
    image: 'https://picsum.photos/200/200?random=56',
  },
  {
    id: 'pty3',
    title: 'Uptown Funk',
    subtitle: 'Mark Ronson ft. Bruno Mars',
    image: 'https://picsum.photos/200/200?random=57',
  },
  {
    id: 'pty4',
    title: 'Can\'t Stop the Feeling!',
    subtitle: 'Justin Timberlake',
    image: 'https://picsum.photos/200/200?random=58',
  },
];

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

  const renderSquareList = (data: any[], rounded: boolean = false) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
      {data.map((item) => (
        <TouchableOpacity key={item.id} style={styles.cardContainer} activeOpacity={0.8}>
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

  const renderCircleList = (data: any[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
      {data.map((item) => (
        <TouchableOpacity key={item.id} style={styles.circleContainer} activeOpacity={0.8}>
          <Image source={{ uri: item.image }} style={styles.circleImage} />
          <Text style={styles.circleTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderChartsList = (data: any[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
      {data.map((item) => (
        <TouchableOpacity key={item.id} style={styles.chartCard} activeOpacity={0.8}>
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Bar */}
      <View style={[styles.headerContainer, { marginTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.greetingText}>Good morning,</Text>
          <Text style={styles.usernameText}>Alex 👋</Text>
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
        {/* 1. Top Stories */}
        {/* {renderSectionHeader('Top stories')}
        {renderSquareList(TOP_STORIES)} */}

        {/* 2. Recommended to enjoy */}
        {/* {renderSectionHeader('Recommended to enjoy')}
        {renderSquareList(RECOMMENDED)} */}

        {/* 3. Discover radio stations */}
        {renderSectionHeader('Top Stories')}
        {renderSquareList(RADIO_STATIONS, true)}

        {/* 4. Start listening (Vertical Tracks) */}
        {renderSectionHeader('Start listening')}
        <View style={styles.verticalTracksContainer}>
          {START_LISTENING.map((track) => (
            <TouchableOpacity
              key={track.id}
              style={styles.trackRow}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('MusicPlay')}
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


        {/* 9. Popular artist */}
        {renderSectionHeader('Popular artist')}
        {renderCircleList(POPULAR_ARTISTS)}

        {/* 10. Suggested artists */}
        {renderSectionHeader('Suggested artists')}
        {renderCircleList(SUGGESTED_ARTISTS)}

        {/* 11. Featured Charts */}
        {renderSectionHeader('Featured Songs')}
        {renderChartsList(FEATURED_CHARTS)}

        {/* 5. More from The Weeknd */}
        {renderSectionHeader('', true)}
        {renderSquareList(FROM_ARIJIT)}

        {/* 6. Popular radio recording track */}
        {renderSectionHeader('Popular radio recording track')}
        {renderSquareList(POPULAR_RADIO, true)}

        {/* 7. Pop Hits */}
        {renderSectionHeader('Pop Hits')}
        {renderSquareList(PUNJABI)}

        {/* 8. New Release */}
        {renderSectionHeader('New Release')}
        {renderSquareList(NEW_RELEASE)}



        {/* 12. Top podcast episodes */}
        {renderSectionHeader('Top podcast episodes')}
        {renderSquareList(TOP_PODCASTS)}

        {/* 13. Recently played */}
        {renderSectionHeader('Recently played')}
        {renderSquareList(RECENTLY_PLAYED)}

        {/* 14. Classic */}
        {renderSectionHeader('Classic')}
        {renderSquareList(CLASSIC)}

        {/* 15. Workout */}
        {renderSectionHeader('Workout')}
        {renderSquareList(WORKOUT)}

        {/* 16. Party */}
        {renderSectionHeader('Party')}
        {renderSquareList(PARTY)}
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

