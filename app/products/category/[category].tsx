import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../constants/Colors';
import { supabase } from '../../../lib/supabase';

const CARD_IMAGE = require('../../../assets/images/CardTemplate.png');

export default function ProductListByCategory() {
  const { category } = useLocalSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterValues, setFilterValues] = useState<any>({});
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Gradient colors that repeat every 4 cards
  const gradientColors = [
    ['#e3f2fd', '#90caf9'], // Light blue gradient
    ['#fff3e0', '#ffcc80'], // Light orange gradient
    ['#e8f5e8', '#c8e6c9'], // Light green gradient
  ];

  const getGradientForIndex = (index: number) => {
    return gradientColors[index % gradientColors.length];
  };

  // Filter categories and mapping to product fields
  const filterCategories = [
    { key: 'bank_name', label: 'Banks' },
    { key: 'benefits', label: 'Benefits' },
    { key: 'joining_fees', label: 'Card Fees' },
    { key: 'employment_type', label: 'Employment Type' },
    { key: 'income_range', label: 'Income Range' },
  ];
  const [selectedCategory, setSelectedCategory] = useState(filterCategories[0].key);
  // Multi-select filter values
  const [multiFilterValues, setMultiFilterValues] = useState<any>({});
  // Extract unique options for each filter category
  const filterOptions: any = {};
  filterCategories.forEach(cat => {
    if (cat.key === 'benefits') {
      // Flatten all benefits arrays
      const allBenefits = products.flatMap(p => Array.isArray(p.benefits) ? p.benefits : []);
      filterOptions[cat.key] = Array.from(new Set(allBenefits)).filter(Boolean);
    } else if (cat.key === 'employment_type') {
      // Collect all unique employment types from eligibility
      const allTypes = products.flatMap(p => p.eligibility ? Object.keys(p.eligibility) : []);
      filterOptions[cat.key] = Array.from(new Set(allTypes)).filter(Boolean);
    } else if (cat.key === 'income_range') {
      // Collect all unique income values from all employment types in eligibility
      const allIncomes = products.flatMap(p =>
        p.eligibility ? Object.values(p.eligibility).map((e: any) => e.income) : []
      );
      filterOptions[cat.key] = Array.from(new Set(allIncomes)).filter(Boolean);
    } else {
      filterOptions[cat.key] = Array.from(new Set(products.map(p => p[cat.key]).flat())).filter(Boolean);
    }
  });

  // Filtering logic for multi-select
  useEffect(() => {
    let filtered = products;
    Object.entries(multiFilterValues).forEach(([key, values]) => {
      if (Array.isArray(values) && values.length > 0) {
        if (key === 'benefits') {
          filtered = filtered.filter(p => Array.isArray(p.benefits) && values.some(v => p.benefits.includes(v)));
        } else if (key === 'employment_type') {
          filtered = filtered.filter(p =>
            p.eligibility && values.some((v: string) => Object.keys(p.eligibility).includes(v))
          );
        } else if (key === 'income_range') {
          filtered = filtered.filter(p =>
            p.eligibility && Object.values(p.eligibility).some((e: any) => values.includes(e.income))
          );
        } else {
          filtered = filtered.filter(p => values.includes(p[key]));
        }
      }
    });
    setFilteredProducts(filtered);
  }, [products, multiFilterValues]);

  // Checkbox toggle handler
  const toggleFilterValue = (catKey: string, value: string) => {
    setMultiFilterValues((prev: any) => {
      const prevArr = prev[catKey] || [];
      if (prevArr.includes(value)) {
        return { ...prev, [catKey]: prevArr.filter((v: string) => v !== value) };
      } else {
        return { ...prev, [catKey]: [...prevArr, value] };
      }
    });
  };

  // Clear all filters
  const clearAllFilters = () => setMultiFilterValues({});

  // Update filteredProducts when products or filterValues change
  useEffect(() => {
    let filtered = products;
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter((p) =>
          (p[key] !== undefined && p[key] !== null && String(p[key]).toLowerCase().includes(String(value).toLowerCase()))
        );
      }
    });
    setFilteredProducts(filtered);
  }, [products, filterValues]);

  // Get all filterable fields from the first product
  const filterFields = products[0] ? Object.keys(products[0]).filter(k => typeof products[0][k] === 'string' || typeof products[0][k] === 'number') : [];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('type', category);
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };
    if (category) fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <View style={styles.backIconCircle}>
            <Text style={styles.backIcon}>{'←'}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
      </View>
      {/* Sort and Filter Row */}
      <View style={styles.sortFilterRow}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => {
          setSortAsc((asc) => {
            setProducts(prev => [...prev].sort((a, b) => {
              const cmp = (a.card_name || '').localeCompare(b.card_name || '');
              return asc ? cmp : -cmp;
            }));
            return !asc;
          });
        }}>
          <Text style={styles.headerBtnText}>Sort by {sortAsc ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerBtn} onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.headerBtnText}>Filters</Text>
        </TouchableOpacity>
      </View>
      {/* Filter Modal Triggered by Filters Button */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setFilterModalVisible(false)} />
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%',
          backgroundColor: Colors.white,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          flexDirection: 'row',
          overflow: 'hidden',
        }}>
          {/* Left: Tabs */}
          <View style={{ width: 120, backgroundColor: '#f7f8fa', borderTopLeftRadius: 18, paddingTop: 24 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: Colors.primary, marginLeft: 16, marginBottom: 24 }}>Filters</Text>
            {filterCategories.map(cat => (
              <TouchableOpacity
                key={cat.key}
                style={{ paddingVertical: 14, paddingHorizontal: 12, backgroundColor: selectedCategory === cat.key ? '#fff' : 'transparent', borderLeftWidth: selectedCategory === cat.key ? 4 : 0, borderLeftColor: Colors.primary }}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Text style={{ color: selectedCategory === cat.key ? Colors.primary : Colors.gray, fontWeight: selectedCategory === cat.key ? 'bold' : '600', fontSize: 15 }}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Right: Options */}
          <View style={{ flex: 1, padding: 18, paddingTop: 24 }}>
            {/* Cross button at top right */}
            <TouchableOpacity
              style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={{ fontSize: 22, color: Colors.gray, fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 16 }}>
              {filterOptions[selectedCategory] && filterOptions[selectedCategory].length > 0 ? (
                filterOptions[selectedCategory].map((option: string) => (
                  <TouchableOpacity
                    key={option}
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f7fb', borderRadius: 10, padding: 14, marginBottom: 12 }}
                    onPress={() => toggleFilterValue(selectedCategory, option)}
                    activeOpacity={0.7}
                  >
                    <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: multiFilterValues[selectedCategory]?.includes(option) ? Colors.primary : '#bbb', backgroundColor: multiFilterValues[selectedCategory]?.includes(option) ? Colors.primary : '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                      {multiFilterValues[selectedCategory]?.includes(option) && (
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>✓</Text>
                      )}
                    </View>
                    <Text style={{ fontSize: 16, color: Colors.black }}>{option}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ color: Colors.gray, fontSize: 15, textAlign: 'center', marginTop: 32 }}>No options available</Text>
              )}
            </ScrollView>
          </View>
          {/* Bottom Buttons (outside sidebar, full width at bottom) */}
          <View style={{ position: 'absolute', left: 120, right: 0, bottom: 0, backgroundColor: Colors.white, padding: 18, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee' }}>
            <TouchableOpacity
              style={{ backgroundColor: '#f6f6f6', borderRadius: 10, paddingVertical: 16, paddingHorizontal: 24, flex: 1, marginRight: 10, borderWidth: 1, borderColor: '#eee' }}
              onPress={clearAllFilters}
            >
              <Text style={{ color: Colors.primary, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 16, paddingHorizontal: 24, flex: 1, marginLeft: 10 }}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Rest of the page */}
      <Text style={styles.subtitle}>Total {filteredProducts.length} Offers Available</Text>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filteredProducts.map((product, index) => {
          const [startColor, endColor] = getGradientForIndex(index);
          return (
            <View key={product.id} style={styles.card}>
              <LinearGradient colors={[startColor, endColor]} style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <View style={{ flex: 1 }}>
                  {/* Bank Name (only for Credit Cards) */}
                  {category === 'Credit Cards' && product.bank_name && (
                    <Text style={styles.bankName}>{product.bank_name}</Text>
                  )}
                  {/* Card Name */}
                  <Text style={styles.cardName}>{product.card_name}</Text>
                </View>
                <Image source={CARD_IMAGE} style={styles.cardImage} />
              </View>
              
              {/* Fees Row (only for Credit Cards) */}
              {category === 'Credit Cards' && (
                <View style={styles.feeRow}>
                  <View style={styles.feeBox}>
                    <Text style={styles.feeLabel}>Joining Fee</Text>
                    <Text style={styles.feeValue}>{product.joining_fees || 'Zero'}</Text>
                  </View>
                  <View style={styles.feeBox}>
                    <Text style={styles.feeLabel}>Renewal Fee</Text>
                    <Text style={styles.feeValue}>{product.renewal_fees || 'Zero'}</Text>
                  </View>
                </View>
              )}
              
              {/* Benefits */}
              <View style={styles.benefitsSection}>
                {Array.isArray(product.benefits) && product.benefits.slice(0,2).map((benefit: string, idx: number) => (
                  <View key={idx} style={styles.benefitRow}>
                    <View style={styles.benefitIconCircle}>
                      <Text style={styles.benefitIcon}>{idx === 0 ? '🎟️' : '⭐'}</Text>
                    </View>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
              
              {/* Details Link */}
              <TouchableOpacity style={styles.detailsLinkRow} activeOpacity={0.7} onPress={() => router.push({ pathname: '/products/details/[id]', params: { id: product.id } })}>
                <Text style={styles.detailsLink}>View all Details and Benefits</Text>
                <Text style={styles.detailsArrow}>{'›'}</Text>
              </TouchableOpacity>
              
              {/* Payout and Sell Button Row */}
              <View style={styles.payoutRow}>
                <View style={{display:'flex'}}>
                  <Text style={styles.payoutLabel}>Payout</Text>
                  <Text style={styles.payoutValue}>Upto ₹ {product.payout_str || 'Upto ₹1900'}</Text>
                </View>
                <TouchableOpacity style={styles.sellBtn} activeOpacity={0.85}>
                  <Text style={styles.sellBtnText}>Sell Now</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        );
      })}
        {filteredProducts.length === 0 && (
          <Text style={{ textAlign: 'center', color: Colors.gray, marginTop: 32, fontSize: 16 }}>No products found in this category.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 16,
  },
  backIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  backIcon: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 42,
    backgroundColor: Colors.primary,
    borderBottomWidth: 0,
    // No border for colored header
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 0.2,
    marginLeft: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerBtn: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth:1,
    borderColor:'black'
  },
  headerBtnText: {
    color: 'balck',
    fontWeight: '600',
    fontSize: 14,
  },
  sortFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 2,
    color: Colors.black,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.gray,
    marginLeft: 16,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
    borderWidth:1,
    borderColor:'#afafaf'
  },
  cardContent: {
    padding: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  cardName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
    letterSpacing: 0.1,
  },
  cardImage: {
    width: 90,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 12,
    borderRadius: 8,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  feeBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  feeLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.black,
  },
  benefitsSection: {
    marginBottom: 18,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  benefitIcon: {
    fontSize: 16,
  },
  benefitText: {
    fontSize: 15,
    color: Colors.black,
    flex: 1,
    lineHeight: 22,
  },
  detailsLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  detailsLink: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
    marginRight: 4,
  },
  detailsArrow: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  payoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payoutLabel: {
    fontSize: 15,
    color: Colors.gray,
    marginBottom: 4,
  },
  payoutValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  sellBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sellBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});