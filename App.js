import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import DashboardScreen from './src/screens/DashboardScreen';
import ClientesScreen from './src/screens/ClientesScreen';
import NovoClienteScreen from './src/screens/NovoClienteScreen';
import OSScreen from './src/screens/OSScreen';
import NovaOSScreen from './src/screens/NovaOSScreen';
import DetalhesOSScreen from './src/screens/DetalhesOSScreen';
import VendasScreen from './src/screens/VendasScreen';
import NovaVendaScreen from './src/screens/NovaVendaScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }) {
  const icons = { 'Início': '🏠', 'OS': '🔧', 'Vendas': '💰', 'Clientes': '👥' };
  return <Text style={{ fontSize: focused ? 22 : 18 }}>{icons[label] || '📱'}</Text>;
}

function OSStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="ListaOS" component={OSScreen} options={{ title: 'Ordens de Serviço' }} />
      <Stack.Screen name="NovaOS" component={NovaOSScreen} options={{ title: 'Nova OS' }} />
      <Stack.Screen name="DetalhesOS" component={DetalhesOSScreen} options={{ title: 'Detalhes da OS' }} />
    </Stack.Navigator>
  );
}

function ClientesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="ListaClientes" component={ClientesScreen} options={{ title: 'Clientes' }} />
      <Stack.Screen name="NovoCliente" component={NovoClienteScreen} options={{ title: 'Novo Cliente' }} />
    </Stack.Navigator>
  );
}

function VendasStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="ListaVendas" component={VendasScreen} options={{ title: 'Vendas' }} />
      <Stack.Screen name="NovaVenda" component={NovaVendaScreen} options={{ title: 'Nova Venda' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
          tabBarActiveTintColor: '#00b4d8',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#333', paddingBottom: 5, height: 60 },
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
        })}
      >
        <Tab.Screen name="Início" component={DashboardScreen} />
        <Tab.Screen name="OS" component={OSStack} options={{ headerShown: false }} />
        <Tab.Screen name="Vendas" component={VendasStack} options={{ headerShown: false }} />
        <Tab.Screen name="Clientes" component={ClientesStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
