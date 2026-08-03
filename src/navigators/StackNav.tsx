import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Platform, Easing, Dimensions } from 'react-native';
import { navigationRef } from '../utils/helper/RootNavigation';
import BottomTab from './BottomTab';
import { useSelector } from 'react-redux';
import { ms } from '../utils/helper/metric';

import SplashScreen from '../screens/auth/SplashScreen';
import Onboarding from '../screens/auth/Onboarding';
import Signup from '../screens/auth/Signup';
import Login from '../screens/auth/Login';
import Otp from '../screens/auth/Otp';
import ForgotPassword from '../screens/auth/ForgotPassword';
import OtpVerify from '../screens/auth/OtpVerify';
import ResetPassword from '../screens/auth/ResetPassword';
import MusicPlay from '../screens/main/MusicPlay';
import Share from '../screens/main/Share';
import Notification from '../screens/main/Notification';
import Offline from '../screens/main/Offline';
import Downloads from '../screens/main/Downloads';
import Album from '../screens/main/Album';
import PlayList from '../screens/main/PlayList';
import CreatePlayList from '../screens/main/CreatePlayList';
import EditProfile from '../screens/main/EditProfile';

type RootStackParamList = {
  SplashScreen: undefined;
  Onboarding: undefined;
  Signup: undefined;
  Login: undefined;
  Otp: undefined;
  ForgotPassword: undefined;
  OtpVerify: { email: string };
  ResetPassword: { email: string; code: string };
  BottomTab: undefined;
  MusicPlay: undefined;
  Share: undefined;
  Notification: undefined;
  Offline: undefined;
  Downloads: undefined;
  Album: undefined;
  PlayList: undefined;
  CreatePlayList: undefined;
  EditProfile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Enhanced smooth transition configuration
const smoothTransition = {
  // gestureEnabled: true,
  gestureDirection: 'horizontal' as const,
  transitionSpec: {
    open: {
      animation: 'timing' as const,
      config: {
        duration: 350,
        easing: Easing.out(Easing.poly(4)),
      },
    },
    close: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.in(Easing.poly(4)),
      },
    },
  },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export default function StackNav() {
  const { getTokenResponse, isLoading, hasSeenOnboarding } = useSelector(
    (state: any) => state.AuthReducer,
  );

  // console.log("getTokenResponse", getTokenResponse);
  const Screens: Partial<{
    [key in keyof RootStackParamList]: React.ComponentType<any>;
  }> =
    getTokenResponse == null ?
      (hasSeenOnboarding ?
        {
          Login,
          Signup,
          Otp,
          ForgotPassword,
          OtpVerify,
          ResetPassword,
        } : {
          Onboarding,
          Login,
          Signup,
          Otp,
          ForgotPassword,
          OtpVerify,
          ResetPassword,
        }
      ) : {
        BottomTab,
        MusicPlay,
        Share,
        Notification,
        Offline,
        Downloads,
        Album,
        PlayList,
        CreatePlayList,
        EditProfile,
      };


  if (isLoading) {
    return <SplashScreen />;
  } else {
    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...smoothTransition,
          }}
        >
          {Object.entries({
            ...Screens,
          }).map(([name, component], index) => {
            const isMusicPlay = name === 'MusicPlay';
            return (
              <Stack.Screen
                key={index}
                name={name as keyof RootStackParamList}
                component={component}
                options={{
                  ...(isMusicPlay
                    ? {
                      gestureDirection: 'vertical' as const,
                      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                    }
                    : smoothTransition),
                  // gestureEnabled: true,
                  gestureResponseDistance: 50, // Increase swipe sensitivity
                }}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
