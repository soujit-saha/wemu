import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Dimensions, ScrollView, PanResponder } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import TrackPlayer, { Capability, State, usePlaybackState, useProgress, AppKilledPlaybackBehavior, useActiveTrack, Event, useTrackPlayerEvents, RepeatMode } from 'react-native-track-player';
import { useTranslation } from '../../utils/hooks/useTranslation';
import { toggleSongLikeRequest, toggleArtistFollowRequest } from '../../redux/reducer/MainReducer';
import { getPlayerQueueRequest } from '../../redux/reducer/SongReducer';
import Loader from '../../utils/helper/Loader';
import BannerAdComponent from '../../component/BannerAdComponent';

const MusicPlay = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [track, setTrack] = useState(route.params?.track);

    useEffect(() => {
        if (route.params?.track) {
            setTrack(route.params.track);
        }
    }, [route.params?.track]);
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
        if (!durationStr) return 0;
        if (typeof durationStr === 'number') return durationStr;
        const match = durationStr.toString().match(/(\d+)\s*min/i);
        if (match) {
            const mins = parseInt(match[1], 10);
            return mins > 0 ? mins * 60 : 0;
        }
        const parts = durationStr.toString().split(':');
        if (parts.length === 2) {
            const mins = parseInt(parts[0], 10);
            const secs = parseInt(parts[1], 10);
            if (!isNaN(mins) && !isNaN(secs)) {
                return mins * 60 + secs;
            }
        }
        return 0;
    };

    // Track Player hooks for real progress and state
    const playbackState = usePlaybackState();
    const stateVal = typeof playbackState === 'object' && playbackState !== null ? (playbackState as any).state : playbackState;
    const [isTransitioning, setIsTransitioning] = useState(true);
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

    // Android has a known bug with VBR MP3 files where it miscalculates the duration by 20-30 seconds.
    // However, we MUST use TrackPlayer's estimation if available, otherwise seeking past its known end will fail.
    const metaDuration = parseDuration(track?.duration || track?.total_duration);
    const totalDuration = progressData.duration > 0 ? progressData.duration : (metaDuration > 0 ? metaDuration : 200);

    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isLiked, setIsLiked] = useState(!!(track?.is_liked || track?.raw?.is_liked));
    const [isArtistFollowing, setIsArtistFollowing] = useState(!!(track?.artist?.is_followed || track?.artist?.raw?.is_followed));
    const [showLyrics, setShowLyrics] = useState(false);
    const [expandLyrics, setExpandLyrics] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragProgress, setDragProgress] = useState(0);
    const lastSeekPositionRef = useRef<number | null>(null);
    const lastSeekTimeRef = useRef<number>(0);

    const barWidthRef = useRef<number>(1);
    const totalDurationRef = useRef<number>(totalDuration);
    // Keep the ref in sync with the latest totalDuration on every render
    totalDurationRef.current = totalDuration;

    const pageRef = useRef(0);
    const lastFetchedSongIdRef = useRef<string>('');
    const [fetchingDirection, setFetchingDirection] = useState<'none' | 'next' | 'prev'>('none');
    const playerQueueRes = useSelector((state: any) => state.SongReducer?.playerQueueRes);
    const isSongLoading = useSelector((state: any) => state.SongReducer?.isSongLoading);

    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    const toggleRepeat = async () => {
        const nextMode = repeatMode === RepeatMode.Off ? RepeatMode.Track : RepeatMode.Off;
        setRepeatMode(nextMode);
        try {
            await TrackPlayer.setRepeatMode(nextMode);
        } catch (error) {
            console.error("Set Repeat Mode Error", error);
        }
    };

    const fetchNextSongs = (actionType?: string) => {
        const currentSongId = track?.id?.toString() || '';
        let nextPage;

        if (lastFetchedSongIdRef.current !== currentSongId) {
            nextPage = 1;
            pageRef.current = 1;
            lastFetchedSongIdRef.current = currentSongId;
        } else {
            nextPage = pageRef.current + 1;
            pageRef.current = nextPage;
        }

        const fromScreen = route.params?.fromScreen || '';
        const typeIdParam = route.params?.type_id || '';
        const keywordParam = route.params?.keyword || '';

        let sourceType = track?.source_type || 'album';
        if (fromScreen === 'Home') {
            sourceType = typeIdParam || sourceType;
        } else if (fromScreen) {
            sourceType = fromScreen;
        }

        let keywordValue = track?.keyword || '';
        if (fromScreen === 'Search') {
            keywordValue = keywordParam;
        } else if (fromScreen) {
            keywordValue = '';
        }

        dispatch(getPlayerQueueRequest({
            source_type: sourceType,
            source_id: track?.source_id || '',
            keyword: keywordValue,
            page: nextPage,
            per_page: 5,
            last_played_song_id: track?.id || '',
            ...(actionType ? { direction: actionType } : {})
        }));
    };

    const handleSkipNextRef = useRef<any>(null);

    useTrackPlayerEvents([Event.PlaybackActiveTrackChanged, Event.PlaybackQueueEnded], async (event) => {
        if (event.type === Event.PlaybackActiveTrackChanged && event.index != null) {
            const queue = await TrackPlayer.getQueue();
            const activeTrack = await TrackPlayer.getTrack(event.index);
            if (activeTrack?.track) {
                setTrack(activeTrack.track);
            }
        } else if (event.type === Event.PlaybackQueueEnded) {
            if (handleSkipNextRef.current) {
                handleSkipNextRef.current();
            }
        }
    });

    useEffect(() => {
        setIsLiked(!!(track?.is_liked || track?.raw?.is_liked));
        setIsArtistFollowing(!!(track?.artist?.is_followed || track?.artist?.raw?.is_followed));
    }, [track]);

    const isSeeking = lastSeekPositionRef.current !== null &&
        Math.abs(progress - lastSeekPositionRef.current) > 1.5 &&
        (Date.now() - lastSeekTimeRef.current < 1000);

    const currentProgress = isDragging ? dragProgress : (isSeeking && lastSeekPositionRef.current !== null ? lastSeekPositionRef.current : progress);

    const currentLineIndex = lyricsLines.length > 0 && totalDuration > 0
        ? Math.min(Math.floor((currentProgress / totalDuration) * lyricsLines.length), lyricsLines.length - 1)
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
            let isSetup = false;
            try {
                await TrackPlayer.getPlaybackState();
                isSetup = true;
            } catch (e) {
                try {
                    await TrackPlayer.setupPlayer({});
                    isSetup = true;
                } catch (error) {
                    console.error("TrackPlayer setup error:", error);
                }
            }

            if (isSetup) {
                try {
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
                } catch (optsError) {
                    // Ignore options errors if player is already configured
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
                        setIsTransitioning(false);
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
                    track: track,
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
    }, [isPlayerReady, route.params?.track]);

    useEffect(() => {
        const resultData = playerQueueRes?.data?.local_queue
            || playerQueueRes?.data;
        if (resultData?.length > 0) {
            const addTracksToQueue = async () => {
                const tracksToAdd = resultData.map((item: any) => {
                    const itemAudioUrl = item.audio_file_path || item.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
                    const itemTrackTitle = item.title || 'Unknown Title';
                    const itemArtistName = item.featured_artists
                        ? [item.featured_artists, item.other_artists].filter(Boolean).join(', ')
                        : item.subtitle ||
                        (item.artist && typeof item.artist === 'object' ? item.artist.name : item.artist) ||
                        item.other_artists || 'Unknown Artist';
                    const itemAlbumArt = item.cover_image_path || item.image || item.artwork || 'https://picsum.photos/400/400?random=109';

                    return {
                        id: item.id?.toString() || Math.random().toString(),
                        url: itemAudioUrl,
                        title: itemTrackTitle,
                        artist: itemArtistName,
                        artwork: itemAlbumArt,
                        track: item
                    };
                });

                console.log("Local array created (tracksToAdd):", JSON.stringify(tracksToAdd, null, 2));

                const queue = await TrackPlayer.getQueue();
                const newStartIndex = queue.length;

                if (fetchingDirection === 'prev') {
                    const reversedTracks = [...tracksToAdd].reverse();
                    await TrackPlayer.add(reversedTracks, 0);
                    setFetchingDirection('none');
                    await TrackPlayer.skip(reversedTracks.length - 1);
                    await TrackPlayer.play();
                } else {
                    await TrackPlayer.add(tracksToAdd);
                    if (fetchingDirection === 'next') {
                        setFetchingDirection('none');
                        await TrackPlayer.skip(newStartIndex);
                        await TrackPlayer.play();
                    }
                }
            };
            addTracksToQueue();
        }
    }, [playerQueueRes]);

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

    const handleSkipNext = async () => {
        try {
            const queue = await TrackPlayer.getQueue();
            const currentTrackIndex = await TrackPlayer?.getCurrentTrack();

            if (isShuffle && queue.length > 1) {
                let randomIndex = Math.floor(Math.random() * queue.length);
                if (randomIndex === currentTrackIndex) {
                    randomIndex = (randomIndex + 1) % queue.length;
                }
                await TrackPlayer.skip(randomIndex);
                return;
            }

            if (currentTrackIndex !== null && currentTrackIndex >= queue.length - 1) {
                setFetchingDirection('next');
                fetchNextSongs('next');
            } else {
                await TrackPlayer.skipToNext();
            }
        } catch (error) {
            console.error("Skip Next Error", error);
        }
    };

    useEffect(() => {
        handleSkipNextRef.current = handleSkipNext;
    });

    const handleSkipPrevious = async () => {
        try {
            const queue = await TrackPlayer.getQueue();
            const currentTrackIndex = await TrackPlayer?.getCurrentTrack();

            if (isShuffle && queue.length > 1) {
                let randomIndex = Math.floor(Math.random() * queue.length);
                if (randomIndex === currentTrackIndex) {
                    randomIndex = (randomIndex + 1) % queue.length;
                }
                await TrackPlayer.skip(randomIndex);
                return;
            }

            if (currentTrackIndex !== null && currentTrackIndex > 0) {
                await TrackPlayer.skipToPrevious();
            } else {
                setFetchingDirection('prev');
                fetchNextSongs('prev');
            }
        } catch (error) {
            console.error("Skip Previous Error", error);
        }
    };

    const activePercent = totalDuration > 0 ? Math.min(100, Math.max(0, (currentProgress / totalDuration) * 100)) : 0;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: (evt) => {
                setIsDragging(true);
                const dur = totalDurationRef.current;
                if (dur > 0) {
                    const actualBarWidth = barWidthRef.current || 1;
                    const touchX = evt.nativeEvent.locationX;
                    const clickPercent = Math.max(0, Math.min(1, touchX / actualBarWidth));
                    setDragProgress(clickPercent * dur);
                }
            },
            onPanResponderMove: (evt) => {
                const dur = totalDurationRef.current;
                if (dur > 0) {
                    const actualBarWidth = barWidthRef.current || 1;
                    const touchX = evt.nativeEvent.locationX;
                    const clickPercent = Math.max(0, Math.min(1, touchX / actualBarWidth));
                    setDragProgress(clickPercent * dur);
                }
            },
            onPanResponderRelease: async (evt) => {
                const dur = totalDurationRef.current;
                if (dur > 0) {
                    const actualBarWidth = barWidthRef.current || 1;
                    const touchX = evt.nativeEvent.locationX;
                    const clickPercent = Math.max(0, Math.min(1, touchX / actualBarWidth));
                    const newPos = clickPercent * dur;

                    lastSeekPositionRef.current = newPos;
                    lastSeekTimeRef.current = Date.now();

                    try {
                        await TrackPlayer.seekTo(newPos);
                    } catch (err) {
                        console.error("Error seeking on release", err);
                    }
                }
                setIsDragging(false);
            },
            onPanResponderTerminate: () => {
                setIsDragging(false);
            }
        })
    ).current;

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

    // console.log('1234567890', route.params?.track)

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <Loader visible={isSongLoading} />
            <ScrollView scrollEnabled={!isDragging} showsVerticalScrollIndicator={false} bounces={false}>
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

                            <Text style={styles.headerTitle}>{t('nowPlaying')}</Text>

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
                                        <Text style={{ fontFamily: FONTS.bold28, fontSize: ms(18), color: '#FFFFFF', marginBottom: ms(12), textAlign: 'center' }}>{t('lyrics')}</Text>
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
                                onPress={() => {
                                    setIsLiked(!isLiked);
                                    if (track?.id) {
                                        dispatch(toggleSongLikeRequest(track.id));
                                    }
                                }}
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
                        <View style={styles.progressContainer}>
                            <View style={{ paddingVertical: ms(15), position: 'relative', justifyContent: 'center' }}>
                                {/* The visual bar */}
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarActive, { width: `${activePercent}%` }]} />
                                    <View style={[styles.progressThumb, { left: `${activePercent}%` }]} />
                                </View>

                                {/* The transparent touch overlay */}
                                <View
                                    {...panResponder.panHandlers}
                                    onLayout={(e) => {
                                        barWidthRef.current = e.nativeEvent.layout.width;
                                    }}
                                    style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'transparent' }}
                                />
                            </View>
                            <View style={styles.timeRow}>
                                <Text style={styles.timeText}>{formatTime(currentProgress)}</Text>
                                <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
                            </View>
                        </View>

                        {/* Playback Controls */}
                        <View style={{ ...styles.controlsRow, }}>
                            {/* Shuffle Button */}
                            <TouchableOpacity style={styles.controlButton} activeOpacity={0.7} onPress={toggleShuffle}>
                                <Image source={ICONS.shuffle} style={[styles.Icon24, { tintColor: isShuffle ? COLORS.Primary || '#6337EB' : '#FFFFFF' }]} />
                            </TouchableOpacity>

                            {/* Skip Previous */}
                            <TouchableOpacity
                                onPress={handleSkipPrevious}
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
                                onPress={handleSkipNext}
                                style={styles.controlButton}
                                activeOpacity={0.7}
                            >
                                <NextIcon />
                            </TouchableOpacity>

                            {/* Repeat Button */}
                            <TouchableOpacity style={styles.controlButton} activeOpacity={0.7} onPress={toggleRepeat}>
                                <Image source={ICONS.loop} style={[styles.Icon24, { tintColor: repeatMode === RepeatMode.Track ? COLORS.Primary || '#6337EB' : '#FFFFFF' }]} />
                            </TouchableOpacity>
                        </View>

                        {/* Footer Navigation bar */}
                        <View style={styles.footer}>
                            {/* <View style={styles.footerButton} /> */}
                            <BannerAdComponent />
                            {/* <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
                                <LibraryIcon />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
                                <ListIcon />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.footerButton} activeOpacity={0.7}>
                                <Text style={styles.globeIcon}>🌐</Text>
                            </TouchableOpacity> */}
                        </View>


                    </View>


                </View>

                {/* Lyrics Preview Card */}
                {lyricsLines.length > 0 && (
                    <View style={styles.lyricsCard}>
                        <Text style={styles.lyricsCardHeader}>{t('lyricsPreview')}</Text>
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
                                    {expandLyrics ? t('hideLyrics') : t('showLyrics')}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* About the Artist Card */}
                <TouchableOpacity style={styles.artistCard} onPress={() => navigation.navigate('ArtistsDetails', { artist: track?.artist })}>
                    <View style={styles.artistImageContainer}>
                        <Image
                            source={{ uri: track?.artist?.cover_image_path || track?.artist?.image_path || 'https://picsum.photos/400/400?random=artist' }}
                            style={styles.artistCardImage}
                        />
                        <Text style={styles.artistCardBadge}>{t('aboutTheArtist')}</Text>
                    </View>
                    <View style={styles.artistCardInfo}>
                        <View style={styles.artistNameRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1, marginRight: ms(8) }}>
                                <Text style={styles.artistCardName}>{track?.artist?.name || artistName}</Text>
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedBadgeText}>✓</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.followButton,
                                    isArtistFollowing && styles.followingButtonActive
                                ]}
                                onPress={() => {
                                    setIsArtistFollowing(!isArtistFollowing);
                                    const artistId = track?.artist?.id || track?.artist_id;
                                    if (artistId) {
                                        dispatch(toggleArtistFollowRequest(artistId));
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.followButtonText,
                                    isArtistFollowing && styles.followingButtonTextActive
                                ]}>
                                    {isArtistFollowing ? t('following') : t('follow')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.monthlyListeners}>
                            {track?.artist?.total_followers !== undefined
                                ? `${track.artist.total_followers} ${t('followers').toLowerCase()}`
                                : `0 ${t('followers').toLowerCase()}`}
                        </Text>
                        <Text style={styles.artistBio} numberOfLines={3}>
                            {track?.artist?.bio || "No biography available for this artist."}
                        </Text>
                    </View>
                </TouchableOpacity>
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
        paddingVertical: ms(10), // Added for larger touch area
        zIndex: 10, // Ensures slider is above controlsRow so buttons don't steal touches
        elevation: 10, // Required for Android to respect z-index for touch events
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
        width: ms(16), // Slightly larger for better grabbing
        height: ms(16),
        borderRadius: ms(8),
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        transform: [{ translateX: -ms(8) }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
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
        marginTop: ms(5)
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
        paddingVertical: ms(4),
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
        flexWrap: 'wrap',
        rowGap: ms(10),
        width: '100%',
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
    followingButtonActive: {
        backgroundColor: '#FFFFFF',
    },
    followButtonText: {
        fontFamily: FONTS.bold24,
        fontSize: ms(12),
        color: '#FFFFFF',
    },
    followingButtonTextActive: {
        color: '#000000',
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
