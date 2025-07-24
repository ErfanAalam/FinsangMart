import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import { useRouter } from 'expo-router';

export default function CheckCreditScoreScreen() {
  const [pan, setPan] = useState('');
  const [dob, setDob] = useState('');
  const [consent, setConsent] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string>('');

  const router = useRouter();

  const handleCheckScore = () => {
    if (!pan || !dob || !consent) {
      Alert.alert('Incomplete Information', 'Please fill all fields and provide consent to continue.');
      return;
    }
    Alert.alert('Request Submitted', 'Your credit score request has been submitted successfully. We\'ll fetch your score now.');
  };

  const validatePAN = (text:string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = text.replace(/[^A-Z0-9]/g, '').toUpperCase();
    setPan(cleaned);
  };

  const validateDOB = (text:string) => {
    // Allow only numbers and hyphens, format as YYYY-MM-DD
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 4) {
      cleaned = cleaned.substring(0, 4) + '-' + cleaned.substring(4);
    }
    if (cleaned.length >= 7) {
      cleaned = cleaned.substring(0, 7) + '-' + cleaned.substring(7, 9);
    }
    setDob(cleaned);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.topheader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Eligibility Criteria</Text>
      </View>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="credit-score" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Check Your Credit Score</Text>
        <Text style={styles.subtitle}>
          Get your free credit score instantly with secure verification
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        {/* PAN Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>PAN Number</Text>
          <View style={[
            styles.inputWrapper,
            focusedInput === 'pan' && styles.inputWrapperFocused
          ]}>
            <AntDesign name="idcard" size={20} color={focusedInput === 'pan' ? Colors.primary : '#9CA3AF'} style={styles.inputIcon} />
            <TextInput
              placeholder="ABCDE1234F"
              value={pan}
              onChangeText={validatePAN}
              style={styles.input}
              autoCapitalize="characters"
              maxLength={10}
              onFocus={() => setFocusedInput('pan')}
              onBlur={() => setFocusedInput('')}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* DOB Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <View style={[
            styles.inputWrapper,
            focusedInput === 'dob' && styles.inputWrapperFocused
          ]}>
            <AntDesign name="calendar" size={20} color={focusedInput === 'dob' ? Colors.primary : '#9CA3AF'} style={styles.inputIcon} />
            <TextInput
              placeholder="YYYY-MM-DD"
              value={dob}
              onChangeText={validateDOB}
              style={styles.input}
              keyboardType="numeric"
              maxLength={10}
              onFocus={() => setFocusedInput('dob')}
              onBlur={() => setFocusedInput('')}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Consent Section */}
        <View style={styles.consentContainer}>
          <TouchableOpacity 
            onPress={() => setConsent(!consent)} 
            style={styles.checkboxRow} 
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
              {consent && <AntDesign name="check" size={14} color="#fff" />}
            </View>
            <View style={styles.consentTextContainer}>
              <Text style={styles.checkboxLabel}>
                I consent to fetch my credit score and agree to the{' '}
                <Text style={styles.linkText}>Terms & Conditions</Text> and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          onPress={handleCheckScore} 
          style={[styles.button, (!pan || !dob || !consent) && styles.buttonDisabled]} 
          activeOpacity={0.8}
          disabled={!pan || !dob || !consent}
        >
          <MaterialIcons name="search" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Get My Credit Score</Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <AntDesign name="gift" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>100% Secure & Encrypted</Text>
          </View>
          <View style={styles.infoItem}>
            <AntDesign name="clockcircle" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>Instant Results</Text>
          </View>
          <View style={styles.infoItem}>
            <AntDesign name="gift" size={16} color={Colors.primary} />
            <Text style={styles.infoText}>Completely Free</Text>
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
    padding: 20,
  },
  topheader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: Colors.primary,
    zIndex: 20,
    paddingTop: 20,
    marginBottom: 10,
    marginHorizontal: -20,
    marginTop: -20,
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 16,
  },
  consentContainer: {
    marginBottom: 32,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  consentTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
});