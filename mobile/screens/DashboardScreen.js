import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getInsights, getActions } from '../services/api';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function DashboardScreen() {
  const [score, setScore] = useState(0);
  const [emotions, setEmotions] = useState({});
  const [categories, setCategories] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const insights = await getInsights();
    setScore(insights.data.productivityScore);
    setEmotions(insights.data.emotionTrend);
    setCategories(insights.data.topCategories);
  };

  const emotionData = Object.entries(emotions).map(([name, count]) => ({ name, population: count, color: getColor(name) }));
  const categoryData = Object.entries(categories).map(([name, count]) => ({ name, population: count, color: getColor(name) }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.score}>Productivity: {score}%</Text>
      <Text style={styles.subtitle}>Emotion Trend (last 7 days)</Text>
      {emotionData.length > 0 && <PieChart data={emotionData} width={350} height={200} chartConfig={chartConfig} accessor="population" />}
      <Text style={styles.subtitle}>Action Categories</Text>
      {categoryData.length > 0 && <PieChart data={categoryData} width={350} height={200} chartConfig={chartConfig} accessor="population" />}
    </ScrollView>
  );
}

function getColor(key) {
  const colors = { happy: '#4CAF50', sad: '#2196F3', angry: '#F44336', neutral: '#9E9E9E', stressed: '#FF9800', excited: '#FFC107', productive: '#8BC34A', distraction: '#FF5722', physical: '#00BCD4', emotional: '#E91E63' };
  return colors[key] || '#ccc';
}

const chartConfig = { backgroundColor: '#fff', backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff', color: (opacity = 1) => `rgba(0,0,0,${opacity})` };
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  score: { fontSize: 18, marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 }
});