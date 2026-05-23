import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from '../utils/storage';

export default function ClientesScreen({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');

  useFocusEffect(useCallback(() => { loadClientes(); }, []));

  async function loadClientes() {
    const data = await getData('clientes');
    setClientes(data.sort((a, b) => a.nome.localeCompare(b.nome)));
  }

  const filtrados = clientes.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()));

  function renderCliente({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.nome}>👤 {item.nome}</Text>
        <Text style={styles.info}>📱 {item.telefone || 'Sem telefone'}</Text>
        {item.email ? <Text style={styles.info}>📧 {item.email}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.busca}
        placeholder="🔍 Buscar cliente..."
        placeholderTextColor="#666"
        value={busca}
        onChangeText={setBusca}
      />
      <FlatList
        data={filtrados}
        keyExtractor={item => item.id}
        renderItem={renderCliente}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum cliente cadastrado</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NovoCliente')}>
        <Text style={styles.fabText}>+ Novo Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 16 },
  busca: { backgroundColor: '#1a1a2e', borderRadius: 8, padding: 12, color: '#fff', fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#333' },
  card: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginBottom: 10 },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  info: { fontSize: 13, color: '#888', marginTop: 2 },
  empty: { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 16 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#00b4d8', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, elevation: 5 },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
