export function readSetting(key: string) {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(key);
}

export function writeSetting(key: string, value: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
}

