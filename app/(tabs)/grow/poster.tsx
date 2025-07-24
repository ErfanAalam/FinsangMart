import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Share2 } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import { useUser } from '../../../Contexts/UserContext';

export default function PosterScreen() {
  const poster = useLocalSearchParams();
  const router = useRouter();
  const { userDetails } = useUser();
  const viewShotRef = useRef<ViewShot | null>(null);
  const [loading, setLoading] = useState(false);

  const onShare = async () => {
    setLoading(true);
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        const message = `Special offers on ${poster.title} are available for you. Check out now: https://wee.bnking.in/c/M2IzZjE2O`;
        await Share.open({
          title: poster.title as string,
          message,
          url: uri,
          type: 'image/png',
          failOnCancel: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Share with your network</Text>
        <TouchableOpacity onPress={onShare}>
          <Share2 size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} style={styles.posterImageContainer}>
          <Image source={{ uri: poster.image_url as string }} style={styles.posterImage} />
        </ViewShot>

        {/* User info signature, now below the image */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureAvatar}>
            <Text style={styles.signatureInitials}>{userDetails?.name ? userDetails.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.signatureName}>{userDetails?.name || 'User Name'}</Text>
            <Text style={styles.signatureOccupation}>{userDetails?.occupation || 'Occupation'}</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.shareButton} onPress={onShare} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.shareButtonText}>Share</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  posterImageContainer: {
    width: 320,
    height: 480,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  posterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  signatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  signatureAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signatureInitials: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 20,
  },
  signatureName: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 17,
  },
  signatureOccupation: {
    color: '#666',
    fontSize: 14,
  },
  shareButton: {
    backgroundColor: '#25D366',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 