import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { addItem } from '../utils/storage';

export default function NovoClienteScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');

  async function salvar() {
    if (!nome) {
      Alert.alert('Atenção', 'Preencha o nome do cliente.');
      return;
    }

    await addItem('clientes', { nome, telefone, email, endereco });

    Alert.alert('Sucesso', 'Cliente cadastrado!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" placeholderTextColor="#666" />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" placeholderTextColor="#666" keyboardType="phone-pad" />

      <Text style={styles.label}>E-mail</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@exemplo.com" placeholderTextColor="#666" keyboardType="email-address" />

      <Text style={styles.label}>Endereço</Text>
      <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, número, bairro" placeholderTextColor="#666" />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>✅ Cadastrar Cliente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 16 },
  label: { color: '#ccc', fontSize: 14, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#1a1a2e', borderRadius: 8, padding: 12, color: '#fff', fontSize: 16, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#2ec4b6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
