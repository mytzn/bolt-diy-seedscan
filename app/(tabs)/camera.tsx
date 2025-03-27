import { useState, useRef } from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { CameraView, Camera, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useSettings } from '@/hooks/useSettings';

export default function CameraScreen() {
  const [type, setType] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const { flashEnabled } = useSettings();
  const cameraRef = useRef<Camera>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      // Generate mock bounding boxes for demonstration
      const boundingBoxes = Array.from({ length: 10 }, () => ({
        x: Math.random() * (Platform.OS === 'web' ? window.innerWidth * 0.8 : 300),
        y: Math.random() * (Platform.OS === 'web' ? window.innerHeight * 0.5 : 200),
        width: 60,
        height: 40
      }));

      router.push({
        pathname: '/results',
        params: { 
          imageUri: photo.uri,
          boundingBoxes: JSON.stringify(boundingBoxes)
        }
      });
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flash={flashEnabled ? 'on' : 'off'}
      >
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraType}
          >
            <Text style={styles.flipText}>Flip</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  flipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 20,
  },
  flipText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
