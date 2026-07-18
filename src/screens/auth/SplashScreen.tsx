import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, IMAGES } from '../../utils/constants';
import { ms, mvs } from '../../utils/helper/metric';
import { replace } from '../../utils/helper/RootNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {



    //   useEffect(() => {
    //     // Dispatch action to fetch saved session token on mount
    //     dispatch(getTokenRequest());
    //   }, [dispatch]);

    useEffect(() => {
        // Navigate after a short delay once token check is completed

        const timer = setTimeout(() => {

            replace('Onboarding');

        }, 2500); // 2.5 seconds delay for premium branding feel
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <LinearGradient
                // colors={['#F2EFFC', '#EBEBFB', '#FFFFFF', '#EBEBFB']}
                colors={['#DCD7FA',
                    '#F2EFFC',
                    '#EBEBFB',
                    '#DCD7FA']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}>


                <View style={styles.contentContainer}>
                    {/* Wemu Brand Logo */}
                    <Image
                        source={IMAGES.MainLogo}
                        style={styles.logo}
                    />

                    {/* Brand Name */}
                    <Text style={styles.brandName}>Wemu</Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>Music for Every Moment</Text>

                </View>

                <Image
                    source={IMAGES.Splash_bottom2}
                    style={styles.bottomWave}
                />
            </LinearGradient>


        </SafeAreaView>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: ms(100), // Slightly offset upwards from absolute vertical center
    },
    logo: {
        width: ms(116),
        height: ms(116),
        resizeMode: 'contain',
        borderRadius: ms(10),
        overflow: 'hidden'
    },
    brandName: {
        fontFamily: FONTS.bold28,
        fontSize: ms(36),
        color: '#5D33D6', // Wemu purple
        marginTop: ms(14),
        includeFontPadding: false,
    },
    subtitle: {
        fontFamily: FONTS.medium24,
        fontSize: ms(16),
        color: '#0082E6', // Sky blue subtitle accent
        marginTop: ms(8),
        includeFontPadding: false,
    },
    bottomWave: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: mvs(200),
    },
});
