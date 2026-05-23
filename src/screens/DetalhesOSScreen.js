import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { updateItem, deleteItem } from '../utils/storage';

const statusFlow = ['Aberta', 'Em andamento', 'Concluída', 'Entregue'];
const statusColors = { 'Aberta': '#ff6b35', 'Em andamento': '#f7c948', 'Concluída': '#2ec4b6', 'Entregue': '#00b4d8' };

export default function DetalhesOSScreen({ route, navigation }) {
  const [os, setOs] = useState(route.params.os);

  async function avancarStatus() {
    const currentIndex = statusFlow.indexOf(os.status);
    if (currentIndex < statusFlow.length - 1) {
      const novoStatus = statusFlow[currentIndex + 1];
      const updated = await updateItem('ordens', os.id, { status: novoStatus });
      setOs({ ...os, status: novoStatus });
      Alert.alert('Status atualizado', `OS agora está: ${novoStatus}`);
    }
  }

  async function excluir() {
    Alert.alert('Confirmar', 'Deseja excluir esta OS?', [
      { text: 'Cancelar' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        await deleteItem('ordens', os.id);
        navigation.goBack();
      }}
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.statusBar, { backgroundColor: statusColors[os.status] }]}>
        <Text style={styles.statusText}>{os.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Informações</Text>
        <InfoRow label="OS" value={`#${os.id.slice(-4)}`} />
        <InfoRow label="Cliente" value={os.cliente} />
        <InfoRow label="Telefone" value={os.telefone || 'Não informado'} />
        <InfoRow label="Equipamento" value={os.equipamento || 'Não informado'} />
        <InfoRow label="Data de entrada" value={new Date(os.criadoEm).toLocaleDateString('pt-BR')} />
        <InfoRow label="Valor" value={`R$ ${parseFloat(os.valor || 0).toFixed(2)}`} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Defeito</Text>
        <Text style={styles.descricao}>{os.defeito}</Text>
      </View>

      {os.observacoes ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Observações</Text>
          <Text style={styles.descricao}>{os.observacoes}</Text>
        </View>
      ) : null}

      {os.status !== 'Entregue' && (
        <TouchableOpacity style={styles.btnAvancar} onPress={avancarStatus}>
          <Text style={styles.btnText}>▶️ Avançar para: {statusFlow[statusFlow.indexOf(os.status) + 1]}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.btnExcluir} onPress={excluir}>
        <Text style={styles.btnExcluirText}>🗑️ Excluir OS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', padding: 16 },
  statusBar: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  statusText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  section: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { color: '#888', fontSize: 14 },
  infoValue: { color: '#fff', fontSize: 14 },
  descricao: { color: '#ccc', fontSize: 14, lineHeight: 20 },
  btnAvancar: { backgroundColor: '#2ec4b6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  btnExcluir: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12, marginBottom: 40, borderWidth: 1, borderColor: '#ff4444' },
  btnExcluirText: { color: '#ff4444', fontSize: 14 },
});
