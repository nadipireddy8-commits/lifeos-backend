import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getInsights, getActions } from '../services/api';
import ProgressChart from '../components/ProgressChart';
import NudgeCard from '../components/NudgeCard';

export default function InsightsScreen() {
  const [insights, setInsights] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const insightsRes = await getInsights();
      const actionsRes = await getActions();
      setInsights(insightsRes.data);
      setActions(actionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.center}><Text>Loading insights...</Text></View>;

  // Generate smart nudges based on productivity score and emotion trends
  const nudges = [];
  if (insights.productivityScore < 40) {
    nudges.push({ id: '1', text: "Your productivity is low. Try the Pomodoro technique for 25 minutes.", type: 'warning' });
  } else if (insights.productivityScore > 80) {
    nudges.push({ id: '2', text: "Great work! Remember to take breaks to avoid burnout.", type: 'success' });
  }
  if (insights.emotionTrend?.stressed > 3) {
    nudges.push({ id: '3', text: "You've been feeling stressed. Try a 5-minute meditation.", type: 'emotional' });
  }
  if (insights.emotionTrend?.sad > 2) {
    nudges.push({ id: '4', text: "It's okay to feel down. Reach out to a friend or journal your thoughts.", type: 'emotional' });
  }
  if (actions.filter(a => a.category === 'physical').length === 0) {
    nudges.push({ id: '5', text: "No physical activity logged today. A short walk can boost mood!", type: 'health' });
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Insights</Text>
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Productivity Score</Text>
        <Text style={styles.scoreValue}>{insights.productivityScore}%</Text>
      </View>
      <ProgressChart data={insights.emotionTrend || {}} title="Emotion Distribution (Last 7 Days)" />
      <Text style={styles.subtitle}>Smart Nudges</Text>
      {nudges.map(nudge => (
        <NudgeCard key={nudge.id} text={nudge.text} type={nudge.type} />
      ))}
      <Text style={styles.subtitle}>Recent Activity Summary</Text>
      {actions.slice(0, 5).map(action => (
        <View key={action._id} style={styles.actionItem}>
          <Text>{action.actionText}</Text>
          <Text style={styles.actionMeta}>{action.category} • {new Date(action.timestamp).toLocaleDateString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  scoreCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 20, elevation: 2 },
  scoreLabel: { fontSize: 16, color: '#666' },
  scoreValue: { fontSize: 48, fontWeight: 'bold', color: '#4CAF50' },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  actionItem: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  actionMeta: { fontSize: 12, color: '#999', marginTop: 4 }
});