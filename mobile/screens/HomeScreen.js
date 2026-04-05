import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getInsights } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [score, setScore] = useState(0);
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    const res = await getInsights();
    setScore(res.data.productivityScore);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LifeOS</Text>
      <Text style={styles.score}>Productivity Score: {score}%</Text>
      <Button title="Log Action" onPress={() => navigation.navigate('LogAction')} />
      <Button title="Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="AI Assistant" onPress={() => navigation.navigate('Assistant')} />
      <Button title="Goals" onPress={() => navigation.navigate('Goals')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  score: { fontSize: 20, marginBottom: 30 }
});