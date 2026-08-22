import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import TrackPlayer, { Capability, State, usePlaybackState, useProgress, AppKilledPlaybackBehavior } from 'react-native-track-player';

const MusicPlay = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const track = route.params?.track;
    const trackTitle = track?.title || 'Blinding Lights';

    const artistName = track?.featured_artists
        ? [track.featured_artists, track.other_artists].filter(Boolean).join(', ')
        : track?.subtitle ||
          (track?.artist && typeof track.artist === 'object' ? track.artist.name : track?.artist) ||
          track?.other_artists ||
          'The Weeknd';

    const albumArt = track?.cover_image_path || track?.image || track?.artwork || 'https://picsum.photos/400/400?random=109';

    const lyricsLines = track?.lyrics
        ? track.lyrics.split(/\r?\n/).map((line: string) => line.trim()).filter(Boolean)
        : [];

    const parseDuration = (durationStr: any) => {
        if (!durationStr) return 200; // default 3:20
        if (typeof durationStr === 'number') return durationStr;
        const match = durationStr.toString().match(/(\d+)\s*min/i);
        if (match) {
            const mins = parseInt(match[1], 10);
            return mins > 0 ? mins * 60 : 200;
        }
        const parts = durationStr.toString().split(':');
        if (parts.length === 2) {
            const mins = parseInt(parts[0], 10);
            const secs = parseInt(parts[1], 10);
            if (!isNaN(mins) && !isNaN(secs)) {
                return mins * 60 + secs;
            }
        }
        return 200;
    };

    // Track Player hooks for real progress and state
    const playbackState = usePlaybackState();
    const stateVal = typeof playbackState === 'object' && playbackState !== null ? (playbackState as any).state : playbackState;
    const [isTransitioning, setIsTransitioning] = useState(false);
    const transitionTimeoutRef = useRef<any>(null);
    const isPlaying = stateVal === State.Playing || stateVal === 'playing' || stateVal === 'buffering' || stateVal === State.Buffering || isTransitioning;

    useEffect(() => {
        if (stateVal === State.Playing || stateVal === 'playing' || stateVal === 'buffering' || stateVal === State.Buffering) {
            setIsTransitioning(false);
            if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
            }
        }
    }, [stateVal]);

    useEffect(() => {
        return () => {
            if (transitionTimeoutRef.current) {
                clearTimeout(transitionTimeoutRef.current);
            }
        };
    }, []);

    const progressData = useProgress();
    const progress = progressData.position;
    const totalDuration = progressData.duration || parseDuration(track?.duration || track?.total_duration);

    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);
    const [expandLyrics, setExpandLyrics] = useState(false);

    const currentLineIndex = lyricsLines.length > 0 && totalDuration > 0
        ? Math.min(Math.floor((progress / totalDuration) * lyricsLines.length), lyricsLines.length - 1)
        : 0;

    // Determine which lines of lyrics to display in the card (and their original indices)
    let visibleLyrics: { line: string; originalIndex: number }[] = [];
    if (expandLyrics) {
        visibleLyrics = lyricsLines.map((line: string, idx: number) => ({ line, originalIndex: idx }));
    } else {
        let start = Math.max(0, currentLineIndex - 2);
        let end = Math.min(lyricsLines.length, start + 5);
        if (end - start < 5) {
            start = Math.max(0, end - 5);
        }
        visibleLyrics = lyricsLines.slice(start, end).map((line: string, idx: number) => ({
            line,
            originalIndex: start + idx
        }));
    }

    // Setup TrackPlayer once on component mount
    useEffect(() => {
        const setup = async () => {
            try {
                // Initialize player
                await TrackPlayer.setupPlayer({});
                await TrackPlayer.updateOptions({
                    android: {
                        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
                    },
                    // Media controls capabilities
                    capabilities: [
                        Capability.Play,
                        Capability.Pause,
                        Capability.SkipToNext,
                        Capability.SkipToPrevious,
                        Capability.SeekTo,
                        Capability.Stop,
                    ],
                    // Capabilities that will be displayed in notification on android
                    notificationCapabilities: [
                        Capability.Play,
                        Capability.Pause,
                        Capability.SkipToNext,
                        Capability.SkipToPrevious,
                        Capability.Stop,
                    ],
                    // Compact capabilities in Android notification (collapsed view)
                    compactCapabilities: [
                        Capability.Play,
                        Capability.Pause,
                        Capability.Stop,
                    ],
                });
                setIsPlayerReady(true);
            } catch (error) {
                // Player is already initialized
                try {
                    await TrackPlayer.updateOptions({
                        capabilities: [
                            Capability.Play,
                            Capability.Pause,
                            Capability.SkipToNext,
                            Capability.SkipToPrevious,
                            Capability.SeekTo,
                            Capability.Stop,
                        ],
                        notificationCapabilities: [
                            Capability.Play,
                            Capability.Pause,
                            Capability.SkipToNext,
                            Capability.SkipToPrevious,
                            Capability.Stop,
                        ],
                        compactCapabilities: [
                            Capability.Play,
                            Capability.Pause,
                            Capability.Stop,
                        ],
                    });
                } catch (optsError) {
                    // Ignore options errors if player is already set up and configured
                }
                setIsPlayerReady(true);
            }
        };
        setup();
    }, []);

    // Load track whenever player is ready or selected track changes
    useEffect(() => {
        if (!isPlayerReady || !track) return;

        const loadTrack = async () => {
            try {
                const currentTrackIndex = await TrackPlayer.getCurrentTrack();
                if (currentTrackIndex !== null && currentTrackIndex !== undefined) {
                    const currentActiveTrack = await TrackPlayer.getTrack(currentTrackIndex);
                    if (currentActiveTrack && currentActiveTrack.id === track?.id?.toString()) {
                        // Same track is already loaded, do not reload.
                        // Ensure it plays.
                        await TrackPlayer.play();
                        return;
                    }
                }

                setIsTransitioning(true);
                if (transitionTimeoutRef.current) {
                    clearTimeout(transitionTimeoutRef.current);
                }
                transitionTimeoutRef.current = setTimeout(() => {
                    setIsTransitioning(false);
                }, 5000); // 5-second safety timeout fallback

                await TrackPlayer.reset();
                const audioUrl = track?.audio_file_path || track?.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
                await TrackPlayer.add({
                    id: track?.id?.toString() || 'temp_id',
                    url: audioUrl,
                    title: trackTitle,
                    artist: artistName,
                    artwork: albumArt,
                });
                await TrackPlayer.play();
                setShowLyrics(false);
            } catch (error) {
                console.error("Error loading track in TrackPlayer", error);
                setIsTransitioning(false);
                if (transitionTimeoutRef.current) {
                    clearTimeout(transitionTimeoutRef.current);
                }
            }
        };

        loadTrack();
    }, [isPlayerReady, track]);

    const togglePlayback = async () => {
        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
        }
        setIsTransitioning(false);

        if (isPlaying) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    };

    // Format seconds to mm:ss format
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const activePercent = totalDuration > 0 ? (progress / totalDuration) * 100 : 0;

    const handleProgressBarPress = (event: any) => {
        const { locationX } = event.nativeEvent;
        const barWidth = Dimensions.get('window').width - ms(64);
        const clickPercent = Math.max(0, Math.min(1, locationX / barWidth));
        const newPosition = clickPercent * totalDuration;
        TrackPlayer.seekTo(newPosition);
    };

    // Custom vector drawing for controls to avoid third-party icon dependencies
    const MenuIcon = () => (
        <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
        </View>
    );

    const PrevIcon = () => (
        <View style={styles.prevNextContainer}>
            <View style={styles.barVertical} />
            <View style={styles.triangleLeft} />
        </View>
    );

    const NextIcon = () => (
        <View style={styles.prevNextContainer}>
            <View style={styles.triangleRight} />
            <View style={styles.barVertical} />
        </View>
    );

    const PauseIcon = () => (
        <View style={styles.pauseContainer}>
            <View style={styles.pauseBar} />
            <View style={styles.pauseBar} />
        </View>
    );

    const PlayIcon = () => (
        <View style={styles.playTriangle} />
    );

    const LibraryIcon = () => (
        <View style={styles.libraryIconContainer}>
            <View style={[styles.cardOutline, styles.cardBack]} />
            <View style={[styles.cardOutline, styles.cardFront]} />
        </View>
    );

    const ListIcon = () => (
        <View style={styles.listIconContainer}>
            {[0, 1, 2].map((i) => (
                <View key={i} style={styles.listRow}>
                    <View style={styles.listDot} />
                    <View style={styles.listLine} />
                </View>
            ))}
        </View>
    );

    // console.log('1234567890', route.params)

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                <View
                    style={{
                        height: Dimensions.get("window").height * 0.95,
                        width: Dimensions.get("window").width,
                        // backgroundColor: 'red',
                        // paddingBottom: insets.bottom || ms(20)
                    }}
                >


                    {/* Background Gradient matching the mock exactly */}
                    <LinearGradient
                        colors={[COLORS.playGradientStart, COLORS.playGradientMiddle, COLORS.playGradientEnd]}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                    />

                    <View style={[styles.safeArea,
                        // { paddingTop: insets.top, paddingBottom: insets.bottom || ms(20) }
                    ]}>

                        {/* Header Row */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.headerButton}
                                activeOpacity={0.7}
                            >
                                <Image source={ICONS.leftarrow} style={styles.backIcon} />
                            </TouchableOpacity>

                            <Text style={styles.headerTitle}>Now Playing</Text>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Share')}
                                style={[styles.headerButton, { alignItems: 'flex-end' }]}
                                activeOpacity={0.7}
                            >
                                <MenuIcon />
                            </TouchableOpacity>
                        </View>

                        {/* Album Artwork / Lyrics */}
                        <TouchableOpacity
                            activeOpacity={track?.lyrics ? 0.9 : 1}
                            onPress={() => track?.lyrics ? setShowLyrics(!showLyrics) : null}
                            style={styles.albumArtContainer}
                        >
                            <View style={styles.albumArtShadowWrapper}>
                                {showLyrics && track?.lyrics ? (
                                    <ScrollView
                                        style={[styles.albumArt, { backgroundColor: 'rgba(0, 0, 0, 0.85)', padding: ms(20) }]}
                                        contentContainerStyle={{ paddingBottom: ms(45) }}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <Text style={{ fontFamily: FONTS.bold28, fontSize: ms(18), color: '#FFFFFF', marginBottom: ms(12), textAlign: 'center' }}>Lyrics</Text>
                                        <Text style={{ fontFamily: FONTS.regular24, fontSize: ms(14), color: 'rgba(255, 255, 255, 0.9)', lineHeight: ms(22), textAlign: 'center' }}>
                                            {track.lyrics}
                                        </Text>
                                    </ScrollView>
                                ) : (
                                    <Image
                                        source={{ uri: albumArt }}
                                        style={styles.albumArt}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>

                        {/* Track Title and Artist */}
                        <View style={styles.trackInfoRow}>
                            <View style={styles.trackDetails}>
                                <Text style={styles.trackTitle} numberOfLines={1}>{trackTitle}</Text>
                                <Text style={styles.artistName} numberOfLines={1}>{artistName}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => setIsLiked(!isLiked)}
                                style={styles.likeButton}
                                activeOpacity={0.7}
                            >
                                {/* <Text style={[styles.likeText, isLiked && styles.likeTextActive]}>
                                    {isLiked ? '♥' : '♡'}
                                </Text> */}
                                <Image source={isLiked ? ICONS.heart_ac : ICONS.heart}
                                    style={{ width: ms(24), height: ms(24), resizeMode: 'contain', tintColor: COLORS.white }} />
                            </TouchableOpacity>
                        </View>

                        {/* Progress Slider (Interactive Seeker) */}
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={handleProgressBarPress}
                            style={{ ...styles.progressContainer, }}
                        >
                            <View style={styles.progressBarBackground}>
                                <View style={[styles.progressBarActive, { width: `${activePercent}%` }]} />
                                <View style={[styles.progressThumb, { left: `${activePercent}%` }]} />
                            </View>
                            <View style={styles.timeRow}>
                                <Text style={styles.timeText}>{formatTime(progress)}</Text>
                                <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Playback Controls */}
                        <View style={{ ...styles.controlsRow, }}>
                            {/* Shuffle Button */}
                            <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                                <Image source={ICONS.shuffle} style={styles.Icon24} />
                            </TouchableOpacity>

                            {/* Skip Previous */}
                            <TouchableOpacity
                                onPress={() => TrackPlayer.seekTo(0)}
                                style={styles.controlButton}
                                activeOpacity={0.7}
                            >
                                <PrevIcon />
                            </TouchableOpacity>

                            {/* Play / Pause Toggle */}
                            <TouchableOpacity
                                onPress={togglePlayback}
                                style={styles.playPauseButton}
                                activeOpacity={0.8}
                            >
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </TouchableOpacity>

                            {/* Skip Next */}
                            <TouchableOpacity
                                onPress={() => TrackPlayer.seekTo(0)}
                                style={styles.controlButton}
                                activeOpacity={0.7}
                            >
                                <NextIcon />
                            </TouchableOpacity>

                            {/* Repeat Button */}
                            <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                                <Image source={ICONS.loop} style={styles.Icon24} />
                            </TouchableOpacity>
                        </View>

                        {/* Footer Navigation bar */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
                                <LibraryIcon />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
                                <ListIcon />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
                                <Text style={styles.globeIcon}>🌐</Text>
                            </TouchableOpacity>
                        </View>


                    </View>


                </View>

                {/* Lyrics Preview Card */}
                {lyricsLines.length > 0 && (
                    <View style={styles.lyricsCard}>
                        <Text style={styles.lyricsCardHeader}>Lyrics preview</Text>
                        <View style={styles.lyricsContent}>
                            {visibleLyrics.map((item) => (
                                <Text
                                    key={item.originalIndex}
                                    style={item.originalIndex === currentLineIndex ? styles.lyricsLineActive : styles.lyricsLine}
                                >
                                    {item.line}
                                </Text>
                            ))}
                        </View>
                        {lyricsLines.length > 5 && (
                            <TouchableOpacity
                                onPress={() => setExpandLyrics(!expandLyrics)}
                                style={styles.showLyricsButton}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.showLyricsButtonText}>
                                    {expandLyrics ? 'Hide lyrics' : 'Show lyrics'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* About the Artist Card */}
                <View style={styles.artistCard}>
                    <View style={styles.artistImageContainer}>
                        <Image
                            source={{ uri: track?.artist?.cover_image_path || track?.artist?.image_path || 'https://picsum.photos/400/400?random=artist' }}
                            style={styles.artistCardImage}
                        />
                        <Text style={styles.artistCardBadge}>About the artist</Text>
                    </View>
                    <View style={styles.artistCardInfo}>
                        <View style={styles.artistNameRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.artistCardName}>{track?.artist?.name || artistName}</Text>
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedBadgeText}>✓</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.followButton} activeOpacity={0.8}>
                                <Text style={styles.followButtonText}>Follow</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.monthlyListeners}>
                            {track?.artist?.total_followers !== undefined 
                                ? `${track.artist.total_followers} followers` 
                                : '0 followers'}
                        </Text>
                        <Text style={styles.artistBio} numberOfLines={3}>
                            {track?.artist?.bio || "No biography available for this artist."}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MusicPlay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.playGradientEnd
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(24),
        height: ms(56),
    },
    headerButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    backIcon: {
        width: ms(26),
        height: ms(26),
        resizeMode: 'contain',
        tintColor: '#FFFFFF',
    },
    headerTitle: {
        fontFamily: FONTS.medium24,
        fontSize: ms(17),
        color: '#FFFFFF',
        textAlign: 'center',
        includeFontPadding: false,
    },
    menuIcon: {
        width: ms(18),
        height: ms(12),
        justifyContent: 'space-between',
    },
    menuLine: {
        height: ms(2),
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
    },
    albumArtContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: ms(16),
    },
    albumArtShadowWrapper: {
        borderRadius: ms(24),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        backgroundColor: '#000000',
        elevation: 12,
    },
    albumArt: {
        width: Dimensions.get('window').width - ms(64),
        height: Dimensions.get('window').width - ms(64),
        borderRadius: ms(24),
        resizeMode: 'cover',
    },
    trackInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(32),
    },
    trackDetails: {
        flex: 1,
        marginRight: ms(16),
    },
    trackTitle: {
        fontFamily: FONTS.bold28,
        fontSize: ms(22),
        color: '#FFFFFF',
        includeFontPadding: false,
    },
    artistName: {
        fontFamily: FONTS.regular24,
        fontSize: ms(14),
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: ms(6),
        includeFontPadding: false,
    },
    likeButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    likeText: {
        fontSize: ms(24),
        color: '#FFFFFF',
        includeFontPadding: false,
    },
    likeTextActive: {
        color: '#FF2D55',
    },
    progressContainer: {
        paddingHorizontal: ms(32),
    },
    progressBarBackground: {
        height: ms(4),
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: ms(2),
        position: 'relative',
        justifyContent: 'center',
    },
    progressBarActive: {
        height: ms(4),
        backgroundColor: '#FFFFFF',
        borderRadius: ms(2),
    },
    progressThumb: {
        width: ms(12),
        height: ms(12),
        borderRadius: ms(6),
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        transform: [{ translateX: -ms(6) }],
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: ms(8),
    },
    timeText: {
        fontFamily: FONTS.regular24,
        fontSize: ms(12),
        color: 'rgba(255, 255, 255, 0.7)',
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: ms(32),
        marginTop: ms(-5)
    },
    controlButton: {
        width: ms(44),
        height: ms(44),
        justifyContent: 'center',
        alignItems: 'center',
    },
    Icon24: {
        width: ms(24),
        height: ms(24),
        resizeMode: 'contain',
        tintColor: 'rgba(255, 255, 255, 0.9)',
    },

    prevNextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    barVertical: {
        width: ms(3),
        height: ms(18),
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
    },
    triangleLeft: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 0,
        borderRightWidth: ms(16),
        borderBottomWidth: ms(9),
        borderTopWidth: ms(9),
        borderLeftColor: 'transparent',
        borderRightColor: '#FFFFFF',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginLeft: ms(2),
    },
    triangleRight: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: ms(16),
        borderRightWidth: 0,
        borderBottomWidth: ms(9),
        borderTopWidth: ms(9),
        borderLeftColor: '#FFFFFF',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginRight: ms(2),
    },
    playPauseButton: {
        width: ms(76),
        height: ms(76),
        borderRadius: ms(38),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    pauseContainer: {
        flexDirection: 'row',
        width: ms(16),
        height: ms(22),
        justifyContent: 'space-between',
    },
    pauseBar: {
        width: ms(5),
        height: '100%',
        backgroundColor: '#3E7FF3', // middle color of background to match transparent effect
        borderRadius: ms(1.5),
    },
    playTriangle: {
        width: 0,
        height: 0,
        borderLeftWidth: ms(20),
        borderTopWidth: ms(12),
        borderBottomWidth: ms(12),
        borderLeftColor: '#3E7FF3',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        marginLeft: ms(6),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(36),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: ms(8),
    },
    footerButton: {
        width: ms(48),
        height: ms(48),
        justifyContent: 'center',
        alignItems: 'center',
    },
    globeIcon: {
        fontSize: ms(20),
        color: '#FFFFFF',
    },
    libraryIconContainer: {
        width: ms(20),
        height: ms(20),
        position: 'relative',
    },
    cardOutline: {
        width: ms(13),
        height: ms(16),
        borderWidth: ms(2),
        borderColor: '#FFFFFF',
        borderRadius: ms(2),
        position: 'absolute',
    },
    cardBack: {
        left: 0,
        top: ms(2),
        opacity: 0.6,
    },
    cardFront: {
        right: 0,
        top: 0,
    },
    listIconContainer: {
        width: ms(20),
        height: ms(14),
        justifyContent: 'space-between',
    },
    listRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listDot: {
        width: ms(4),
        height: ms(2),
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
    },
    listLine: {
        flex: 1,
        height: ms(2),
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
        marginLeft: ms(3),
    },


    /////////////////////////////////////////////////////////////////


    lyricsCard: {
        marginHorizontal: ms(24),
        borderRadius: ms(16),
        backgroundColor: COLORS.playGradientStart, // Dark maroon color from screenshot
        padding: ms(20),
        marginBottom: ms(24),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    lyricsCardHeader: {
        fontFamily: FONTS.bold28,
        fontSize: ms(16),
        color: '#FFFFFF',
        marginBottom: ms(16),
    },
    lyricsContent: {
        gap: ms(12),
        marginBottom: ms(20),
    },
    lyricsLine: {
        fontFamily: FONTS.medium24,
        fontSize: ms(16),
        color: 'rgba(255, 255, 255, 0.65)',
        lineHeight: ms(24),
    },
    lyricsLineActive: {
        fontFamily: FONTS.bold28,
        fontSize: ms(20),
        color: '#FFFFFF',
        lineHeight: ms(28),
        marginTop: ms(4),
    },
    showLyricsButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderRadius: ms(20),
        paddingHorizontal: ms(18),
        paddingVertical: ms(8),
    },
    showLyricsButtonText: {
        fontFamily: FONTS.bold24,
        fontSize: ms(13),
        color: '#000000',
    },
    artistCard: {
        marginHorizontal: ms(24),
        borderRadius: ms(16),
        backgroundColor: COLORS.playGradientMiddle, // Dark card color
        overflow: 'hidden',
        marginBottom: ms(40),
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    artistImageContainer: {
        height: ms(220),
        position: 'relative',
    },
    artistCardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    artistCardBadge: {
        position: 'absolute',
        top: ms(16),
        left: ms(16),
        fontFamily: FONTS.bold28,
        fontSize: ms(16),
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    artistCardInfo: {
        padding: ms(20),
    },
    artistNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    artistCardName: {
        fontFamily: FONTS.bold28,
        fontSize: ms(18),
        color: '#FFFFFF',
    },
    verifiedBadge: {
        width: ms(16),
        height: ms(16),
        borderRadius: ms(8),
        backgroundColor: '#1DB954', // Spotify green badge
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: ms(6),
    },
    verifiedBadgeText: {
        color: '#FFFFFF',
        fontSize: ms(10),
        fontWeight: 'bold',
        includeFontPadding: false,
    },
    followButton: {
        borderWidth: ms(1),
        borderColor: '#FFFFFF',
        borderRadius: ms(16),
        paddingHorizontal: ms(16),
        paddingVertical: ms(6),
    },
    followButtonText: {
        fontFamily: FONTS.bold24,
        fontSize: ms(12),
        color: '#FFFFFF',
    },
    monthlyListeners: {
        fontFamily: FONTS.regular24,
        fontSize: ms(13),
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: ms(4),
        marginBottom: ms(12),
    },
    artistBio: {
        fontFamily: FONTS.regular24,
        fontSize: ms(13),
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: ms(20),
    },
    seeMoreText: {
        fontFamily: FONTS.bold24,
        color: '#FFFFFF',
    },


});
