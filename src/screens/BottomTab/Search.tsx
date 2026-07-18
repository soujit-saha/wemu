import React, { useState } from 'react';
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
    FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import FloatingPlayer from '../../component/FloatingPlayer';

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

const SONG_RESULTS = [
    {
        id: '1',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        image: 'https://picsum.photos/200/200?random=110',
    },
    {
        id: '2',
        title: 'Starboy',
        artist: 'The Weeknd',
        image: 'https://picsum.photos/200/200?random=111',
    },
    {
        id: '3',
        title: 'Save Your Tears',
        artist: 'The Weeknd',
        image: 'https://picsum.photos/200/200?random=112',
    },
    {
        id: '4',
        title: 'Die For You',
        artist: 'The Weeknd',
        image: 'https://picsum.photos/200/200?random=113',
    },
];

const ALBUM_RESULTS = [
    {
        id: 'a1',
        title: 'After Hours',
        year: '2020',
        image: 'https://picsum.photos/200/200?random=114',
    },
    {
        id: 'a2',
        title: 'Starboy',
        year: '2016',
        image: 'https://picsum.photos/200/200?random=115',
    },
    {
        id: 'a3',
        title: 'Dawn FM',
        year: '2022',
        image: 'https://picsum.photos/200/200?random=116',
    },
];

const FILTER_TABS = ['Top', 'Songs', 'Albums', 'Artists', 'Playlists'];

const Search = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('Top');

    const handleClearSearch = () => {
        setSearchText('');
    };

    const handleSearchItemPress = (itemText: string) => {
        setSearchText(itemText);
    };

    // Header Search Input
    const renderSearchInput = () => (
        <View style={[styles.searchBarContainer, { marginTop: insets.top + ms(10) }]}>
            <View style={styles.searchBarInner}>
                <Image
                    source={ICONS.search}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search songs, artists, albums"
                    placeholderTextColor="#9CA3AF"
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCapitalize="none"
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton} activeOpacity={0.7}>
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
            <Text style={styles.sectionTitle}>Browse all</Text>

            {/* 2-column Grid of Categories */}
            <View style={styles.categoriesGrid}>
                {BROWSE_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.categoryCard, { backgroundColor: cat.bg }]}
                        activeOpacity={0.8}
                        onPress={() => handleSearchItemPress(cat.name)}
                    >
                        <Text style={[styles.categoryText, { color: cat.text }]}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: ms(32) }]}>Trending searches</Text>

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

    // Search Results state
    const renderResultsState = () => (
        <View style={{ flex: 1 }}>
            {/* Filter Tabs pill bar */}
            <View style={styles.filterBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {FILTER_TABS.map((tab) => {
                        const isActive = tab === activeTab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    styles.filterTab,
                                    isActive && styles.filterTabActive,
                                ]}
                                activeOpacity={0.7}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text
                                    style={[
                                        styles.filterTabText,
                                        isActive && styles.filterTabTextColor,
                                    ]}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Songs Section */}
                <Text style={styles.sectionTitle}>Songs</Text>
                <View style={styles.songsList}>
                    {SONG_RESULTS.map((song) => (
                        <TouchableOpacity
                            key={song.id}
                            style={styles.songRow}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('MusicPlay')}
                        >
                            <Image source={{ uri: song.image }} style={styles.songImage} />
                            <View style={styles.songDetails}>
                                <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                                <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
                            </View>
                            <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
                                <Text style={styles.moreText}>•••</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Albums Section */}
                <Text style={[styles.sectionTitle, { marginTop: ms(32) }]}>Albums</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.albumsScroll}
                >
                    {ALBUM_RESULTS.map((album) => (
                        <TouchableOpacity key={album.id} style={styles.albumCard} activeOpacity={0.8}>
                            <Image source={{ uri: album.image }} style={styles.albumImage} />
                            <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
                            <Text style={styles.albumSubText}>Album • {album.year}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Spacer to prevent overlapping with floating player */}
                <View style={{ height: ms(100) }} />
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Search Header Input */}
            {renderSearchInput()}

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
    albumsScroll: {
        gap: ms(16),
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
});