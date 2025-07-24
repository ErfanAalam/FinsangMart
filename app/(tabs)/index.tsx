import Colors from '@/constants/Colors';
import { useUser } from '@/Contexts/UserContext';
import { AntDesign, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced realistic images for slider
const images = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60'
];

// Realistic credit card data
type CreditCard = {
  id: string;
  bank_name: string;
  card_name: string;
  payout_str: string;
  features: string[];
  color: string;
};

const mockCreditCards: CreditCard[] = [
  {
    id: 'mock1',
    bank_name: 'HDFC Bank',
    card_name: 'Regalia Gold Credit Card',
    payout_str: '15,000',
    features: ['4X Reward Points', 'Airport Lounge Access'],
    color: '#FF6B6B'
  },
  {
    id: 'mock2',
    bank_name: 'ICICI Bank',
    card_name: 'Amazon Pay Credit Card',
    payout_str: '12,500',
    features: ['5% Cashback on Amazon', '2% on Other Sites'],
    color: '#4ECDC4'
  },
  {
    id: 'mock3',
    bank_name: 'SBI',
    card_name: 'SimplyCLICK Credit Card',
    payout_str: '10,800',
    features: ['10X Rewards Online', 'Fuel Surcharge Waiver'],
    color: '#45B7D1'
  },
  {
    id: 'mock4',
    bank_name: 'Axis Bank',
    card_name: 'Flipkart Credit Card',
    payout_str: '18,000',
    features: ['Unlimited 1.5% Cashback', 'No Annual Fee'],
    color: '#96CEB4'
  }
];

// Success stories with realistic data
const successStories = [
  {
    name: 'MUKESH MEHTA',
    location: 'Jaipur, Rajasthan',
    earnings: '₹85,000',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60'
  },
  {
    name: 'PRIYA SHARMA',
    location: 'Mumbai, Maharashtra',
    earnings: '₹1,20,000',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=60'
  },
  {
    name: 'RAHUL JAIN',
    location: 'Delhi NCR',
    earnings: '₹95,000',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60'
  }
];

