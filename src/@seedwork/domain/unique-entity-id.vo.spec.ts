import { UniqueEntityId } from './unique-entity-id.vo';
import { InvalidUuidError } from '../errors/invalid-uuid.error';

describe('Unique Entity Id Unit Test', () => {
  const validateSpy = jest.spyOn(
    UniqueEntityId.prototype as UniqueEntityId,
    'validate',
  );

  beforeEach(() => {
    validateSpy.mockClear();
  });

  test('generate UUID if not received value', () => {
    const id = new UniqueEntityId();
    expect(id).toBeInstanceOf(UniqueEntityId);
    expect(id.value).toBeDefined();
  });

  test('verify if generated UUID is valid', () => {
    const id = new UniqueEntityId();
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(id).toBeInstanceOf(UniqueEntityId);
  });

  test('retain received value', () => {
    const id = new UniqueEntityId('5604300b-1ff3-4c73-ac03-134ab51fbbdc');
    expect(id.value).toBe('5604300b-1ff3-4c73-ac03-134ab51fbbdc');
  });

  test('verify if retained value is a valid UUID', () => {
    const id = new UniqueEntityId('5604300b-1ff3-4c73-ac03-134ab51fbbdc');
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(id.value).toBe('5604300b-1ff3-4c73-ac03-134ab51fbbdc');
  });

  test('throw an InvalidUuidError if received value is not valid Uuid', () => {
    expect(() => new UniqueEntityId('certainly-not-a-valid-uuid')).toThrow(
      new InvalidUuidError(),
    );
  });
});
