import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import FloatingPlayer from '../../component/FloatingPlayer';

interface SongItem {
    id: string;
    title: string;
    artist: string;
    image: string;
}

const DOWNLOADED_SONGS: SongItem[] = [
    {
        id: 'ds1',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        image: 'https://picsum.photos/200/200?random=101',
    },
    {
        id: 'ds2',
        title: 'Starboy',
        artist: 'The Weeknd ft. Daft Punk',
        image: 'https://picsum.photos/200/200?random=102',
    },
    {
        id: 'ds3',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        image: 'https://picsum.photos/200/200?random=103',
    },
    {
        id: 'ds4',
        title: 'Flowers',
        artist: 'Miley Cyrus',
        image: 'https://picsum.photos/200/200?random=104',
    },
    {
        id: 'ds5',
        title: 'Stay',
        artist: 'The Kid LAROI & Justin Bieber',
        image: 'https://picsum.photos/200/200?random=105',
    },
];

const Downloads = ({ navigation }: any) => {
    const [smartDownloadEnabled, setSmartDownloadEnabled] = useState(true);
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation && navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Image source={ICONS.leftarrow} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Downloads</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>


                {/* Smart Download Section */}
                <View style={styles.smartDownloadRow}>
                    <View style={styles.smartDownloadTextContainer}>
                        <Text style={styles.smartDownloadTitle}>Smart Download</Text>
                        <Text style={styles.smartDownloadSubtitle}>Automatically download music</Text>
                    </View>

                    {/* Premium Custom Toggle Switch */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSmartDownloadEnabled(!smartDownloadEnabled)}
                        style={[
                            styles.toggleContainer,
                            smartDownloadEnabled ? styles.toggleActive : styles.toggleInactive,
                        ]}
                    >
                        <View
                            style={[
                                styles.toggleThumb,
                                smartDownloadEnabled ? styles.toggleThumbActive : styles.toggleThumbInactive,
                            ]}
                        />
                    </TouchableOpacity>
                </View>

                {/* Downloaded Section */}
                <View style={styles.downloadedSection}>
                    <Text style={styles.downloadedTitle}>Downloaded</Text>

                    {DOWNLOADED_SONGS.map((song) => {
                        const isCurrentPlaying = playingTrackId === song.id;
                        return (
                            <View key={song.id} style={styles.trackRow}>
                                {/* Cover Art */}
                                <Image source={{ uri: song.image }} style={styles.trackArt} />

                                {/* Track Details */}
                                <View style={styles.trackDetails}>
                                    <Text style={styles.trackTitle} numberOfLines={1}>{song.title}</Text>
                                    <Text style={styles.trackArtist} numberOfLines={1}>{song.artist}</Text>
                                </View>

                                {/* Play / Pause Button */}
                                <TouchableOpacity
                                    style={styles.trackPlayBtn}
                                    onPress={() => setPlayingTrackId(isCurrentPlaying ? null : song.id)}
                                    activeOpacity={0.8}
                                >
                                    {isCurrentPlaying ? (
                                        <View style={styles.miniPauseIcon}>
                                            <View style={styles.miniPauseBar} />
                                            <View style={styles.miniPauseBar} />
                                        </View>
                                    ) : (
                                        <View style={styles.miniPlayTriangle} />
                                    )}
                                </TouchableOpacity>

                                {/* Options Button */}
                                <TouchableOpacity style={styles.optionsButton} activeOpacity={0.7}>
                                    <Text style={styles.optionsButtonText}>⋮</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
            <FloatingPlayer />
        </SafeAreaView>
    );
};

export default Downloads;

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
        paddingBottom: ms(150),
    },
    sectionContainer: {
        marginBottom: ms(28),
    },
    sectionLabel: {
        fontFamily: FONTS.bold24,
        fontSize: ms(16),
        color: '#111827',
        includeFontPadding: false,
    },
    storageUsageText: {
        fontFamily: FONTS.regular24,
        fontSize: ms(13),
        color: '#6B7280',
        marginTop: ms(8),
        includeFontPadding: false,
    },
    progressBarContainer: {
        flexDirection: 'row',
        height: ms(8),
        borderRadius: ms(4),
        overflow: 'hidden',
        marginTop: ms(14),
        backgroundColor: '#E5E7EB',
    },
    progressSegment: {
        height: '100%',
    },
    smartDownloadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: ms(20),
        borderBottomWidth: ms(1),
        borderBottomColor: '#F3F4F6',
        borderTopWidth: ms(1),
        borderTopColor: '#F3F4F6',
        marginBottom: ms(28),
    },
    smartDownloadTextContainer: {
        flex: 1,
        paddingRight: ms(16),
    },
    smartDownloadTitle: {
        fontFamily: FONTS.bold24,
        fontSize: ms(16),
        color: '#111827',
        includeFontPadding: false,
    },
    smartDownloadSubtitle: {
        fontFamily: FONTS.regular24,
        fontSize: ms(13),
        color: '#6B7280',
        marginTop: ms(4),
        includeFontPadding: false,
    },
    toggleContainer: {
        width: ms(48),
        height: ms(26),
        borderRadius: ms(13),
        padding: ms(2),
        justifyContent: 'center',
    },
    toggleActive: {
        backgroundColor: COLORS.Primary || '#6337EB',
    },
    toggleInactive: {
        backgroundColor: '#E5E7EB',
    },
    toggleThumb: {
        width: ms(22),
        height: ms(22),
        borderRadius: ms(11),
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    toggleThumbActive: {
        alignSelf: 'flex-end',
    },
    toggleThumbInactive: {
        alignSelf: 'flex-start',
    },
    downloadedSection: {
        flex: 1,
    },
    downloadedTitle: {
        fontFamily: FONTS.bold24,
        fontSize: ms(16),
        color: '#111827',
        marginBottom: ms(16),
        includeFontPadding: false,
    },
    trackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ms(16),
        height: ms(56),
    },
    trackArt: {
        width: ms(44),
        height: ms(44),
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
    trackPlayBtn: {
        width: ms(32),
        height: ms(32),
        borderRadius: ms(16),
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(8),
    },
    miniPauseIcon: {
        flexDirection: 'row',
        width: ms(8),
        height: ms(11),
        justifyContent: 'space-between',
    },
    miniPauseBar: {
        width: ms(2.5),
        height: '100%',
        backgroundColor: COLORS.Primary || '#6337EB',
        borderRadius: ms(0.5),
    },
    miniPlayTriangle: {
        width: 0,
        height: 0,
        borderLeftWidth: ms(10),
        borderTopWidth: ms(6),
        borderBottomWidth: ms(6),
        borderLeftColor: COLORS.Primary || '#6337EB',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        marginLeft: ms(2.5),
    },
    optionsButton: {
        paddingHorizontal: ms(8),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsButtonText: {
        color: '#9CA3AF',
        fontSize: ms(20),
    },
});
