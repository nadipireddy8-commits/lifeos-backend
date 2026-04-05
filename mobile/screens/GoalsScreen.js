import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { getGoals, createGoal, completeGoal } from '../services/api';

export default function GoalsScreen() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => { loadGoals(); }, []);

  const loadGoals = async () => {
    const res = await getGoals();
    setGoals(res.data);
  };

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    await createGoal(newGoal, deadline || null);
    setNewGoal('');
    setDeadline('');
    loadGoals();
  };

  const markComplete = async (id) => {
    await completeGoal(id);
    loadGoals();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Goals</Text>
      <TextInput placeholder="Goal (e.g., Learn AI)" value={newGoal} onChangeText={setNewGoal} style={styles.input} />
      <TextInput placeholder="Deadline (YYYY-MM-DD)" value={deadline} onChangeText={setDeadline} style={styles.input} />
      <Button title="Add Goal" onPress={addGoal} />
      <FlatList
        data={goals}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text>{item.goal} {item.deadline ? `(by ${item.deadline.slice(0,10)})` : ''}</Text>
            {item.status === 'active' && <Button title="Complete" onPress={() => markComplete(item._id)} />}
            {item.status === 'completed' && <Text style={styles.completed}>✓ Completed</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 8, borderRadius: 8 },
  goalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1 },
  completed: { color: 'green' }
});