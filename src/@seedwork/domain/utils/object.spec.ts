import { deepFreeze } from './object';

describe('Object Unit Test', () => {
  it('should not freeze a scalar value', () => {
    const str = deepFreeze('str');
    const bool = deepFreeze(true);
    const num = deepFreeze(1234);
    expect(typeof str).toBe('string');
    expect(typeof bool).toBe('boolean');
    expect(typeof num).toBe('number');
  });

  it('should garant a object is immutable', () => {
    const frozenObject = deepFreeze({
      shallow: 'value',
      deep: { primitive: 'value', object: new Date() },
    });

    expect(() => (frozenObject.shallow = 'another value')).toThrow(
      `Cannot assign to read only property 'shallow' of object '#<Object>`,
    );
    expect(() => (frozenObject.deep.primitive = 'another value')).toThrow(
      `Cannot assign to read only property 'primitive' of object '#<Object>`,
    );
    expect(frozenObject.deep.object).toBeInstanceOf(Date);
  });
});
