import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, TouchableOpacity, Linking, StyleSheet, Text } from 'react-native';
import { askAssistant } from '../services/api';

export default function AssistantScreen() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await askAssistant(query);
      setResponse(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (response?.type === 'courses') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📚 Recommended Courses</Text>
        <FlatList
          data={response.data}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.url)}>
              {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />}
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardPlatform}>{item.platform}</Text>
              {item.free && <Text style={styles.freeBadge}>FREE</Text>}
            </TouchableOpacity>
          )}
        />
        <Button title="New Search" onPress={() => setResponse(null)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Ask me anything... e.g., I want to learn React Native for free" value={query} onChangeText={setQuery} />
      <Button title="Ask LifeOS" onPress={handleAsk} disabled={loading} />
      {loading && <Text>Thinking...</Text>}
      {response && response.type !== 'courses' && <Text style={styles.advice}>{response.data}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: { padding: 15, backgroundColor: '#f9f9f9', marginVertical: 8, borderRadius: 12, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardPlatform: { fontSize: 12, color: '#666' },
  freeBadge: { color: 'green', fontWeight: 'bold', marginTop: 5 },
  advice: { marginTop: 20, fontSize: 16, fontStyle: 'italic', backgroundColor: '#eef', padding: 15, borderRadius: 12 }
});