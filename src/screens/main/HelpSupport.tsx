import React, { FunctionComponent, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS, ICONS } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { ms } from '../../utils/helper/metric';
import { useDispatch, useSelector } from 'react-redux';
import { raiseHelpRequest, supportArticlesRequest, getCmsRequest } from '../../redux/reducer/MainReducer';
import ToastAlert from '../../utils/helper/Toast';
import RenderHtml from 'react-native-render-html';
import { useTranslation } from '../../utils/hooks/useTranslation';

const helpItems = [
  'Help Center',
  'Contact Us',
  'Report a Problem',
  'Terms & Conditions',
  'Privacy Policy',
  'Community Guidelines',
];

const HelpSupport: FunctionComponent = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { supportArticlesRes, getCmsRes } = useSelector((state: any) => state.MainReducer);
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [subject, setSubject] = useState('');
  const [queries, setQueries] = useState('');

  const handleOpenModal = (item: string) => {
    setSelectedItem(item);
    setModalVisible(true);
    if (item === 'Help Center') {
      dispatch(supportArticlesRequest({}));
    } else if (['Contact Us', 'Terms & Conditions', 'Privacy Policy', 'Community Guidelines'].includes(item)) {
      let slug = '';
      if (item === 'Contact Us') slug = 'contact-us';
      if (item === 'Terms & Conditions') slug = 'terms-conditions';
      if (item === 'Privacy Policy') slug = 'privacy-policy';
      if (item === 'Community Guidelines') slug = 'community-guidelines';
      dispatch(getCmsRequest(slug));
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setSubject('');
    setQueries('');
  };

  const handleSubmit = () => {
    if (!subject.trim()) {
      ToastAlert(t('pleaseEnterSubject'));
      return;
    }
    if (!queries.trim()) {
      ToastAlert(t('pleaseEnterQueries'));
      return;
    }
    const formData = new FormData();
    formData.append('subject', subject.trim());
    formData.append('queries', queries.trim());
    dispatch(raiseHelpRequest(formData));
    handleCloseModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image source={ICONS.leftarrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('helpSupport')}</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {helpItems.map(item => {
            let translatedItem = item;
            if (item === 'Help Center') translatedItem = t('helpCenter');
            if (item === 'Contact Us') translatedItem = t('contactUs');
            if (item === 'Report a Problem') translatedItem = t('reportProblem');
            if (item === 'Terms & Conditions') translatedItem = t('termsConditions');
            if (item === 'Privacy Policy') translatedItem = t('privacyPolicy');
            if (item === 'Community Guidelines') translatedItem = t('communityGuidelines');

            return (
              <TouchableOpacity
                key={item}
                style={styles.optionItem}
                activeOpacity={0.7}
                onPress={() => handleOpenModal(item)}
              >
                <Text style={styles.optionText}>{translatedItem}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.backButton} activeOpacity={0.7}>
              <Image source={ICONS.leftarrow} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>{
              selectedItem === 'Help Center' ? t('helpCenter') : 
              selectedItem === 'Contact Us' ? t('contactUs') :
              selectedItem === 'Report a Problem' ? t('reportProblem') :
              selectedItem === 'Terms & Conditions' ? t('termsConditions') :
              selectedItem === 'Privacy Policy' ? t('privacyPolicy') :
              selectedItem === 'Community Guidelines' ? t('communityGuidelines') :
              selectedItem
            }</Text>
            <View style={{ width: ms(40) }} />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {selectedItem === 'Report a Problem' ? (
                <View style={styles.reportProblemContainer}>
                  <Text style={styles.inputLabel}>{t('subject')}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('enterSubject')}
                    placeholderTextColor="#9CA3AF"
                    value={subject}
                    onChangeText={setSubject}
                    maxLength={255}
                  />

                  <Text style={styles.inputLabel}>{t('description')}</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder={t('describeProblem')}
                    placeholderTextColor="#9CA3AF"
                    value={queries}
                    onChangeText={setQueries}
                    multiline
                    textAlignVertical="top"
                  />

                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
                    <Text style={styles.submitButtonText}>{t('submit')}</Text>
                  </TouchableOpacity>
                </View>
              ) : selectedItem === 'Help Center' ? (
                <View style={styles.helpCenterContainer}>
                  {(!supportArticlesRes?.data || supportArticlesRes?.data?.length === 0) ? (
                    <View style={styles.defaultModalContainer}>
                      <Text style={styles.defaultModalText}>{t('noSupportArticles')}</Text>
                    </View>
                  ) : (
                    supportArticlesRes.data.map((categoryGroup: any, index: number) => (
                      <View key={index} style={styles.categoryContainer}>
                        <Text style={styles.categoryTitle}>{categoryGroup.category}</Text>
                        <View style={styles.articlesList}>
                          {categoryGroup.articles.map((article: string, idx: number) => (
                            <TouchableOpacity disabled
                              key={idx}
                              style={[
                                styles.articleItem,
                                idx === categoryGroup.articles.length - 1 && { borderBottomWidth: 0 }
                              ]}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.articleTitleText}>{article}</Text>
                              {/* <Text style={styles.chevron}>›</Text> */}
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    ))
                  )}
                </View>
              ) : ['Contact Us', 'Terms & Conditions', 'Privacy Policy', 'Community Guidelines'].includes(selectedItem || '') ? (
                <View style={styles.cmsContainer}>
                  <Text style={styles.cmsTitle}>{getCmsRes?.data?.title || getCmsRes?.data?.data?.title || (
                    selectedItem === 'Help Center' ? t('helpCenter') : 
                    selectedItem === 'Contact Us' ? t('contactUs') :
                    selectedItem === 'Report a Problem' ? t('reportProblem') :
                    selectedItem === 'Terms & Conditions' ? t('termsConditions') :
                    selectedItem === 'Privacy Policy' ? t('privacyPolicy') :
                    selectedItem === 'Community Guidelines' ? t('communityGuidelines') :
                    selectedItem
                  )}</Text>
                  {(getCmsRes?.data?.content || getCmsRes?.data?.data?.content || getCmsRes?.data?.description) ? (
                    <RenderHtml
                      contentWidth={width - ms(48)}
                      source={{ html: getCmsRes?.data?.content || getCmsRes?.data?.data?.content || getCmsRes?.data?.description }}
                      baseStyle={{
                        fontFamily: FONTS.regular24 || 'System',
                        fontSize: ms(15),
                        color: '#4B5563',
                        lineHeight: ms(24),
                      }}
                      tagsStyles={{
                        p: { marginVertical: ms(4) },
                        h1: { fontFamily: FONTS.bold28 || 'System', fontSize: ms(22), color: '#111827' },
                        h2: { fontFamily: FONTS.bold28 || 'System', fontSize: ms(20), color: '#111827' },
                        a: { color: '#6337EB', textDecorationLine: 'none' },
                        li: { marginBottom: ms(4) },
                      }}
                    />
                  ) : (
                    <Text style={styles.cmsContent}>{t('contentLoading')}</Text>
                  )}
                </View>
              ) : (
                <View style={styles.defaultModalContainer}>
                  <Text style={styles.defaultModalText}>
                    {t('informationAbout')}{
                      selectedItem === 'Help Center' ? t('helpCenter') : 
                      selectedItem === 'Contact Us' ? t('contactUs') :
                      selectedItem === 'Report a Problem' ? t('reportProblem') :
                      selectedItem === 'Terms & Conditions' ? t('termsConditions') :
                      selectedItem === 'Privacy Policy' ? t('privacyPolicy') :
                      selectedItem === 'Community Guidelines' ? t('communityGuidelines') :
                      selectedItem
                    }{t('willBeAvailableSoon')}
                  </Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default HelpSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: ms(24),
    paddingTop: ms(24),
    paddingBottom: ms(30),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: ms(56),
    paddingHorizontal: ms(16),
    borderBottomWidth: ms(1),
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  backIcon: {
    width: ms(18),
    height: ms(18),
    resizeMode: 'contain',
    tintColor: '#111827',
  },
  headerTitle: {
    fontFamily: FONTS.bold28 || 'System',
    fontSize: ms(18),
    color: '#111827',
    includeFontPadding: false,
  },
  headerRightPlaceholder: {
    width: ms(40),
  },
  listContainer: {
    gap: ms(20),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(6),
    backgroundColor: 'transparent',
  },
  optionText: {
    fontFamily: FONTS.medium24,
    fontSize: ms(16),
    color: '#374151',
    includeFontPadding: false,
  },
  chevron: {
    fontSize: ms(22),
    color: '#9CA3AF',
    fontFamily: FONTS.regular24,
    includeFontPadding: false,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    height: ms(56),
    borderBottomWidth: ms(1),
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: ms(8),
    width: ms(50),
  },
  closeButtonText: {
    fontFamily: FONTS.medium24 || 'System',
    fontSize: ms(16),
    color: '#6337EB',
  },
  modalHeaderTitle: {
    fontFamily: FONTS.bold28 || 'System',
    fontSize: ms(18),
    color: '#111827',
  },
  modalScrollContent: {
    flexGrow: 1,
    padding: ms(20),
  },
  reportProblemContainer: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: FONTS.medium24 || 'System',
    fontSize: ms(14),
    color: '#374151',
    marginBottom: ms(8),
    marginTop: ms(16),
  },
  textInput: {
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    fontSize: ms(15),
    fontFamily: FONTS.regular24 || 'System',
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: ms(120),
    paddingTop: ms(12),
  },
  submitButton: {
    marginTop: ms(32),
    backgroundColor: '#6337EB',
    paddingVertical: ms(16),
    borderRadius: ms(8),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: FONTS.bold28 || 'System',
    fontSize: ms(16),
  },
  defaultModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ms(40),
  },
  defaultModalText: {
    fontFamily: FONTS.regular24 || 'System',
    fontSize: ms(16),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: ms(24),
  },
  helpCenterContainer: {
    flex: 1,
    paddingTop: ms(8),
  },
  categoryContainer: {
    marginBottom: ms(24),
  },
  categoryTitle: {
    fontFamily: FONTS.bold28 || 'System',
    fontSize: ms(18),
    color: '#111827',
    marginBottom: ms(12),
    paddingHorizontal: ms(4),
  },
  articlesList: {
    backgroundColor: '#FAFAFA',
    borderRadius: ms(12),
    borderWidth: ms(1),
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(16),
    paddingHorizontal: ms(16),
    borderBottomWidth: ms(1),
    borderBottomColor: '#E5E7EB',
  },
  articleTitleText: {
    fontFamily: FONTS.medium24 || 'System',
    fontSize: ms(15),
    color: '#374151',
    flex: 1,
    marginRight: ms(12),
  },
  cmsContainer: {
    flex: 1,
    paddingTop: ms(8),
  },
  cmsTitle: {
    fontFamily: FONTS.bold28 || 'System',
    fontSize: ms(20),
    color: '#111827',
    marginBottom: ms(16),
  },
  cmsContent: {
    fontFamily: FONTS.regular24 || 'System',
    fontSize: ms(15),
    color: '#4B5563',
    lineHeight: ms(24),
  },
});
