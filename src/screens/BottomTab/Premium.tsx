import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { CardField, CardForm, useStripe } from '@stripe/stripe-react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { ms } from '../../utils/helper/metric';
import {
  subscriptionsRequest,
  myCurrentSubscriptionRequest,
  purchaseSubscriptionRequest,
} from '../../redux/reducer/SubscriptionReducer';
import Loader from '../../utils/helper/Loader';
import ToastAlert from '../../utils/helper/Toast';

const Premium = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView>(null);
  const [availablePlansY, setAvailablePlansY] = useState(0);

  const { createPaymentMethod } = useStripe();
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);
  const [isPaying, setIsPaying] = useState(false);

  const { status, isLoading, subscriptionsRes, myCurrentSubscriptionRes, purchaseSubscriptionRes } = useSelector(
    (state: any) => state.SubscriptionReducer
  );

  const currentSub = myCurrentSubscriptionRes?.data || myCurrentSubscriptionRes;
  const hasActiveSub = !!(currentSub && (currentSub.subscription || currentSub.name || currentSub.subscription_id || currentSub.stripe_subscription_id));
  const activePlanName = currentSub?.subscription?.name || currentSub?.name || 'Premium';
  const expiryDate = currentSub?.ends_at;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    dispatch(subscriptionsRequest({}));
    dispatch(myCurrentSubscriptionRequest({}));
  }, [dispatch]);

  useEffect(() => {
    if (status === 'Subscription/purchaseSubscriptionSuccess') {
      ToastAlert('Subscription purchased successfully!');
      dispatch(myCurrentSubscriptionRequest({}));
    }
  }, [purchaseSubscriptionRes, status, dispatch]);

  const handlePay = async () => {
    if (!selectedPlanForPayment) return;
    setIsPaying(true);
    try {
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: 'Card',
      });

      if (error) {
        ToastAlert(error.message || 'Payment method creation failed');
        setIsPaying(false);
      } else if (paymentMethod) {
        dispatch(
          purchaseSubscriptionRequest({
            subscription_id: selectedPlanForPayment.id,
            payment_method_id: paymentMethod.id,
          })
        );
        setIsPaymentModalVisible(false);
        setIsPaying(false);
      }
    } catch (err: any) {
      ToastAlert(err.message || 'An error occurred');
      setIsPaying(false);
    }
  };

  const plans = Array.isArray(subscriptionsRes) ? subscriptionsRes : [];

  const parseFeatures = (htmlString: string): string[] => {
    if (!htmlString) return [];
    const regex = /<li>(.*?)<\/li>/gi;
    const matches = [];
    let match;
    while ((match = regex.exec(htmlString)) !== null) {
      const cleanText = match[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
      if (cleanText) {
        matches.push(cleanText);
      }
    }
    return matches;
  };

  const getPlanTheme = (slug: string, index: number) => {
    const lowercaseSlug = slug?.toLowerCase() || '';
    if (lowercaseSlug.includes('platinum')) {
      return {
        primaryColor: '#6337EB',
        textColor: '#4B5563',
        bgColor: '#6337EB15',
        badgeColor: '#E2F352',
        badgeText: '#000000',
      };
    }
    if (lowercaseSlug.includes('standard')) {
      return {
        primaryColor: '#10B981',
        textColor: '#047857',
        bgColor: '#10B98115',
        badgeColor: '#10B981',
        badgeText: '#FFFFFF',
      };
    }
    const themes = [
      {
        primaryColor: '#10B981',
        textColor: '#047857',
        bgColor: '#10B98115',
        badgeColor: '#10B981',
        badgeText: '#FFFFFF',
      },
      {
        primaryColor: '#6337EB',
        textColor: '#4B5563',
        bgColor: '#6337EB15',
        badgeColor: '#E2F352',
        badgeText: '#000000',
      },
      {
        primaryColor: '#8B5CF6',
        textColor: '#6D28D9',
        bgColor: '#8B5CF615',
        badgeColor: '#4B5563',
        badgeText: '#FFFFFF',
      },
    ];
    return themes[index % themes.length];
  };

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
      <Loader visible={isLoading} />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + ms(16), paddingBottom: insets.bottom + ms(24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Promo Section / Active Subscription Section */}
        {hasActiveSub ? (
          <View style={styles.activePlanSection}>
            <View style={styles.activePlanHeaderRow}>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeBadgeText}>ACTIVE PLAN</Text>
              </View>
              <Text style={styles.activePlanPrice}>
                {currentSub?.subscription?.price ? `${currentSub.subscription.currency === 'USD' ? '$' : '₹'}${currentSub.subscription.price} / ${currentSub.subscription.interval}` : ''}
              </Text>
            </View>

            <Text style={styles.activePlanName}>{activePlanName}</Text>
            <Text style={styles.activePlanDescription}>
              Enjoy unlimited skips, ad-free music, offline listening, and maximum audio quality.
            </Text>

            {expiryDate ? (
              <Text style={styles.activePlanRenewal}>
                Renews on {formatDate(expiryDate)}
              </Text>
            ) : null}
          </View>
        ) : (
          <View style={styles.promoSection}>
            <Text style={styles.promoTitle}>
              You are on the Free Tier
            </Text>
            <Text style={styles.promoSubtitle}>
              Upgrade to Premium for ad-free music, offline downloads, and higher sound quality.
            </Text>
            <TouchableOpacity
              style={styles.promoCTA}
              activeOpacity={0.8}
              onPress={() => {
                if (scrollViewRef.current) {
                  scrollViewRef.current.scrollTo({
                    y: availablePlansY,
                    animated: true,
                  });
                }
              }}
            >
              <Text style={styles.promoCTAText}>Explore Premium Plans</Text>
            </TouchableOpacity>
            <Text style={styles.promoDisclaimer}>
              Terms apply. Cancel anytime. Available plans are shown below.
            </Text>
          </View>
        )}

        {/* Section Header: Available Plans */}
        <View
          style={styles.sectionHeader}
          onLayout={(event) => {
            setAvailablePlansY(event.nativeEvent.layout.y);
          }}
        >
          <Text style={styles.sectionTitle}>Available plans</Text>
          {/* <Text style={styles.sectionSubtitle}>Always flexible, cancel anytime.</Text> */}
        </View>

        {plans.length > 0 ? (
          plans.map((plan: any, index: number) => {
            const theme = getPlanTheme(plan.slug, index);
            const parsedFeatures = parseFeatures(plan.features);
            const tagline = plan.tagline || '';
            const currencySym = plan.currency === 'USD' ? '$' : plan.currency === 'INR' ? '₹' : plan.currency;
            const formattedPrice = `${currencySym}${plan.price} / ${plan.interval}`;

            return (
              <View
                key={plan.id || index}
                style={[styles.planCard, { borderColor: theme.primaryColor + '30' }]}
              >
                {tagline ? (
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: theme.badgeColor }]}>
                      <Text style={[styles.badgeText, { color: theme.badgeText }]}>{tagline}</Text>
                    </View>
                  </View>
                ) : null}

                <View style={styles.cardHeader}>
                  <View style={styles.planTitleRow}>
                    <View style={[styles.planIconWrapper, { backgroundColor: theme.bgColor }]}>
                      <Text style={[styles.planHeaderIcon, { color: theme.primaryColor }]}>
                        {plan.slug?.toLowerCase().includes('platinum') ? '👑' : '✦'}
                      </Text>
                    </View>
                    <Text style={[styles.planName, { color: theme.textColor }]}>
                      {plan.name}
                    </Text>
                  </View>
                  {/* <Text style={styles.planHeading}>
                    {plan.name === 'Standard' ? 'Soundtrack your life' : 'Next level listening'}
                  </Text> */}
                </View>

                <View style={styles.divider} />

                <View style={styles.featuresList}>
                  {parsedFeatures.map((feat: string, fIdx: number) => (
                    <React.Fragment key={fIdx}>
                      {renderFeature('✓', feat, theme.primaryColor)}
                    </React.Fragment>
                  ))}
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceHighlight}>{formattedPrice}</Text>
                  {plan.trial_days > 0 ? (
                    <Text style={styles.priceSubtext}>{plan.trial_days} days trial period</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={[styles.planCTA, { backgroundColor: theme.badgeColor }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedPlanForPayment(plan);
                    setIsPaymentModalVisible(true);
                  }}
                >
                  <Text style={[styles.planCTAText, { color: theme.badgeText }]}>
                    Get {plan.name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          !isLoading && (
            <View style={{ alignItems: 'center', marginVertical: ms(40) }}>
              <Text style={{ fontFamily: FONTS.medium24, fontSize: ms(14), color: '#9CA3AF' }}>
                No plans available at the moment.
              </Text>
            </View>
          )
        )}

        <View style={{ height: ms(120) }} />
      </ScrollView>

      <Modal
        visible={isPaymentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Card Details</Text>
            {selectedPlanForPayment && (
              <Text style={styles.modalSubtitle}>
                Subscribing to {selectedPlanForPayment.name}
              </Text>
            )}

            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: 'Card Number',
              }}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
                placeholderColor: '#9CA3AF',
              }}
              style={styles.cardField}
            />

            <TouchableOpacity
              style={[styles.modalPayButton, isPaying && styles.modalButtonDisabled]}
              activeOpacity={0.8}
              onPress={handlePay}
              disabled={isPaying}
            >
              {isPaying ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.modalPayButtonText}>Pay & Subscribe</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              activeOpacity={0.8}
              onPress={() => setIsPaymentModalVisible(false)}
              disabled={isPaying}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  promoSubtitle: {
    fontFamily: FONTS.regular24,
    fontSize: ms(14),
    lineHeight: ms(20),
    color: '#4B5563',
    marginBottom: ms(20),
  },
  activePlanSection: {
    backgroundColor: '#EEF2FF', // Soft indigo background
    borderColor: '#C7D2FE',
    borderWidth: ms(1.5),
    borderRadius: ms(20),
    padding: ms(20),
    marginBottom: ms(32),
  },
  activePlanHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(6),
  },
  activeDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: '#10B981',
    marginRight: ms(6),
  },
  activeBadgeText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(10),
    color: '#065F46',
  },
  activePlanPrice: {
    fontFamily: FONTS.bold28,
    fontSize: ms(14),
    color: '#4B5563',
  },
  activePlanName: {
    fontFamily: FONTS.bold28,
    fontSize: ms(24),
    color: '#1E1B4B',
    marginBottom: ms(8),
  },
  activePlanDescription: {
    fontFamily: FONTS.regular24,
    fontSize: ms(13),
    lineHeight: ms(18),
    color: '#4338CA',
    marginBottom: ms(16),
  },
  activePlanRenewal: {
    fontFamily: FONTS.medium24,
    fontSize: ms(12),
    color: '#6B7280',
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
    backgroundColor: COLORS.white
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ms(20),
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: ms(20),
    padding: ms(24),
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: FONTS.bold28,
    fontSize: ms(20),
    color: '#111827',
    marginBottom: ms(8),
  },
  modalSubtitle: {
    fontFamily: FONTS.medium24,
    fontSize: ms(14),
    color: '#4B5563',
    marginBottom: ms(24),
  },
  cardField: {
    width: Dimensions.get('window').width - ms(88),
    height: ms(50),
    marginVertical: ms(10),
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: ms(8),
    backgroundColor: '#FFFFFF',
  },
  modalPayButton: {
    width: '100%',
    height: ms(48),
    backgroundColor: COLORS.Primary,
    borderRadius: ms(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ms(24),
    marginBottom: ms(12),
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalPayButtonText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(14),
    color: '#FFFFFF',
  },
  modalCancelButton: {
    width: '100%',
    height: ms(48),
    borderColor: '#D1D5DB',
    borderWidth: 1.5,
    borderRadius: ms(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontFamily: FONTS.bold24,
    fontSize: ms(14),
    color: '#4B5563',
  },
});