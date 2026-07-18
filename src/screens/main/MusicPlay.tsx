import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';

const MusicPlay = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    // Interactive UI state
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [progress, setProgress] = useState(114); // Start at 1:54 (114 seconds)
    const totalDuration = 200; // 3:20 total (200 seconds)

    // Track progress ticker
    useEffect(() => {
        let interval: any = null;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= totalDuration) {
                        return 0; // Loop play
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying]);

    // Format seconds to mm:ss format
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const activePercent = (progress / totalDuration) * 100;

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

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent={true}
            />

            {/* Background Gradient matching the mock exactly */}
            <LinearGradient
                colors={[COLORS.playGradientStart, COLORS.playGradientMiddle, COLORS.playGradientEnd]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom || ms(20) }]}>

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

                {/* Album Artwork */}
                <View style={styles.albumArtContainer}>
                    <View style={styles.albumArtShadowWrapper}>
                        <Image
                            source={{ uri: 'https://picsum.photos/400/400?random=109' }}
                            style={styles.albumArt}
                        />
                    </View>
                </View>

                {/* Track Title and Artist */}
                <View style={styles.trackInfoRow}>
                    <View style={styles.trackDetails}>
                        <Text style={styles.trackTitle} numberOfLines={1}>Blinding Lights</Text>
                        <Text style={styles.artistName} numberOfLines={1}>The Weeknd</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => setIsLiked(!isLiked)}
                        style={styles.likeButton}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.likeText, isLiked && styles.likeTextActive]}>
                            {isLiked ? '♥' : '♡'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Slider */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarActive, { width: `${activePercent}%` }]} />
                        <View style={[styles.progressThumb, { left: `${activePercent}%` }]} />
                    </View>
                    <View style={styles.timeRow}>
                        <Text style={styles.timeText}>{formatTime(progress)}</Text>
                        <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
                    </View>
                </View>

                {/* Playback Controls */}
                <View style={styles.controlsRow}>
                    {/* Shuffle Button */}
                    <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
                        <Image source={ICONS.shuffle} style={styles.Icon24} />
                    </TouchableOpacity>

                    {/* Skip Previous */}
                    <TouchableOpacity
                        onPress={() => setProgress(0)}
                        style={styles.controlButton}
                        activeOpacity={0.7}
                    >
                        <PrevIcon />
                    </TouchableOpacity>

                    {/* Play / Pause Toggle */}
                    <TouchableOpacity
                        onPress={() => setIsPlaying(!isPlaying)}
                        style={styles.playPauseButton}
                        activeOpacity={0.8}
                    >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </TouchableOpacity>

                    {/* Skip Next */}
                    <TouchableOpacity
                        onPress={() => setProgress(0)}
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
    );
};

export default MusicPlay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingTop: ms(12),
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
});
