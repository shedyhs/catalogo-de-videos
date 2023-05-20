/* eslint-disable no-restricted-syntax */
export function deepFreeze<T>(obj: T) {
  try {
    const properties = Object.keys(obj);

    for (const name of properties) {
      const value = obj[name as keyof T];
      if (value && typeof value === 'object') {
        deepFreeze(value);
      }
    }
    return Object.freeze(obj);
  } catch (e) {
    return obj;
  }
}
