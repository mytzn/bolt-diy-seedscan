import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { HistoryItem } from '@/types/seeds';

const HISTORY_FILE = `${FileSystem.documentDirectory}history.json`;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      if (Platform.OS === 'web') {
        const historyData = localStorage.getItem('history');
        if (historyData) {
          setHistory(JSON.parse(historyData));
        }
      } else {
        const fileExists = await FileSystem.getInfoAsync(HISTORY_FILE);
        if (fileExists.exists) {
          const historyData = await FileSystem.readAsStringAsync(HISTORY_FILE);
          setHistory(JSON.parse(historyData));
        }
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveHistory = async (newHistory: HistoryItem[]) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('history', JSON.stringify(newHistory));
      } else {
        await FileSystem.writeAsStringAsync(HISTORY_FILE, JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const addToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history];
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  return { history, addToHistory, clearHistory };
}
