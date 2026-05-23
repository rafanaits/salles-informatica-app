import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getData } from '../utils/storage';

export default function DashboardScreen() {
  const [stats, setStats] = useState({ osAbertas: 0, osAndamento: 0, osConcluidas: 0, vendasMes: 0, totalVendas: 0, totalOS: 0 });

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  async function loadStats() {
    const ordens = await getData('ordens');
    const vendas = await getData('vendas');
    const now = new Date();
    const mesAtual = now.getMonth();

    const vendasMes = vendas.filter(v => new Date(v.criadoEm).getMonth() === mesAtual);
    const totalVendas = vendasMes.reduce((sum, v) => sum + (parseFloat(v.valor) || 0), 0);
    const totalOS = ordens.filter(o => o.status === 'Concluída').reduce((sum, o) => sum + (parseFloat(o.valor) || 0), 0);

    setStats({
      osAbertas: ordens.filter(o => o.status === 'Aberta').length,
      osAndamento: ordens.filter(o => o.status === 'Em andamento').length,
      osConcluidas: ordens.filter(o => o.status === 'Concluída' || o.status === 'Entregue').length,
      vendasMes: vendasMes.length,
      totalVendas,
      totalOS,
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🖥️ Salles Informática</Text>
        <Text style={styles.subtitle}>Painel de Controle</Text>
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.card, { backgroundColor: '#ff6b35' }]}>
          <Text style={styles.cardNumber}>{stats.osAbertas}</Text>
          <Text style={styles.cardLabel}>OS Abertas</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#f7c948' }]}>
          <Text style={styles.cardNumber}>{stats.osAndamento}</Text>
          <Text style={styles.cardLabel}>Em Andamento</Text>
        </View>
      </View>

      <View style={styles.cardsRow}>
        <View style={[styles.card, { backgroundColor: '#2ec4b6' }]}>
          <Text style={styles.cardNumber}>{stats.osConcluidas}</Text>
          <Text style={styles.cardLabel}>Concluídas</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#00b4d8' }]}>
          <Text style={styles.cardNumber}>{stats.vendasMes}</Text>
          <Text style={styles.cardLabel}>Vendas no Mês</Text>
        </View>
      </View>

      <View style={styles.resumo}>
        <Text style={styles.resumoTitle}>💰 Resumo Financeiro (Mês)</Text>
        <View style={styles.resumoRow}>
          <Text style={styles.resumoLabel}>Vendas:</Text>
          <Text style={styles.resumoValue}>R$ {stats.totalVendas.toFixed(2)}</Text>
        </View>
        <View style={styles.resumoRow}>
          <Text style={styles.resumoLabel}>Serviços (OS):</Text>
          <Text style={styles.resumoValue}>R$ {stats.totalOS.toFixed(2)}</Text>
        </View>
        <View style={[styles.resumoRow, { borderTopWidth: 1, borderTopColor: '#333', paddingTop: 8 }]}>
          <Text style={[styles.resumoLabel, { fontWeight: 'bold' }]}>Total:</Text>
          <Text style={[styles.resumoValue, { fontWeight: 'bold', color: '#2ec4b6' }]}>R$ {(stats.totalVendas + stats.totalOS).toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 16 },
  header: { alignItems: 'center', marginBottom: 24, marginTop: 10 },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: { flex: 1, padding: 20, borderRadius: 12, marginHorizontal: 4, alignItems: 'center' },
  cardNumber: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  cardLabel: { fontSize: 12, color: '#fff', marginTop: 4, textAlign: 'center' },
  resumo: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginTop: 12 },
  resumoTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  resumoLabel: { fontSize: 14, color: '#ccc' },
  resumoValue: { fontSize: 14, color: '#fff' },
});
