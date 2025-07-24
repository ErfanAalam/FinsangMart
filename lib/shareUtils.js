import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import Share from 'react-native-share';

export async function shareProduct({ product, user }) {
  if (!product) return;

  // Compose benefits with emojis
  const benefits = Array.isArray(product.benefits)
    ? product.benefits.map((b) => {
        if (b.toLowerCase().includes('reward')) return `🎫 ${b}`;
        if (b.toLowerCase().includes('lounge')) return `✈️ ${b}`;
        if (b.toLowerCase().includes('night') || b.toLowerCase().includes('award')) return `🏆 ${b}`;
        return `⭐ ${b}`;
      }).join('\n')
    : '';

  const message = `
Stay, Earn Points & Enjoy with ${product.card_name}!

Why choose ${product.card_name}?
${benefits}

Why apply from here?
✔️ 100% online process
✔️ Minimal documentation

Apply for your ${product.card_name} today - ${product.application_process_url || ''}

For any queries, call +${user?.phone || ''} or +91 7417274072 for quick support.

${user?.name || ''}
  `.trim();

  let shareOptions = {
    message,
    failOnCancel: false,
  };

  if (product.Image_url) {
    try {
      // Create a unique filename based on the image URL
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        product.Image_url
      );
      const fileUri = FileSystem.cacheDirectory + hash + '.png';

      // Check if file already exists
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        // Download if not cached
        const downloadResumable = FileSystem.createDownloadResumable(
          product.Image_url,
          fileUri
        );
        await downloadResumable.downloadAsync();
      }

      shareOptions.url = fileUri;
      shareOptions.type = 'image/png';
    } catch (e) {
      console.warn('Image download failed, sharing only text.', e);
    }
  }

  await Share.open(shareOptions);
} 