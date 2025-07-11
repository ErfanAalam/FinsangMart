import { useUser } from '@/Contexts/UserContext';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { userDetails } = useUser();
  const router = useRouter();
  const name = userDetails?.name || 'User';
  const username = userDetails?.username || 'XYZ123'
  const initials = name.slice(0, 2).toUpperCase();
  const phone = '+91' + " " + (userDetails?.phone)?.slice(2) || '';

  const SHARE_MESSAGE = `Hey!

  Check out the Finsang app & start earning up to ₹1 Lakh every month 💸
  
  Sell financial products online from 50+ top brands like SBI, HDFC, ICICI, Axis & more and grow your income.
  
  Use my referral code: *${username}* 💼
  
  📲 Download now:
  https://finsang.in/`;

  const handleShare = async () => {
    try {
      const result = await Share.share({ message: SHARE_MESSAGE });
      if (result.action === Share.sharedAction) {
        console.log('Shared successfully!');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed.');
      }
    } catch (error) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }
      alert('Error sharing message: ' + message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color={Colors.black} />
      </TouchableOpacity>
      {/* Profile Banner */}
      <View style={styles.profileBanner}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitials}>{initials}</Text>
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profilePhone}>{phone}</Text>
      </View>

      {/* ZET Partner Code Section */}
      <View style={styles.partnerCodeSection}>
        <View>
          <Text style={styles.partnerCodeLabel}>My FinsangMart Code</Text>
          <Text style={styles.partnerCodeValue}>{username}</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={22} color={Colors.primary} />
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* ZET Partner Kit Section */}
      <View style={styles.partnerKitSection}>
        <TouchableOpacity style={styles.partnerKitCard} onPress={() => router.push('/VisitingCard')}>
          <Ionicons name="card-outline" size={24} color={Colors.primary} />
          <Text style={styles.partnerKitText}>Visiting Card</Text>
        </TouchableOpacity>
        <View style={[styles.partnerKitCard]}>
          <Ionicons name="id-card-outline" size={24} color={Colors.primary} />
          {/* <Ionicons name="information-circle-outline" size={16} color="#E53935" style={{ position: 'absolute', top: 6, right: 6 }} /> */}
          <Text style={styles.partnerKitText}>ID Card</Text>
        </View>
        <View style={styles.partnerKitCard}>
          <Ionicons name="document-outline" size={24} color={Colors.primary} />
          <Text style={styles.partnerKitText}>Offer Letter</Text>
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.menuList}>
        <MenuItem icon="person-outline" label="My Account" onPress={() => router.push('/MyAccount')} />
        <MenuItem icon="business-outline" label="Payment Account Details" onPress={() => router.push('/PaymentAccountDetails')} />
        <MenuItem icon="cash-outline" label="My Earnings" />
        {/* <MenuItem icon="globe-outline" label="My Website" />
        <MenuItem icon="people-outline" label="My Team" /> */}
        <MenuItem icon="share-social-outline" label="Refer & Earn" onPress={() => router.push('/refer-earn')} rightElement={<View style={styles.badge}><Text style={styles.badgeText}>₹1500 Extra</Text></View>} />
        <MenuItem icon="language-outline" label="App Language" onPress={() => router.push('/app-language')} />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => router.push('/help-support')} />
        <MenuItem icon="chatbubble-ellipses-outline" label="Feedback & Suggestions" onPress={() => router.push('/feedback-suggestions')} />
        <MenuItem icon="document-text-outline" label="Terms of Use" onPress={() => router.push('/terms-of-use')} />
        <MenuItem icon="document-outline" label="Privacy Policy." onPress={() => router.push('/privacy-policy')} />
        <MenuItem icon="document-outline" label="Licence Agreement" onPress={() => router.push('/licence-agreement')} />
      </View>

    </ScrollView>
  );
}
// MenuItem component
function MenuItem({ icon, label, onPress, rightElement }: { icon: any; label: string; onPress?: () => void; rightElement?: React.ReactNode }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={Colors.primary} style={styles.menuIcon} />
      <Text style={styles.menuLabel}>{label}</Text>
      {rightElement}
      <Ionicons name="chevron-forward" size={20} color={Colors.gray} style={styles.menuArrow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingTop: 60,
    minHeight: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 4,
  },
  profileBanner: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  profileCircle: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#E5DFCA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInitials: {
    color: '#6B5B2B',
    fontWeight: 'bold',
    fontSize: 24,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 16,
    color: Colors.gray,
  },
  partnerCodeSection: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  partnerCodeLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.black,
  },
  partnerCodeValue: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 2,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F8FF',
  },
  shareText: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  partnerKitSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  partnerKitCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#F7F7F7',
    position: 'relative',
  },
  partnerKitCardActive: {
    borderColor: '#E53935',
  },
  partnerKitText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
  },
  menuList: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  menuArrow: {
    marginLeft: 8,
  },
  badge: {
    backgroundColor: '#F2994A',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    minWidth: 60,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
}); 