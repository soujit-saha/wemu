import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';

const SHARE_OPTIONS = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
    color: '#E1306C',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
    color: '#25D366',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968764.png',
    color: '#1877F2',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
    color: '#1DA1F2',
  },
  {
    id: 'copylink',
    name: 'Copy link',
    icon: 'https://cdn-icons-png.flaticon.com/512/1621/1621635.png',
    color: '#4B5563',
  },
  {
    id: 'more',
    name: 'More',
    icon: 'https://cdn-icons-png.flaticon.com/512/570/570223.png',
    color: '#9CA3AF',
  },
];

const Share = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Image source={ICONS.leftarrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Track Card */}
        <View style={styles.trackCard}>
          <Image
            source={{ uri: 'https://picsum.photos/200/200?random=107' }}
            style={styles.trackArt}
          />
          <View style={styles.trackDetails}>
            <Text style={styles.trackTitle} numberOfLines={1}>Blinding Lights</Text>
            <Text style={styles.trackArtist} numberOfLines={1}>The Weeknd</Text>
          </View>
        </View>

        {/* Share Options List */}
        <View style={styles.optionsList}>
          {SHARE_OPTIONS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.optionRow} activeOpacity={0.7}>
              <View style={[styles.iconContainer, { borderColor: '#F3F4F6', borderWidth: ms(1) }]}>
                <Image source={{ uri: item.icon }} style={[styles.brandIcon, { tintColor: item.color }]} />
              </View>
              <Text style={styles.optionName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Share;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(24),
    height: ms(56),
    borderBottomWidth: ms(1),
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    width: ms(24),
    height: ms(24),
    resizeMode: 'contain',
    tintColor: '#000000',
  },
  headerTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#111827',
  },
  headerRightPlaceholder: {
    width: ms(40),
  },
  scrollContainer: {
    paddingHorizontal: ms(24),
    paddingTop: ms(24),
    paddingBottom: ms(40),
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: ms(20),
    padding: ms(16),
    marginBottom: ms(32),
    borderWidth: ms(1),
    borderColor: '#F3F4F6',
  },
  trackArt: {
    width: ms(68),
    height: ms(68),
    borderRadius: ms(14),
    resizeMode: 'cover',
  },
  trackDetails: {
    flex: 1,
    marginLeft: ms(18),
    justifyContent: 'center',
  },
  trackTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(16),
    color: '#111827',
    includeFontPadding: false,
  },
  trackArtist: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13),
    color: '#6B7280',
    marginTop: ms(4),
    includeFontPadding: false,
  },
  optionsList: {
    gap: ms(20),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ms(48),
  },
  iconContainer: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIcon: {
    width: ms(22),
    height: ms(22),
    resizeMode: 'contain',
  },
  optionName: {
    fontFamily: FONTS.medium24,
    fontSize: ms(16),
    color: '#1F2937',
    marginLeft: ms(18),
  },
});
