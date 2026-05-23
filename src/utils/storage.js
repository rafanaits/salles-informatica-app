import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getData(key) {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Erro ao ler dados:', e);
    return [];
  }
}

export async function saveData(key, data) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
  }
}

export async function addItem(key, item) {
  const data = await getData(key);
  item.id = Date.now().toString();
  item.criadoEm = new Date().toISOString();
  data.push(item);
  await saveData(key, data);
  return item;
}

export async function updateItem(key, id, updates) {
  const data = await getData(key);
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    await saveData(key, data);
  }
  return data[index];
}

export async function deleteItem(key, id) {
  const data = await getData(key);
  const filtered = data.filter(item => item.id !== id);
  await saveData(key, filtered);
}
