import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const SETTINGS_FILE = `${FileSystem.documentDirectory}settings.json`;

interface Settings {
  flashEnabled: boolean;
  modelVersion: string;
}

const DEFAULT_SETTINGS: Settings = {
  flashEnabled: false,
  modelVersion: '1.0.0',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      if (Platform.OS === 'web') {
        const settingsData = localStorage.getItem('settings');
        if (settingsData) {
          setSettings(JSON.parse(settingsData));
        }
      } else {
        const fileExists = await FileSystem.getInfoAsync(SETTINGS_FILE);
        if (fileExists.exists) {
          const settingsData = await FileSystem.readAsStringAsync(SETTINGS_FILE);
          setSettings(JSON.parse(settingsData));
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('settings', JSON.stringify(newSettings));
      } else {
        await FileSystem.writeAsStringAsync(SETTINGS_FILE, JSON.stringify(newSettings));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleFlash = () => {
    const newSettings = {
      ...settings,
      flashEnabled: !settings.flashEnabled,
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return {
    ...settings,
    toggleFlash,
  };
}
