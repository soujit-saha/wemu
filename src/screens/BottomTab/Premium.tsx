import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';

const Premium = () => {
  const insets = useSafeAreaInsets();

  const renderFeature = (icon: string, text: string, color: string = '#6B7280') => {
    return (
      <View style={styles.featureRow}>
        <View style={[styles.featureIconContainer, { backgroundColor: color + '15' }]}>
          <Text style={[styles.featureIcon, { color }]}>{icon}</Text>
        </View>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + ms(16), paddingBottom: insets.bottom + ms(24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Promo Section */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>
            Listen without limits. Try 2 months of Premium Standard for ₹139 with Wemu.
          </Text>

          <TouchableOpacity style={styles.promoCTA} activeOpacity={0.8}>
            <Text style={styles.promoCTAText}>Try 2 months for ₹139</Text>
          </TouchableOpacity>

          <Text style={styles.promoDisclaimer}>
            ₹139 for 2 months, then ₹139 per month after. Offer only available if you haven't tried Premium before and you subscribe via Wemu. Offers via Google Play may differ. Terms apply. See other plans below.
          </Text>
        </View>

        {/* Section Header: Available Plans */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available plans</Text>
          <Text style={styles.sectionSubtitle}>Always flexible, cancel anytime.</Text>
        </View>

        {/* Card 1: Premium Standard */}
        <View style={[styles.planCard, styles.standardCard]}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: '#10B981' }]}>
              <Text style={styles.badgeText}>₹139 for 2 months</Text>
            </View>
          </View>

          <View style={styles.cardHeader}>
            <View style={styles.planTitleRow}>
              <View style={[styles.planIconWrapper, { backgroundColor: '#10B98115' }]}>
                <Text style={[styles.planHeaderIcon, { color: '#10B981' }]}>✦</Text>
              </View>
              <Text style={[styles.planName, { color: '#047857' }]}>Premium Standard</Text>
            </View>
            <Text style={styles.planHeading}>Soundtrack your life</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featuresList}>
            {renderFeature('📢', 'Ad-free music listening', '#10B981')}
            {renderFeature('🔀', 'Play songs in any order on all devices', '#10B981')}
            {renderFeature('🎧', 'Very high audio quality', '#10B981')}
            {renderFeature('⬇️', 'Download to listen offline', '#10B981')}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceHighlight}>₹139 for 2 months</Text>
            <Text style={styles.priceSubtext}>₹139/month after</Text>
          </View>

          <TouchableOpacity style={[styles.planCTA, { backgroundColor: '#10B981' }]} activeOpacity={0.8}>
            <Text style={styles.planCTAText}>Try 2 months for ₹139</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineCTA} activeOpacity={0.8}>
            <Text style={styles.outlineCTAText}>One-time payment</Text>
          </TouchableOpacity>

          <Text style={styles.cardDisclaimer}>
            ₹139 for 2 months, then ₹139 per month after. Offer only available if you haven't tried Premium before and you subscribe via Wemu. Offers via Google Play may differ. Terms apply.
          </Text>
        </View>

        {/* Card 2: Premium Platinum */}
        <View style={[styles.planCard, styles.platinumCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.planTitleRow}>
              <View style={[styles.planIconWrapper, { backgroundColor: '#6337EB15' }]}>
                <Text style={[styles.planHeaderIcon, { color: '#6337EB' }]}>👑</Text>
              </View>
              <Text style={[styles.planName, { color: '#4B5563' }]}>Premium Platinum</Text>
            </View>
            <Text style={styles.planHeading}>Next level listening</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featuresList}>
            {renderFeature('✓', 'All the Standard features, plus:', '#6337EB')}
            {renderFeature('👥', 'Up to 3 Platinum accounts', '#6337EB')}
            {renderFeature('✨', 'Lossless music quality', '#6337EB')}
            {renderFeature('🤖', 'Turn ideas into playlists or let DJ set the vibe, powered by AI', '#6337EB')}
            {renderFeature('🎛️', 'Advanced mixing and transition tools', '#6337EB')}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceHighlight}>₹299 / month</Text>
          </View>

          <TouchableOpacity style={[styles.planCTA, { backgroundColor: '#E2F352' }]} activeOpacity={0.8}>
            <Text style={[styles.planCTAText, { color: '#000000' }]}>Get Premium Platinum</Text>
          </TouchableOpacity>

          <Text style={styles.cardDisclaimer}>
            For up to 3 individuals residing at the same address. Terms apply.
          </Text>
        </View>

        {/* Card 3: Premium Student */}
        <View style={[styles.planCard, styles.studentCard]}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: '#4B5563' }]}>
              <Text style={styles.badgeText}>Savings available</Text>
            </View>
          </View>

          <View style={styles.cardHeader}>
            <View style={styles.planTitleRow}>
              <View style={[styles.planIconWrapper, { backgroundColor: '#8B5CF615' }]}>
                <Text style={[styles.planHeaderIcon, { color: '#8B5CF6' }]}>🎓</Text>
              </View>
              <Text style={[styles.planName, { color: '#6D28D9' }]}>Premium Student</Text>
            </View>
            <Text style={styles.planHeading}>Premium for Students</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featuresList}>
            {renderFeature('✓', 'All the Standard features, at a lower price', '#8B5CF6')}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceHighlight}>₹69 for 2 months</Text>
            <Text style={styles.priceSubtext}>₹69/month after</Text>
          </View>

          <TouchableOpacity style={[styles.planCTA, { backgroundColor: '#10B981' }]} activeOpacity={0.8}>
            <Text style={styles.planCTAText}>Try 2 months for ₹69</Text>
          </TouchableOpacity>

          <Text style={styles.cardDisclaimer}>
            Offer only available to students at accredited higher education institutions. Terms apply.
          </Text>
        </View>

        <View style={{ height: ms(120) }} />
      </ScrollView>
    </View>
  );
};

