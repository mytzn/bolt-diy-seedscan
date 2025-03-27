import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useHistory } from '@/hooks/useHistory';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react-native';

export default function HistoryScreen() {
  const { history, clearHistory } = useHistory();

  const handleItemPress = (item: any) => {
    router.push({
      pathname: '/results',
      params: { 
        imageUri: item.imageUri,
        seedType: item.analysis.type,
        seedCount: item.analysis.count,
        date: item.date
      }
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
    >
      <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      <View style={styles.itemDetails}>
        <Text style={styles.seedInfo}>
          {item.analysis.count} {item.analysis.type} seeds
        </Text>
        <Text style={styles.date}>
          {format(new Date(item.date), 'MMM d, yyyy h:mm a')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        {history.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={clearHistory}
          >
            <Trash2 size={24} color="#FF5252" />
          </TouchableOpacity>
        )}
      </View>
      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No results available</Text>
          <Text style={styles.emptySubtext}>
            Please take your first image
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  list: {
    padding: 20,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  seedInfo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
