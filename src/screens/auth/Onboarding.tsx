import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { COLORS, FONTS, IMAGES } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { setOnboardingSeen } from '../../redux/reducer/AuthReducer';

const { width } = Dimensions.get('window');

interface SlideItem {
    id: number;
    image: any;
    title: string;
    subtitle: string;
}

const slides: SlideItem[] = [
    {
        id: 1,
        image: IMAGES.onboarding_1,
        title: 'Discover new music.',
        subtitle: 'Millions of songs and\nplaylists just for you.',
    },
    {
        id: 2,
        image: IMAGES.onboarding_2,
        title: 'Play your favorites.',
        subtitle: 'Listen on mobile, desktop\nand other devices.',
    },
    {
        id: 3,
        image: IMAGES.onboarding_3,
        title: 'Download & listen offline.',
        subtitle: 'Enjoy music without\nan internet connection.',
    },
];

const Onboarding = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList<SlideItem>>(null);

    const handleButtonPress = async () => {
        if (activeIndex < slides.length - 1) {
            const nextIndex = activeIndex + 1;
            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setActiveIndex(nextIndex);
        } else {
            try {
                await AsyncStorage.setItem('HAS_SEEN_ONBOARDING', 'true');
                dispatch(setOnboardingSeen(true));
            } catch (error) {
                console.log('Error saving onboarding state:', error);
            }
            navigation.replace('Login');
        }
    };

    const onScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        if (index !== activeIndex && index >= 0 && index < slides.length) {
            setActiveIndex(index);
        }
    };

    const renderItem = ({ item }: { item: SlideItem }) => {
        return (
            <View style={styles.slide}>
                {/* Top Illustration Section */}
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.image} resizeMode="cover" />
                </View>

                {/* Text Section */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2EFFC" />

            {/* Horizontal Scrollable Onboarding Carousel */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id.toString()}
                style={styles.flatList}
            />

            {/* Fixed Bottom Indicators and Button Section */}
            <View style={styles.bottomContainer}>
                {/* Slide Indicator Dots */}
                <View style={styles.indicatorRow}>
                    {slides.map((_, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.indicatorDot,
                                    isActive && styles.indicatorDotActive,
                                ]}
                            />
                        );
                    })}
                </View>

                {/* Primary Navigation Button */}
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleButtonPress}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>
                        {activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Onboarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    flatList: {
        flex: 1,
    },
    slide: {
        width: width,
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '65%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        flex: 0.7,
        paddingTop: ms(36),
        paddingHorizontal: ms(24),
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontFamily: FONTS.bold28,
        fontSize: ms(26),
        color: '#000000',
        textAlign: 'center',
        marginBottom: ms(16),
    },
    subtitle: {
        fontFamily: FONTS.regular24,
        fontSize: ms(15),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: ms(24),
    },
    bottomContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: ms(24),
        paddingBottom: ms(28),
    },
    indicatorRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: ms(32),
        gap: ms(8),
    },
    indicatorDot: {
        width: ms(8),
        height: ms(8),
        borderRadius: ms(4),
        backgroundColor: '#D1D5DB',
    },
    indicatorDotActive: {
        backgroundColor: COLORS.Primary || '#6337EB',
        width: ms(10),
        height: ms(10),
        borderRadius: ms(5),
    },
    primaryButton: {
        height: ms(54),
        backgroundColor: COLORS.Primary || '#6337EB',
        borderRadius: ms(12),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.Primary || '#6337EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    primaryButtonText: {
        fontFamily: FONTS.semiBold24,
        fontSize: ms(16),
        color: '#FFFFFF',
    },
});
