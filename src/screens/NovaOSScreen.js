import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { addItem } from '../utils/storage';

export default function NovaOSScreen({ navigation }) {
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [equipamento, setEquipamento] = useState('');
  const [defeito, setDefeito] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [valor, setValor] = useState('');

  async function salvar() {
    if (!cliente || !defeito) {
      Alert.alert('Atenção', 'Preencha pelo menos o nome do cliente e o defeito.');
      return;
    }

    await addItem('ordens', {
      cliente,
      telefone,
      equipamento,
      defeito,
      observacoes,
      valor,
      status: 'Aberta',
    });

    Alert.alert('Sucesso', 'Ordem de serviço criada!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Cliente *</Text>
      <TextInput style={styles.input} value={cliente} onChangeText={setCliente} placeholder="Nome do cliente" placeholderTextColor="#666" />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" placeholderTextColor="#666" keyboardType="phone-pad" />

      <Text style={styles.label}>Equipamento</Text>
      <TextInput style={styles.input} value={equipamento} onChangeText={setEquipamento} placeholder="Ex: Notebook Dell, PC Desktop" placeholderTextColor="#666" />

      <Text style={styles.label}>Defeito relatado *</Text>
      <TextInput style={[styles.input, { height: 80 }]} value={defeito} onChangeText={setDefeito} placeholder="Descreva o problema" placeholderTextColor="#666" multiline />

      <Text style={styles.label}>Observações</Text>
      <TextInput style={[styles.input, { height: 60 }]} value={observacoes} onChangeText={setObservacoes} placeholder="Observações adicionais" placeholderTextColor="#666" multiline />

      <Text style={styles.label}>Valor estimado (R$)</Text>
      <TextInput style={styles.input} value={valor} onChangeText={setValor} placeholder="0.00" placeholderTextColor="#666" keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>✅ Criar Ordem de Serviço</Text>
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
