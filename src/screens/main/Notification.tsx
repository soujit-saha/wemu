import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, ICONS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import FloatingPlayer from '../../component/FloatingPlayer';

const NOTIFICATION_TABS = ['All', 'Inbox', 'Activity', 'Offers'];

interface NotificationItem {
  id: string;
  message: string;
  time: string;
  type: 'release' | 'playlist' | 'like' | 'billing';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    message: 'New release from The Weeknd: "Nothing is Lost" is out now.',
    time: '3h ago',
    type: 'release',
    read: false,
  },
  {
    id: '2',
    message: 'Your playlist "Chill Vibes" was saved by 12 new users today.',
    time: '5h ago',
    type: 'playlist',
    read: false,
  },
  {
    id: '3',
    message: 'Alex and 4 others liked your track list: "Workout Mix".',
    time: '1d ago',
    type: 'like',
    read: true,
  },
  {
    id: '4',
    message: 'Your Premium plan will renew automatically tomorrow.',
    time: '1d ago',
    type: 'billing',
    read: true,
  },
  {
    id: '5',
    message: 'System Maintenance: Wemu services will be upgraded on Sunday.',
    time: '3d ago',
    type: 'billing',
    read: true,
  },
];

const Notification = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const toggleReadStatus = (id: string) => {
    const updated = notifications.map((n) => {
      if (n.id === id) {
        return { ...n, read: !n.read };
      }
      return n;
    });
    setNotifications(updated);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Inbox') return item.type === 'billing';
    if (activeTab === 'Activity') return item.type === 'like' || item.type === 'playlist';
    if (activeTab === 'Offers') return item.type === 'release';
    return true;
  });

  const getBadgeConfig = (type: NotificationItem['type']) => {
    switch (type) {
      case 'release':
        return { icon: '🎵', bg: 'rgba(18, 147, 237, 0.1)', text: '#1293ED' };
      case 'playlist':
        return { icon: '📂', bg: 'rgba(52, 168, 83, 0.1)', text: '#34A853' };
      case 'like':
        return { icon: '❤️', bg: 'rgba(235, 0, 27, 0.1)', text: '#EB001B' };
      case 'billing':
        return { icon: '🔔', bg: 'rgba(251, 188, 4, 0.1)', text: '#FBBC04' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Row */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Image source={ICONS.leftarrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          onPress={handleMarkAllRead}
          activeOpacity={0.7}
          disabled={!notifications.some((n) => !n.read)}
        >
          <Text
            style={[
              styles.headerActionText,
              !notifications.some((n) => !n.read) && styles.headerActionTextDisabled,
            ]}
          >
            Mark read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {NOTIFICATION_TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  isActive && styles.tabButtonActive,
                ]}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    isActive && styles.tabButtonTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List Container */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length > 0 ? (
          <View style={styles.listContainer}>
            {filteredNotifications.map((item) => {
              const badge = getBadgeConfig(item.type);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.notificationRow, !item.read && styles.notificationRowUnread]}
                  activeOpacity={0.8}
                  onPress={() => toggleReadStatus(item.id)}
                >
                  {/* Badge Container */}
                  <View style={[styles.badgeContainer, { backgroundColor: badge.bg }]}>
                    {/* <Text style={styles.badgeIcon}>{badge.icon}</Text> */}
                    <Image source={ICONS.notification} style={{ height: ms(20), width: ms(20), resizeMode: 'contain' }} />
                  </View>

                  {/* Message Metadata */}
                  <View style={styles.messageContainer}>
                    <Text style={[styles.messageText, !item.read && styles.messageTextBold]}>
                      {item.message}
                    </Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>

                  {/* Unread indicator dot */}
                  {!item.read && (
                    <View style={styles.unreadDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No notifications in {activeTab}</Text>
          </View>
        )}
      </ScrollView>
      <FloatingPlayer />
    </SafeAreaView>
  );
};

export default Notification;

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
    height: ms(60),
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    width: ms(22),
    height: ms(22),
    resizeMode: 'contain',
    tintColor: '#111827',
  },
  headerTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#111827',
    includeFontPadding: false,
  },
  headerActionText: {
    fontFamily: FONTS.semiBold24,
    fontSize: ms(14),
    color: COLORS.Primary || '#6337EB',
    includeFontPadding: false,
  },
  headerActionTextDisabled: {
    color: '#9CA3AF',
  },
  tabsContainer: {
    height: ms(38),
    marginTop: ms(12),
    marginBottom: ms(16),
  },
  tabsScroll: {
    paddingHorizontal: ms(24),
    alignItems: 'center',
    gap: ms(8),
  },
  tabButton: {
    paddingHorizontal: ms(18),
    paddingVertical: ms(6),
    borderRadius: ms(20),
    backgroundColor: '#F3F4F6',
  },
  tabButtonActive: {
    backgroundColor: COLORS.Primary || '#6337EB',
  },
  tabButtonText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(13),
    color: '#4B5563',
    includeFontPadding: false,
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold24,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: ms(24),
    paddingBottom: ms(150),
  },
  listContainer: {
    gap: ms(12),
    marginTop: ms(8),
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(12),
    paddingHorizontal: ms(14),
    borderRadius: ms(16),
    backgroundColor: '#F9FAFB',
    borderWidth: ms(1),
    borderColor: '#F3F4F6',
  },
  notificationRowUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(99, 55, 235, 0.15)',
    shadowColor: '#6337EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  badgeContainer: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(100),
    justifyContent: 'center',
    alignItems: 'center',

  },
  badgeIcon: {
    fontSize: ms(18),
  },
  messageContainer: {
    flex: 1,
    marginLeft: ms(14),
    justifyContent: 'center',
  },
  messageText: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13.5),
    color: '#4B5563',
    lineHeight: ms(18),
    includeFontPadding: false,
  },
  messageTextBold: {
    fontFamily: FONTS.semiBold24,
    color: '#111827',
  },
  timeText: {
    fontFamily: FONTS.regular24,
    fontSize: ms(11),
    color: '#9CA3AF',
    marginTop: ms(4),
    includeFontPadding: false,
  },
  unreadDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: COLORS.Primary || '#6337EB',
    marginLeft: ms(8),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ms(100),
  },
  emptyEmoji: {
    fontSize: ms(44),
    marginBottom: ms(16),
  },
  emptyText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(15),
    color: '#9CA3AF',
  },
});
