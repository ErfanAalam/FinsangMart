import { useLocalSearchParams, useRouter } from 'expo-router';
import { Mail, Phone } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Dimensions, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Colors from '../constants/Colors';
import { supabase } from '../lib/supabase';

const CARD_WIDTH = Math.min(Dimensions.get('window').width - 32, 380);
const CARD_HEIGHT = CARD_WIDTH * 0.6;

export default function Usercard() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const mobile = '+' + phone.toString().slice(0, 2) + ' ' + phone.toString().slice(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pincode, setPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; pincode?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string; pincode?: string } = {};
    if (!name.trim()) newErrors.name = 'Field is required!';
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) newErrors.email = 'Field is required!';
    if (!pincode.trim() || pincode.length !== 6) newErrors.pincode = 'Field is required!';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const username = name.split(" ")[0] + String(phone).slice(5)
      if (!userId) throw new Error('User not authenticated');
      const { error } = await supabase.from('users').insert({ id: userId, phone, name, email, pincode,username });
      if (error) throw error;
      Alert.alert('Profile Created', 'Welcome!');
      router.replace('/ProfessionalDetails');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not create profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 170 }}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          {/* Card Template Preview */}
          <ImageBackground
            source={require('../assets/images/CardTemplate.png')}
            style={styles.cardTemplate}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            <Text style={styles.cardName}>{name || 'Your Name'}</Text>
            <Text style={styles.cardRole}>Financial Advisor</Text>
            <View style={styles.cardRow}>
              <Phone color="#fff" size={16} style={{ marginRight: 4 }} />
              <Text style={styles.cardPhone}>{mobile || '+91 XXXXXXXXXX'}</Text>
            </View>
            <View style={styles.cardRow}>
              <Mail color="#fff" size={16} style={{ marginRight: 4 }} />
              <Text style={styles.cardEmail}>{email || 'Your Email ID'}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>CREDIT CARD  •  PERSONAL LOAN  •  PAY LATER</Text>
            </View>
          </ImageBackground>
          {/* Form */}
          <KeyboardAvoidingView
            style={{ width: '100%' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
          >
            <View style={styles.form}>
              <Text style={styles.label}>Your Name*</Text>
              <TextInput
                style={styles.input}
                placeholder="Eg: Aman Singh"
                value={name}
                onChangeText={text => { setName(text); if (errors.name) setErrors(e => ({ ...e, name: undefined })); }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              <Text style={styles.label}>Your Email ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Eg: name@email.com"
                value={email}
                onChangeText={text => { setEmail(text); if (errors.email) setErrors(e => ({ ...e, email: undefined })); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              <Text style={styles.label}>Current PIN Code*</Text>
              <TextInput
                style={styles.input}
                placeholder="Eg: 560035"
                value={pincode}
                onChangeText={text => { setPincode(text.replace(/[^0-9]/g, '')); if (errors.pincode) setErrors(e => ({ ...e, pincode: undefined })); }}
                keyboardType="number-pad"
                maxLength={6}
              />
              {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>{isLoading ? 'Submitting...' : 'Continue'}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  cardTemplate: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    marginTop: 32,
    marginBottom: 32,
    padding: 24,
    justifyContent: 'flex-end',
  },
  cardName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    position: 'absolute',
    top: 32,
    left: 28,
  },
  cardRole: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    position: 'absolute',
    top: 62,
    left: 28,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginTop: 6,
    marginLeft: 6,
  },
  cardPhone: {
    color: '#fff',
    fontSize: 15,
    marginRight: 8,
  },
  cardEmail: {
    color: '#fff',
    fontSize: 15,
  }, 
  cardFooter: {
    marginTop: 18,
    paddingTop: 8,
  },
  cardFooterText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 14,
    color: '#1e293b',
  },
  errorText: {
    color: '#e11d48',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 2,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
}); 