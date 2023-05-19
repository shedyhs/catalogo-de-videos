import { ValueObject } from './value-object';

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
});