export default Premium;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: ms(20),
  },
  promoSection: {
    marginBottom: ms(32),
  },
  promoTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(22),
    lineHeight: ms(30),
    color: '#111827',
    marginBottom: ms(20),
  },
  promoCTA: {
    backgroundColor: COLORS.Primary,
    height: ms(52),
    borderRadius: ms(26),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  promoCTAText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(15),
    color: '#FFFFFF',
  },
  promoDisclaimer: {
    fontFamily: FONTS.regular24,
    fontSize: ms(11),
    lineHeight: ms(16),
    color: '#6B7280',
    textAlign: 'left',
  },
  sectionHeader: {
    marginBottom: ms(20),
  },
  sectionTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(22),
    color: '#111827',
    marginBottom: ms(4),
  },
  sectionSubtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(14),
    color: '#6B7280',
  },
  planCard: {
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: ms(24),
    borderWidth: ms(1.5),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  standardCard: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  platinumCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  studentCard: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: ms(14),
  },
  badge: {
    paddingHorizontal: ms(10),
    paddingVertical: ms(4),
    borderRadius: ms(6),
  },
  badgeText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(11),
    color: '#FFFFFF',
  },
  cardHeader: {
    marginBottom: ms(16),
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(8),
  },
  planIconWrapper: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(8),
  },
  planHeaderIcon: {
    fontSize: ms(12),
    lineHeight: ms(14),
  },
  planName: {
    fontFamily: FONTS.bold28,
    fontSize: ms(14),
  },
  planHeading: {
    fontFamily: FONTS.bold28,
    fontSize: ms(20),
    color: '#111827',
    marginTop: ms(2),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D1D5DB',
    marginVertical: ms(12),
  },
  featuresList: {
    marginBottom: ms(20),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: ms(12),
  },
  featureIconContainer: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(10),
    marginTop: ms(2),
  },
  featureIcon: {
    fontSize: ms(10),
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
    fontFamily: FONTS.medium24,
    fontSize: ms(13),
    lineHeight: ms(18),
    color: '#1F2937',
  },
  priceRow: {
    marginBottom: ms(16),
  },
  priceHighlight: {
    fontFamily: FONTS.bold28,
    fontSize: ms(18),
    color: '#111827',
  },
  priceSubtext: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13),
    color: '#6B7280',
    marginTop: ms(2),
  },
  planCTA: {
    height: ms(48),
    borderRadius: ms(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  planCTAText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(14),
    color: '#FFFFFF',
  },
  outlineCTA: {
    height: ms(48),
    borderRadius: ms(24),
    borderWidth: ms(1.5),
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  outlineCTAText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(14),
    color: '#10B981',
  },
  cardDisclaimer: {
    fontFamily: FONTS.regular24,
    fontSize: ms(10),
    lineHeight: ms(14),
    color: '#6B7280',
    textAlign: 'left',
  },
});