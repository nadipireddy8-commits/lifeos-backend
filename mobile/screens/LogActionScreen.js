import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { logAction } from '../services/api';

export default function LogActionScreen({ navigation }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('productive');

  const handleSubmit = async () => {
    if (!text.trim()) return Alert.alert('Please enter an action');
    await logAction({ actionText: text, category });
    Alert.alert('Logged!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="What did you do?" value={text} onChangeText={setText} style={styles.input} />
      <View style={styles.categoryRow}>
        {['productive', 'distraction', 'physical', 'emotional'].map(c => (
          <Button key={c} title={c} onPress={() => setCategory(c)} color={category === c ? 'blue' : 'gray'} />
        ))}
      </View>
      <Button title="Save Action" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 8 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }
});