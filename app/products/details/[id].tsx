import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Colors from '../../../constants/Colors';
import { supabase } from '../../../lib/supabase';



const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const [videoVisible, setVideoVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState('');
  const [videoStarted, setVideoStarted] = useState(false); // NEW STATE
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        setError('Product not found.');
        setProduct(null);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  const icons = [
    { label: 'Card Benefits', icon: 'card-giftcard', set: 'MaterialIcons' },
    { label: 'Application Process', icon: 'clipboard-list', set: 'FontAwesome5' },
    { label: 'Eligibility Criteria', icon: 'checkmark-done-circle', set: 'Ionicons' },
    { label: 'Training & Learning', icon: 'school', set: 'MaterialIcons' },
    { label: 'Marketing Resources', icon: 'video-library', set: 'MaterialIcons' },
    { label: 'Help & Support', icon: 'help-circle', set: 'Ionicons' },
  ];

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>
    );
  }
  if (error || !product) {
    return (
      <View style={styles.centered}><Text style={{ color: Colors.primary, fontSize: 18 }}>{error || 'Product not found.'}</Text></View>
    );
  }

  // Fallbacks for missing fields
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];
  const payout = Array.isArray(product.payout)
    ? product.payout
    : [
        { level: 'Beginner', basic: 1700, bonus: 0, coins: 500 },
        { level: 'Pro', basic: 1700, bonus: 0, coins: 750 },
        { level: 'Expert', basic: 1700, bonus: 100, coins: 1000 },
        { level: 'Genius', basic: 1700, bonus: 200, coins: 2000 },
      ];
  const terms = product.terms || [
    'Bank runs certain internal policy criteria to select a customer for issuing credit cards',
    'Customer has to use IndusInd Bank credit card using your ZET link',
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {/* Top Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {/* Video Section */}
        <View style={styles.videoContainer}>
          {videoStarted ? (
            <WebView
              source={{ uri: 'https://youtu.be/e_oQe-F1ixQ?si=pLRdxXeAh0vIDbm9' }}
              style={{ width: '100%', height: 180, borderRadius: 0 }}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
            />
          ) : (
            <TouchableOpacity onPress={() => setVideoStarted(true)} style={styles.videoBg} activeOpacity={0.8}>
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶️</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Bank Name and Card Title */}
        <Text style={styles.bankName}>{product.bank_name}</Text>
        <Text style={styles.cardTitle}>{product.card_name}</Text>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          {benefits.map((b: string, i: number) => (
            <View key={i} style={styles.benefitBox}>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Payout Table - replaced with new Profit Card UI */}
        <View style={styles.profitCard}>
          <Text style={styles.payoutTitle}>Profit on Successful Sale</Text>
          {/* Info Box */}
          <View style={styles.infoBox}>
            <Entypo name="medal" size={20} color="#FFD700" style={{ marginRight: 6 }} />
            <Text style={{ color: '#1A237E', fontWeight: 'bold' }}>You are a <Text style={{ textDecorationLine: 'underline' }}>Beginner</Text>.</Text>
            <Text style={{ color: '#1A237E', marginLeft: 4 }}> Complete 2 sales in 9 days to become Pro.</Text>
            {/* <Text style={styles.knowMore}>Know More</Text> */}
          </View>
          {/* Table */}
          <View style={styles.payoutTableHeader}>
            <Text style={[styles.payoutHeaderCell, { flex: 1.5 }]}></Text>
            <Text style={styles.payoutHeaderCell}>Basic</Text>
            <Text style={styles.payoutHeaderCell}>Bonus</Text>
            <Text style={styles.payoutHeaderCell}>Finsang Coins</Text>
          </View>
          {payout.map((row: any, idx: number) => (
            <View
              key={row.level}
              style={[
                styles.payoutTableRow,
                idx === 0 && styles.payoutTableRowActive,
              ]}
            >
              <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                {idx === 0 ? (
                  <Ionicons name="checkmark-circle" size={18} color="#388E3C" style={{ marginRight: 6 }} />
                ) : (
                  <FontAwesome5 name="lock" size={14} color="#888" style={{ marginRight: 6 }} />
                )}
                <Text style={[styles.payoutCell, idx === 0 && styles.payoutCellActive]}>{row.level}</Text>
              </View>
              <Text style={styles.payoutCell}>₹{row.basic}</Text>
              <Text style={styles.payoutCell}>{row.bonus ? `₹${row.bonus}` : '-'}</Text>
              <Text style={styles.payoutCell}>{row.coins} <Text style={{ color: '#FFD700' }}>🪙</Text></Text>
            </View>
          ))}
          {/* View Terms Link */}
          <TouchableOpacity onPress={() => router.push({ pathname: '/products/details/[id]/terms', params: { id } })}>
            <Text style={styles.viewTerms}>View Terms</Text>
          </TouchableOpacity>
        </View>

        {/* Icons Section */}
        <View style={styles.iconsRow}>
          {icons.map((icon, i) => (
            <View key={icon.label} style={styles.iconBox}>
              <View style={styles.iconCircle}>
                {icon.set === 'MaterialIcons' && (
                  <MaterialIcons name={icon.icon as any} size={24} color={Colors.primary} />
                )}
                {icon.set === 'FontAwesome5' && (
                  <FontAwesome5 name={icon.icon as any} size={20} color={Colors.primary} />
                )}
                {icon.set === 'Ionicons' && (
                  <Ionicons name={icon.icon as any} size={24} color={Colors.primary} />
                )}
              </View>
              <Text style={styles.iconLabel}>{icon.label}</Text>
            </View>
          ))}
        </View>

        {/* Horizontal Terms */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalTerms}>
          {terms.map((t: string, i: number) => (
            <View key={i} style={styles.termCard}>
              <Text style={styles.termCardText}>{t}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.sellNowButton}>
          <Text style={styles.sellNowText}>Sell Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: Colors.primary,
    zIndex: 20,
    paddingTop:40
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  videoContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#e3e3e3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  videoBg: {
    width: width,
    height: 180,
    backgroundColor: '#b71c1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#f44336',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  playIcon: {
    fontSize: 36,
    color: '#f44336',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: width * 0.8,
  },
  closeModalBtn: {
    marginTop: 24,
    alignSelf: 'center',
    padding: 10,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 18,
    marginLeft: 18,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
    marginLeft: 18,
    marginBottom: 12,
  },
  benefitsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 18,
    marginBottom: 18,
  },
  benefitBox: {
    backgroundColor: '#f4f7fb',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  benefitText: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '600',
  },
  payoutTableWrapper: {
    marginHorizontal: 18,
    marginBottom: 18,
    backgroundColor: '#f7f8fa',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  payoutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: Colors.primary,
  },
  payoutTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 6,
    marginBottom: 4,
  },
  payoutHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    color: Colors.gray,
    fontSize: 14,
    textAlign: 'center',
  },
  payoutTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  payoutTableRowActive: {
    backgroundColor: '#e3f2fd',
  },
  payoutCell: {
    flex: 1,
    textAlign: 'center',
    color: Colors.black,
    fontSize: 15,
  },
  payoutCellActive: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  termsButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginVertical: 12,
  },
  termsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  termsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    maxHeight: 400,
    alignItems: 'flex-start',
  },
  termBullet: {
    fontSize: 15,
    color: Colors.black,
    marginBottom: 10,
  },
  iconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: 18,
    marginTop: 8,
  },
  iconBox: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f4f7fb',
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: 13,
    color: Colors.black,
    textAlign: 'center',
  },
  horizontalTerms: {
    marginTop: 8,
    marginBottom: 24,
    marginLeft: 8,
  },
  termCard: {
    backgroundColor: '#f4f7fb',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginRight: 12,
    minWidth: 220,
    maxWidth: 260,
    justifyContent: 'center',
  },
  termCardText: {
    color: Colors.black,
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  sellNowButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  sellNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  profitCard: {
    marginHorizontal: 18,
    marginBottom: 18,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  knowMore: {
    color: '#1976D2',
    fontWeight: 'bold',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
  viewTerms: {
    color: '#1976D2',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
}); 