import { deepFreeze } from '../utils/object';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class ValueObject<Value = any> {
  protected readonly _value: Value;

  constructor(value: Value) {
    this._value = deepFreeze(value);
  }

  get value(): Value {
    return this._value;
  }

  toString = (): string => {
    if (typeof this.value !== 'object' || this.value === null) {
      try {
        return this.value.toString();
      } catch (e) {
        return `${this.value}`;
      }
    }
    const strValue = this.value.toString();
    return strValue === '[object Object]'
      ? JSON.stringify(this.value)
      : strValue;
  };
}
