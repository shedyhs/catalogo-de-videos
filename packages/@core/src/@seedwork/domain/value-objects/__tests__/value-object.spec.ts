/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValueObject } from '../value-object';

class StubValueObject extends ValueObject {}

describe('ValueObject Unit Test', () => {
  it('Should set value', () => {
    const vo = new StubValueObject('this is a string value');
    expect(vo.value).toBe('this is a string value');
  });

  it('Should can set object as value', () => {
    const vo = new StubValueObject({ ok: true });
    expect(vo.value).toStrictEqual({ ok: true });
  });

  describe('should convert to a string', () => {
    const date = new Date();
    const arrange = [
      { received: '', expected: '' },
      { received: 'fake test', expected: 'fake test' },
      { received: 0, expected: '0' },
      { received: 1, expected: '1' },
      { received: 5, expected: '5' },
      { received: true, expected: 'true' },
      { received: false, expected: 'false' },
      { received: date, expected: date.toString() },
      {
        received: { prop1: 'value1' },
        expected: JSON.stringify({ prop1: 'value1' }),
      },
    ];

    test.each(arrange)(
      'from $received to $expected',
      ({ received, expected }) => {
        const vo = new StubValueObject(received);
        expect(`${vo}`).toBe(expected);
      },
    );
  });

  it('should be a immutable object', () => {
    const obj = {
      shallow: 'value',
      deep: { primitive: 'value', object: new Date() },
    };
    const vo = new StubValueObject(obj);

    expect(() => {
      (vo as any).value.shallow = 'another value';
    }).toThrow(
      "Cannot assign to read only property 'shallow' of object '#<Object>'",
    );

    expect(() => {
      (vo as any).value.deep.primitive = 'another primitive value';
    }).toThrow(
      "Cannot assign to read only property 'primitive' of object '#<Object>'",
    );

    expect(vo.value.deep.object).toBeInstanceOf(Date);
  });
});
