import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NudgeCard({ text, type = 'info' }) {
  const getColor = () => {
    switch (type) {
      case 'warning': return '#FF9800';
      case 'success': return '#4CAF50';
      case 'emotional': return '#E91E63';
      case 'health': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={[styles.card, { borderLeftColor: getColor() }]}>
      <Text style={styles.icon}>💡</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 5,
    elevation: 1
  },
  icon: { fontSize: 24, marginRight: 12 },
  text: { flex: 1, fontSize: 14, color: '#333' }
});