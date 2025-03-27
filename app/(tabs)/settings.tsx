import { View, Text, StyleSheet, Switch } from 'react-native';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsScreen() {
  const { flashEnabled, toggleFlash, modelVersion } = useSettings();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Force Flash</Text>
          <Switch
            value={flashEnabled}
            onValueChange={toggleFlash}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={flashEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>AI Model Version</Text>
          <Text style={styles.versionText}>{modelVersion}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 17,
  },
  versionText: {
    fontSize: 17,
    color: '#666',
  },
});
