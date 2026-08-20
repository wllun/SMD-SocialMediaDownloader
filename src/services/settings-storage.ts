import 'expo-sqlite/localStorage/install';

export function readSetting(key: string) {
  return localStorage.getItem(key);
}

export function writeSetting(key: string, value: string) {
  localStorage.setItem(key, value);
}

