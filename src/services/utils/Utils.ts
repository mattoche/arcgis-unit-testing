export function removeAccentTo(string: string): string {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function stringContains(source: string, contains: string): boolean {
  return removeAccentTo(source).toUpperCase().includes(removeAccentTo(contains).toUpperCase());
}

export function computeIfAbsent(map: Map<any, any>, key: any, func: (key: any) => any) {
  let value = map.get(key);
  if (!value) {
    value = func(key);
    map.set(key, value);
  }
  return value;
}

export function toCamelCase(...strings: string[]): string {
  const camelCase = strings.map((string) => string.charAt(0).toUpperCase() + string.substring(1)).join('');
  return camelCase.charAt(0).toLowerCase() + camelCase.substring(1);
}

export function genUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random % 4) + 8;
    return value.toString(16);
  });
}