export default function HomeScreen() {
  const { userDetails } = useUser();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(mockCreditCards);
  const [currentTime, setCurrentTime] = useState('');

  const username = userDetails?.name || 'Partner';
  const initials = username.slice(0, 2).toUpperCase();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => {
        const nextIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
        scrollViewRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('bank_name,card_name,payout_str,id')
          .eq('type', 'Credit Cards')
          .limit(3);

        if (!error && data && data.length > 0) {
          setCreditCards(data.map((card, idx) => ({
            id: card.id,
            bank_name: card.bank_name,
            card_name: card.card_name,
            payout_str: card.payout_str,
            features: ['Instant Approval', 'High Commission'],
            color: mockCreditCards[idx % mockCreditCards.length]?.color || '#4ECDC4',
          })));
        }
      } catch (error) {
        console.log('Using mock data');
      }
    };

    fetchCreditCards();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header with Gradient */}
      <View style={styles.headerGradient}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.profileSection} activeOpacity={0.7} onPress={() => router.push('/profile')}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitials}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.greetingText}>{getGreeting()}</Text>
              <Text style={styles.usernameText}>{username}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.iconSection}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/help-support')}>
              <View style={styles.iconWrapper}>
                <MaterialIcons name="help-outline" size={24} color={Colors.primary} />
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => {}}>
              <View style={styles.iconWrapper}>
                <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
                <View style={styles.notificationDot} />
              </View>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Enhanced Stats Card
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>₹45,280</Text>
                        <Text style={styles.statLabel}>This Month</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>127</Text>
                        <Text style={styles.statLabel}>Customers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>4.8⭐</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View> */}

        {/* Enhanced Image Slider */}
        <View style={styles.sliderContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={event => {
              const slide = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              if (slide !== activeIndex) {
                setActiveIndex(slide);
              }
            }}
            style={styles.scrollView}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.sliderImageContainer}>
                <Image source={{ uri: image }} style={styles.sliderImage} resizeMode="cover" />
                <View style={styles.sliderOverlay}>
                  <Text style={styles.sliderTitle}>
                    {index === 0 ? 'Start Your Financial Journey' :
                      index === 1 ? 'Earn More with Credit Cards' :
                        'Build Your Credit Score'}
                  </Text>
                  <Text style={styles.sliderSubtitle}>
                    {index === 0 ? 'Join thousands of partners earning daily' :
                      index === 1 ? 'Get up to ₹25,000 per approved card' :
                        'Help customers improve their financial health'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeIndex ? styles.paginationDotActive : null
                ]}
              />
            ))}
          </View>
        </View>

        {/* Enhanced Sell Card with Animation */}
        <View style={styles.sellCard}>
          <View style={styles.sellCardContent}>
            <View style={styles.sellIconContainer}>
              <FontAwesome5 name="credit-card" size={28} color={Colors.primary} />
            </View>
            <View style={styles.sellTextContainer}>
              <Text style={styles.sellTitle}>Check your credit score</Text>
              <Text style={styles.sellSubtitle}>Stay on top of your financial health</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.sellArrow, { backgroundColor: Colors.primary }]}
            onPress={() => router.push({ pathname: '/check-credit-score' })}
            // TODO: Implement navigation to check credit score screen when available
            activeOpacity={0.8}
          >
            <AntDesign name="arrowright" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Enhanced Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/Usercard')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFE5E5' }]}>
                <FontAwesome name="id-card-o" size={28} color="#FF6B6B" />
              </View>
              <Text style={styles.quickActionText}>ID Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/VisitingCard')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E5F7FF' }]}>
                <FontAwesome name="vcard-o" size={28} color="#45B7D1" />
              </View>
              <Text style={styles.quickActionText}>Business Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/training')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E8F5E8' }]}>
                <Ionicons name="play-circle" size={28} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Training</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/leads')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialIcons name="analytics" size={28} color="#FF9800" />
              </View>
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Credit Cards Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Earning Credit Cards</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
            {creditCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.creditCard, { backgroundColor: Colors.primary }]}
                onPress={() => {
                  if (card.id) {
                    router.push({ pathname: '/products/details/[id]', params: { id: card.id } });
                  } else {
                    // fallback for mock data (no id)
                    // Optionally show a message or do nothing
                  }
                }}
                activeOpacity={0.85}
              >
                <View style={styles.creditCardHeader}>
                  <Text style={styles.earnAmount}>Earn up to ₹{card.payout_str}</Text>
                  <FontAwesome name="credit-card" size={24} color="white" />
                </View>
                <Text style={styles.cardName}>{card.card_name}</Text>
                <Text style={styles.bankName}>{card.bank_name}</Text>
                <View style={styles.cardFeatures}>
                  {(card.features || ['Instant Approval', 'High Commission']).map((feature, idx) => (
                    <Text key={idx} style={styles.featureText}>• {feature}</Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Popular Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Financial Products</Text>
          <View style={styles.popularProductsGrid}>
            {[
              { title: 'Credit Cards', icon: 'account-balance-wallet', color: '#FF6B6B' },
              { title: 'Bank Accounts', icon: 'security', color: '#4ECDC4' },
              { title: 'Personal loans', icon: 'trending-up', color: '#45B7D1' },
              { title: 'Home loans', icon: 'savings', color: '#96CEB4' },
              { title: 'Insurance', icon: 'local-hospital', color: '#FFBE0B' },
              { title: 'Business loans', icon: 'directions-car', color: '#FB8500' }
            ].map((product, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.popularProductCard, { borderLeftColor: product.color }]}
                onPress={() => router.push(`/products/category/${encodeURIComponent(product.title)}`)}
                activeOpacity={0.85}
              >
                <MaterialIcons name={product.icon as any} size={32} color={product.color} />
                <Text style={styles.popularProductText}>{product.title}</Text>
                <AntDesign name="arrowright" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced Success Stories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partner Success Stories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
            {successStories.map((story, index) => (
              <View key={index} style={styles.successStoryCard}>
                <Image source={{ uri: story.image }} style={styles.successStoryImage} />
                <View style={styles.successStoryContent}>
                  <Text style={styles.successStoryName}>{story.name}</Text>
                  <Text style={styles.successStoryLocation}>{story.location}</Text>
                  <View style={styles.earningsContainer}>
                    <Text style={styles.earningsLabel}>Monthly Earnings</Text>
                    <Text style={styles.earningsAmount}>{story.earnings}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Learning Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Master Your Sales Skills</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
            {[
              {
                title: 'Getting Started Guide',
                subtitle: 'Learn the basics of financial selling',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=60',
                duration: '5 min read'
              },
              {
                title: 'Customer Psychology',
                subtitle: 'Understand what customers really want',
                image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&auto=format&fit=crop&q=60',
                duration: '8 min read'
              }
            ].map((course, index) => (
              <TouchableOpacity key={index} style={styles.learningCard}>
                <Image source={{ uri: course.image }} style={styles.learningImage} />
                <View style={styles.learningContent}>
                  <Text style={styles.learningTitle}>{course.title}</Text>
                  <Text style={styles.learningSubtitle}>{course.subtitle}</Text>
                  <View style={styles.learningMeta}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.learningDuration}>{course.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Community Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join Our Community</Text>
          <View style={styles.communityCard}>
            <Text style={styles.communityTitle}>Connect with 50,000+ Partners</Text>
            <Text style={styles.communitySubtitle}>Share tips, get support, and grow together</Text>
            <View style={styles.socialIconsContainer}>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#25D366' }]}>
                <FontAwesome name="whatsapp" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#0088cc' }]}>
                <FontAwesome name="telegram" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#FF0000' }]}>
                <FontAwesome name="youtube-play" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#0A66C2' }]}>
                <FontAwesome name="linkedin-square" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInitials: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  iconSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  mainContent: {
    padding: 20,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  sliderContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scrollView: {
    width: screenWidth - 40,
    height: 200,
  },
  sliderImageContainer: {
    width: screenWidth - 40,
    height: 200,
    position: 'relative',
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  sliderOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  sliderTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sliderSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.white,
    width: 20,
  },
  sellCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  sellCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  sellTextContainer: {
    flex: 1,
  },
  sellTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  sellSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sellArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  viewAllText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  creditCard: {
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  creditCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  earnAmount: {
    fontWeight: 'bold',
    color: Colors.white,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
  },
  cardName: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 4,
  },
  bankName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 10,
  },
  cardFeatures: {
    marginTop: 5,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  popularProductsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularProductCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  popularProductText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  successStoryCard: {
    width: 260,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  successStoryImage: {
    width: '100%',
    height: 140,
  },
  successStoryContent: {
    padding: 15,
  },
  successStoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  successStoryLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  earningsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 2,
  },
  learningCard: {
    width: 280,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  learningImage: {
    width: '100%',
    height: 120,
  },
  learningContent: {
    padding: 15,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  learningSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  learningMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learningDuration: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  communityCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  communitySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});