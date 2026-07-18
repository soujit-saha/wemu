import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, ICONS } from '../utils/constants';
import { ms } from '../utils/helper/metric';
import Home from '../screens/BottomTab/Home';
import Search from '../screens/BottomTab/Search';
import Library from '../screens/BottomTab/Library';
import Premium from '../screens/BottomTab/Premium';
import Profile from '../screens/BottomTab/Profile';
import FloatingPlayer from '../component/FloatingPlayer';

const Tab = createBottomTabNavigator();

const width = Dimensions.get('window').width * 0.25;
const INACTIVE_TAB_COLOR = '#9CA3AF';

const BottomTab = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: [
            styles.tabBar,
            {
              height: ms(66) + insets.bottom,
              paddingBottom: insets.bottom,
            },
          ],
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.con}>
                <Image
                  source={focused ? ICONS.home : ICONS.home_de}
                  style={[
                    styles.tabIcon,
                    focused ? styles.tabIconActive : styles.tabIconInactive,
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    focused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.con}>
                <Image
                  source={ICONS.search}
                  style={[
                    styles.tabIcon,
                    focused ? styles.tabIconActive : styles.tabIconInactive,
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    focused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  Search
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Library"
          component={Library}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.con}>
                <Image
                  source={focused ? ICONS.library : ICONS.library_de}
                  style={[
                    styles.tabIcon,
                    focused ? styles.tabIconActive : styles.tabIconInactive,
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    focused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  Library
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Premium"
          component={Premium}
          options={{
            // tabBarStyle: { display: 'none' },
            tabBarIcon: ({ focused }) => (
              <View style={styles.con}>
                <Image
                  source={focused ? ICONS.premium : ICONS.premium_de}
                  style={[
                    styles.tabIcon,
                    focused ? styles.tabIconActive : styles.tabIconInactive,
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    focused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  Premium
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            // tabBarStyle: { display: 'none' },
            tabBarIcon: ({ focused }) => (
              <View style={styles.con}>
                <Image
                  source={focused ? ICONS.people : ICONS.people_de}
                  style={[
                    styles.tabIcon,
                    focused ? styles.tabIconActive : styles.tabIconInactive,
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    focused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  Profile
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      <FloatingPlayer />
    </View>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: ms(1),
    borderTopColor: 'rgba(255,255,255,0.15)',
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    paddingTop: ms(14),
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarBackground: {
    flex: 1,
    overflow: 'hidden',
  },
  tabBarBlur: {
    flex: 1,
  },
  con: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    height: ms(22),
    width: ms(22),
    resizeMode: 'contain',
  },
  tabIconActive: {
    tintColor: COLORS.Primary,
  },
  tabIconInactive: {
    tintColor: COLORS.Inactive,
  },
  tabLabel: {
    fontSize: ms(13),
    marginTop: ms(6),
    fontFamily: FONTS.medium24,
    includeFontPadding: false,
  },
  tabLabelActive: {
    color: COLORS.Primary,
  },
  tabLabelInactive: {
    color: COLORS.Inactive,
  },
});
