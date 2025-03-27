import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useHistory } from '@/hooks/useHistory';
import { SeedType } from '@/types/seeds';
import { useEffect, useState } from 'react';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const { imageUri, boundingBoxes: boundingBoxesStr } = params;
  const [imageError, setImageError] = useState(false);
  const boundingBoxes = boundingBoxesStr ? JSON.parse(boundingBoxesStr as string) : [];
  const { addToHistory } = useHistory();

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web-specific image validation
      const validateImage = new window.Image();
      validateImage.onerror = () => setImageError(true);
      validateImage.src = imageUri as string;
    }
  }, [imageUri]);

  const handleSave = () => {
    // Mock analysis results
    const mockAnalysis = {
      type: ['wheat', 'barley', 'oats', 'rye'][Math.floor(Math.random() * 4)] as SeedType,
      count: boundingBoxes.length,
    };

    // Save to history
    addToHistory({
      id: Date.now().toString(),
      imageUri: imageUri as string,
      analysis: mockAnalysis,
      date: new Date().toISOString(),
    });

    router.replace('/(tabs)/camera');
  };

  const handleDiscard = () => {
    router.replace('/(tabs)/camera');
  };

  if (imageError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load image</Text>
        <TouchableOpacity 
          style={[styles.button, styles.discardButton]} 
          onPress={handleDiscard}
        >
          <Text style={[styles.buttonText, styles.discardText]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUri as string }} 
          style={styles.image}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
        {boundingBoxes.map((box: any, index: number) => (
          <View
            key={index}
            style={[
              styles.boundingBox,
              {
                left: box.x,
                top: box.y,
                width: box.width,
                height: box.height,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.discardButton]} 
          onPress={handleDiscard}
        >
          <Text style={[styles.buttonText, styles.discardText]}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSave}
        >
          <Text style={[styles.buttonText, styles.saveText]}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    height: '75%',
    position: 'relative',
    backgroundColor: '#f8f8f8',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 140,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  discardButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveText: {
    color: '#fff',
  },
  discardText: {
    color: '#FF5252',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF5252',
    marginBottom: 20,
  },
});
