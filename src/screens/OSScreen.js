import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from '../utils/storage';

const statusColors = { 'Aberta': '#ff6b35', 'Em andamento': '#f7c948', 'Concluída': '#2ec4b6', 'Entregue': '#00b4d8' };

export default function OSScreen({ navigation }) {
  const [ordens, setOrdens] = useState([]);

  useFocusEffect(useCallback(() => { loadOrdens(); }, []));

  async function loadOrdens() {
    const data = await getData('ordens');
    setOrdens(data.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)));
  }

  function renderOS({ item }) {
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DetalhesOS', { os: item })}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>OS #{item.id.slice(-4)}</Text>
          <View style={[styles.badge, { backgroundColor: statusColors[item.status] || '#888' }]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.cardCliente}>👤 {item.cliente}</Text>
        <Text style={styles.cardDefeito} numberOfLines={1}>🔧 {item.defeito}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardData}>📅 {new Date(item.criadoEm).toLocaleDateString('pt-BR')}</Text>
          <Text style={styles.cardValor}>R$ {parseFloat(item.valor || 0).toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ordens}
        keyExtractor={item => item.id}
        renderItem={renderOS}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma OS cadastrada</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NovaOS')}>
        <Text style={styles.fabText}>+ Nova OS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 16 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 11, color: '#fff', fontWeight: 'bold' },
  cardCliente: { fontSize: 14, color: '#ccc', marginBottom: 4 },
  cardDefeito: { fontSize: 13, color: '#888', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardData: { fontSize: 12, color: '#666' },
  cardValor: { fontSize: 14, color: '#2ec4b6', fontWeight: 'bold' },
  empty: { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 16 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#00b4d8', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, elevation: 5 },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
