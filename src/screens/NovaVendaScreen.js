import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { addItem } from '../utils/storage';

export default function NovaVendaScreen({ navigation }) {
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [valor, setValor] = useState('');
  const [cliente, setCliente] = useState('');

  async function salvar() {
    if (!produto || !valor) {
      Alert.alert('Atenção', 'Preencha o produto e o valor.');
      return;
    }

    await addItem('vendas', { produto, quantidade, valor, cliente });

    Alert.alert('Sucesso', 'Venda registrada!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Produto *</Text>
      <TextInput style={styles.input} value={produto} onChangeText={setProduto} placeholder="Ex: SSD 480GB, Memória RAM 8GB" placeholderTextColor="#666" />

      <Text style={styles.label}>Quantidade</Text>
      <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} placeholder="1" placeholderTextColor="#666" keyboardType="numeric" />

      <Text style={styles.label}>Valor total (R$) *</Text>
      <TextInput style={styles.input} value={valor} onChangeText={setValor} placeholder="0.00" placeholderTextColor="#666" keyboardType="numeric" />

      <Text style={styles.label}>Cliente (opcional)</Text>
      <TextInput style={styles.input} value={cliente} onChangeText={setCliente} placeholder="Nome do cliente" placeholderTextColor="#666" />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>✅ Registrar Venda</Text>
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
