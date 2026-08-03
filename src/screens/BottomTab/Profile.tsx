import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import { logoutRequest } from '../../redux/reducer/AuthReducer';
import { myProfileRequest } from '../../redux/reducer/MainReducer';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { isReqLoading } = useSelector((state: any) => state.AuthReducer);
  const { myProfileRes } = useSelector((state: any) => state.MainReducer);

  React.useEffect(() => {
    dispatch(myProfileRequest({}));
  }, [dispatch]);

  const displayName = myProfileRes?.name || myProfileRes?.data?.name || '';
  const displayEmail = myProfileRes?.email || myProfileRes?.data?.email || '';
  const displayAvatar = myProfileRes?.avatar || myProfileRes?.data?.avatar || myProfileRes?.image || myProfileRes?.data?.image || 'https://randomuser.me/api/portraits/men/32.jpg';

  const handleLogout = () => {
    dispatch(logoutRequest({ showMsg: true }));
  };

  // Vector Drawing for Edit Profile Icon (User)
  const UserIcon = ({ color }: { color: string }) => (
    <View style={styles.userIconContainer}>
      <View style={[styles.userHead, { borderColor: color }]} />
      <View style={[styles.userBody, { borderColor: color }]} />
    </View>
  );

  // Vector Drawing for Account Icon (Shield/Security)
  const ShieldIcon = ({ color }: { color: string }) => (
    <View style={styles.shieldIconContainer}>
      <View style={[styles.shieldShape, { borderColor: color }]} />
      <View style={[styles.shieldCheck, { borderColor: color }]} />
    </View>
  );

  // Vector Drawing for Settings Icon (Gear)
  const GearIcon = ({ color }: { color: string }) => (
    <View style={styles.gearIconContainer}>
      <View style={[styles.gearInner, { borderColor: color }]} />
      {[0, 45, 90, 135].map((angle) => (
        <View
          key={angle}
          style={[styles.gearTeeth, { backgroundColor: color, transform: [{ rotate: `${angle}deg` }] }]}
        />
      ))}
      <View style={styles.gearCenter} />
    </View>
  );

  // Help Icon
  const HelpIcon = ({ color }: { color: string }) => (
    <View style={styles.helpIconContainer}>
      <Text style={[styles.helpTextChar, { color }]}>?</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Modern Left-Aligned Title Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Avatar section with Gradient Ring */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={[COLORS.Primary || '#6337EB', '#FFA6E6']}
            style={styles.avatarGradientRing}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatarImageWrapper}>
              <Image
                source={{ uri: displayAvatar }}
                style={styles.avatarImage}
              />
            </View>
          </LinearGradient>
          <Text style={styles.profileName}>{displayName}</Text>
          {displayEmail ? <Text style={styles.profileHandle}>{displayEmail}</Text> : null}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statColumn}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Playlists</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={styles.statNumber}>120</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={styles.statNumber}>540</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          {/* Edit Profile */}
          <TouchableOpacity
            style={styles.optionItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(99, 55, 235, 0.08)' }]}>
                <UserIcon color={COLORS.Primary || '#6337EB'} />
              </View>
              <Text style={styles.optionText}>Edit Profile</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Account */}
          <TouchableOpacity style={styles.optionItem} activeOpacity={0.7}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(52, 168, 83, 0.08)' }]}>
                <ShieldIcon color="#34A853" />
              </View>
              <Text style={styles.optionText}>Account Security</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity style={styles.optionItem} activeOpacity={0.7}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(18, 147, 237, 0.08)' }]}>
                <GearIcon color="#1293ED" />
              </View>
              <Text style={styles.optionText}>Settings</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity style={styles.optionItem} activeOpacity={0.7}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(251, 188, 4, 0.08)' }]}>
                <HelpIcon color="#FBBC04" />
              </View>
              <Text style={styles.optionText}>Help & Support</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.75}
          onPress={handleLogout}
          disabled={isReqLoading}
        >
          {isReqLoading ? (
            <ActivityIndicator size="small" color="#EF4444" />
          ) : (
            <Text style={styles.logoutButtonText}>Log Out</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: ms(120) }} />

      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: ms(24),
    paddingBottom: ms(40),
  },
  header: {
    height: ms(56),
    justifyContent: 'center',
    marginTop: ms(12),
  },
  headerTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(24),
    color: '#111827',
    includeFontPadding: false,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: ms(24),
  },
  avatarGradientRing: {
    width: ms(114),
    height: ms(114),
    borderRadius: ms(57),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.Primary || '#6337EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImageWrapper: {
    width: ms(106),
    height: ms(106),
    borderRadius: ms(53),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    resizeMode: 'cover',
  },
  profileName: {
    fontFamily: FONTS.bold28,
    fontSize: ms(20),
    color: '#111827',
    marginTop: ms(14),
    includeFontPadding: false,
  },
  profileHandle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13),
    color: '#9CA3AF',
    marginTop: ms(4),
    includeFontPadding: false,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: ms(24),
    paddingVertical: ms(16),
    marginTop: ms(28),
    marginBottom: ms(28),
    borderWidth: ms(1),
    borderColor: '#F3F4F6',
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#111827',
    includeFontPadding: false,
  },
  statLabel: {
    fontFamily: FONTS.regular24,
    fontSize: ms(12),
    color: '#6B7280',
    marginTop: ms(4),
    includeFontPadding: false,
  },
  statDivider: {
    width: ms(1),
    height: ms(20),
    backgroundColor: '#E5E7EB',
  },
  optionsList: {
    gap: ms(10),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: ms(60),
    paddingHorizontal: ms(14),
    backgroundColor: '#F9FAFB',
    borderRadius: ms(16),
    borderWidth: ms(1),
    borderColor: '#F3F4F6',
  },
  logoutButton: {
    alignSelf: 'center',
    marginTop: ms(32),
    paddingVertical: ms(12),
    paddingHorizontal: ms(24),
  },
  logoutButtonText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(15),
    color: '#EF4444',
    includeFontPadding: false,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(14.5),
    color: '#374151',
    marginLeft: ms(14),
    includeFontPadding: false,
  },
  chevron: {
    fontSize: ms(22),
    color: '#9CA3AF',
    fontFamily: FONTS.regular24,
    includeFontPadding: false,
    lineHeight: ms(22),
  },
  // Custom user icon drawing
  userIconContainer: {
    width: ms(18),
    height: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userHead: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    borderWidth: ms(1.5),
    backgroundColor: 'transparent',
  },
  userBody: {
    width: ms(12),
    height: ms(6),
    borderTopLeftRadius: ms(6),
    borderTopRightRadius: ms(6),
    borderWidth: ms(1.5),
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
    marginTop: ms(1.5),
  },
  // Custom shield/account icon drawing
  shieldIconContainer: {
    width: ms(18),
    height: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldShape: {
    width: ms(12),
    height: ms(14),
    borderWidth: ms(1.5),
    borderTopLeftRadius: ms(2),
    borderTopRightRadius: ms(2),
    borderBottomLeftRadius: ms(6),
    borderBottomRightRadius: ms(6),
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  shieldCheck: {
    width: ms(4),
    height: ms(6),
    borderBottomWidth: ms(1.5),
    borderRightWidth: ms(1.5),
    transform: [{ rotate: '45deg' }],
    marginTop: -ms(1),
  },
  // Custom gear/settings icon drawing
  gearIconContainer: {
    width: ms(18),
    height: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gearInner: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    borderWidth: ms(1.5),
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  gearTeeth: {
    width: ms(14),
    height: ms(3),
    borderRadius: ms(1),
    position: 'absolute',
    zIndex: 1,
  },
  gearCenter: {
    width: ms(3),
    height: ms(3),
    borderRadius: ms(1.5),
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    zIndex: 3,
  },
  // Help icon container
  helpIconContainer: {
    width: ms(18),
    height: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpTextChar: {
    fontFamily: FONTS.bold24,
    fontSize: ms(13),
    includeFontPadding: false,
  },
});