import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from '../utils/storage';

export default function VendasScreen({ navigation }) {
  const [vendas, setVendas] = useState([]);

  useFocusEffect(useCallback(() => { loadVendas(); }, []));

  async function loadVendas() {
    const data = await getData('vendas');
    setVendas(data.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)));
  }

  const totalMes = vendas.reduce((sum, v) => sum + (parseFloat(v.valor) || 0), 0);

  function renderVenda({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.produto}>{item.produto}</Text>
          <Text style={styles.valor}>R$ {parseFloat(item.valor || 0).toFixed(2)}</Text>
        </View>
        <Text style={styles.info}>Qtd: {item.quantidade || 1} | {new Date(item.criadoEm).toLocaleDateString('pt-BR')}</Text>
        {item.cliente ? <Text style={styles.info}>👤 {item.cliente}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total do mês:</Text>
        <Text style={styles.totalValue}>R$ {totalMes.toFixed(2)}</Text>
      </View>
      <FlatList
        data={vendas}
        keyExtractor={item => item.id}
        renderItem={renderVenda}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma venda registrada</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NovaVenda')}>
        <Text style={styles.fabText}>+ Nova Venda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 16 },
  totalBox: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { color: '#888', fontSize: 14 },
  totalValue: { color: '#2ec4b6', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  produto: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
  valor: { fontSize: 15, color: '#2ec4b6', fontWeight: 'bold' },
  info: { fontSize: 12, color: '#888', marginTop: 2 },
  empty: { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 16 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#00b4d8', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, elevation: 5 },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
