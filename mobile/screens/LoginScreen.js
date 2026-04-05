import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    try {
      const res = isLogin ? await login(email, password) : await register(email, password);
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('userId', res.data.userId);
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title={isLogin ? 'Login' : 'Register'} onPress={handleSubmit} />
      <Button title={isLogin ? 'Create account' : 'Back to Login'} onPress={() => setIsLogin(!isLogin)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 8 }
});