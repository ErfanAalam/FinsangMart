import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { supabase } from '../../lib/supabase';

const DEFAULT_ICON = 'tags'; // fallback icon
const CARD_IMAGE = require('../../assets/images/CardTemplate.png');
const { width: screenWidth } = Dimensions.get('window');

// Helper for colorful icons
const categoryIconMap: Record<string, { name: string; color: string }> = {
  credit: { name: 'credit-card', color: '#4F8EF7' },
  loan: { name: 'cash-multiple', color: '#43A047' },
  bank: { name: 'bank', color: '#1976D2' },
  account: { name: 'account-cash', color: '#00897B' },
  insurance: { name: 'shield-check', color: '#FBC02D' },
  mutual: { name: 'chart-line', color: '#8E24AA' },
  sip: { name: 'chart-pie', color: '#F06292' },
  gold: { name: 'gold', color: '#FFD600' },
  card: { name: 'card-account-details', color: '#00ACC1' },
  investment: { name: 'chart-bar', color: '#3949AB' },
  property: { name: 'home-city', color: '#6D4C41' },
  home: { name: 'home', color: '#6D4C41' },
  vehicle: { name: 'car', color: '#FF7043' },
  auto: { name: 'car', color: '#FF7043' },
  health: { name: 'heart-pulse', color: '#E53935' },
  travel: { name: 'airplane', color: '#039BE5' },
  education: { name: 'school', color: '#3949AB' },
};

function getColorfulCategoryIcon(category: string) {
  const lower = category.toLowerCase();
  for (const key in categoryIconMap) {
    if (lower.includes(key)) {
      return categoryIconMap[key];
    }
  }
  return { name: 'shape', color: '#4B5563' };
}

export default function Products() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryPayouts, setCategoryPayouts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('type, payout_str');
      if (!error && data) {
        // Map to store max payout for each category
        const categoryPayoutMap: Record<string, number> = {};
        data.forEach((item: any) => {
          const category = item.type;
          // Parse payout_str to number (remove non-numeric except dot)
          const payout = parseFloat((item.payout_str || '').replace(/[^\d.]/g, '')) || 0;
          if (!categoryPayoutMap[category] || payout > categoryPayoutMap[category]) {
            categoryPayoutMap[category] = payout;
          }
        });
        setCategories(Object.keys(categoryPayoutMap));
        setCategoryPayouts(categoryPayoutMap);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Carousel data (for demo, use same card multiple times)
  const carouselData = [1, 2, 3];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Carousel Section */}
      <View style={{ marginBottom: 24 }}>
        <Carousel
          width={screenWidth - 32}
          height={160}
          autoPlay
          autoPlayInterval={3000}
          data={carouselData}
          scrollAnimationDuration={800}
          renderItem={({ index }) => (
            <View style={styles.carouselCard}>
              <Image
                source={CARD_IMAGE}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            </View>
          )}
          style={{ alignSelf: 'center' }}
          loop
        />
      </View>
      <Text style={styles.subtitle}>Select from categories to sell</Text>
      <View style={styles.grid}>
        {categories.map((cat) => {
          const icon = getColorfulCategoryIcon(cat);
          return (
            <TouchableOpacity
              key={cat}
              style={styles.card}
              onPress={() => router.push(`/products/category/${encodeURIComponent(cat)}`)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={icon.name as any}
                size={40}
                color={icon.color}
                style={styles.icon}
              />
              <Text style={styles.cardTitle}>{cat}</Text>
              <Text style={styles.earnText}>
                Earn upto ₹{categoryPayouts[cat] || 0}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    minHeight: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth:2,
    borderColor:'#f2f2f2'
  },
  icon: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    color: '#1f2937',
  },
  earnText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  carouselCard: {
    width: screenWidth - 32,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
});