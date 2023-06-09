import { omit } from 'lodash';
import { UniqueEntityId } from '../../../../@seedwork/domain/value-objects/unique-entity-id.vo';
import { Category } from '../category';

describe('Category Unit Test', () => {
  describe('constructor', () => {
    test('create category with only required fields', () => {
      const category = new Category({ name: 'Movie' });
      const props = omit(category.props, ['created_at', 'updated_at']);
      expect(props).toStrictEqual({
        name: 'Movie',
        description: null,
        is_active: true,
      });
      expect(category.props.created_at).toBeInstanceOf(Date);
      expect(category.props.updated_at).toBeInstanceOf(Date);
    });

    test('create category with all fields', () => {
      const created_at = new Date();
      const updated_at = new Date();
      const category = new Category({
        name: 'Movie',
        description: 'some description',
        is_active: false,
        created_at,
        updated_at,
      });
      expect(category.props).toStrictEqual({
        name: 'Movie',
        description: 'some description',
        is_active: false,
        created_at,
        updated_at,
      });
      expect(category.props.created_at).toBeInstanceOf(Date);
      expect(category.props.updated_at).toBeInstanceOf(Date);
    });

    test('id field must auto generate if not receive value', () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const category = new Category({ name: 'Movie' });
      expect(category.uniqueEntityId).not.toBeNull();
      expect(uuidRegex.test(category.uniqueEntityId.value)).toBeTruthy();
    });

    test('id field need to retain received value', () => {
      const id = new UniqueEntityId('5604300b-1ff3-4c73-ac03-134ab51fbbdc');
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const category = new Category({ name: 'Movie' }, id);
      expect(uuidRegex.test(category.uniqueEntityId.value)).toBeTruthy();
    });
  });

  describe("getter's and setter's", () => {
    test('getter of name field', () => {
      const category = new Category({ name: 'Movie' });
      expect(category.name).toBe('Movie');
    });

    test('getter and setter of description field', () => {
      const category = new Category({
        name: 'Movie',
      });
      expect(category.description).toBeNull();

      category.description = 'some description';
      expect(category.description).toBe('some description');

      category.description = undefined;
      expect(category.description).toBeNull();
    });

    test('getter and setter of is_active field', () => {
      const category = new Category({ name: 'Movie' });
      expect(category.is_active).toBeTruthy();
      category.is_active = false;
      expect(category.is_active).toBeFalsy();
    });

    test('getter of created_at field', () => {
      const category = new Category({ name: 'Movie' });
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test('getter of updated_at field', () => {
      const category = new Category({ name: 'Movie' });
      expect(category.updated_at).toBeInstanceOf(Date);
    });
  });

  it('update method', () => {
    const oldDate = new Date().getTime() - 1000;
    const category = new Category({
      name: 'name',
      description: 'some description',
      created_at: new Date(oldDate),
      updated_at: new Date(oldDate),
    });
    const oldUpdate = category.updated_at.getTime();
    category.update('another name', 'another description');
    expect(category.name).toBe('another name');
    expect(category.description).toBe('another description');
    expect(category.updated_at.getTime()).toBeGreaterThan(oldUpdate);
  });

  it('activate method', () => {
    const oldDate = new Date().getTime() - 1000;
    const category = new Category({
      name: 'name',
      description: 'some description',
      is_active: false,
      created_at: new Date(oldDate),
      updated_at: new Date(oldDate),
    });
    const oldUpdate = category.updated_at.getTime();
    category.activate();
    expect(category.is_active).toBeTruthy();
    expect(category.updated_at.getTime()).toBeGreaterThan(oldUpdate);
  });

  it('deactivate method', () => {
    const oldDate = new Date().getTime() - 1000;
    const category = new Category({
      name: 'name',
      description: 'some description',
      is_active: true,
      created_at: new Date(oldDate),
      updated_at: new Date(oldDate),
    });
    const oldUpdate = category.updated_at.getTime();
    category.deactivate();
    expect(category.is_active).toBeFalsy();
    expect(category.updated_at.getTime()).toBeGreaterThan(oldUpdate);
  });
});
