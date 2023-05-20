import { Entity } from '../../../@seedwork/domain/entities/entity';
import { UniqueEntityId } from '../../../@seedwork/domain/value-objects/unique-entity-id.vo';

export type CategoryProperties = {
  name: string;
  is_active?: boolean;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
};

export class Category extends Entity<CategoryProperties> {
  constructor(public readonly props: CategoryProperties, id?: UniqueEntityId) {
    super(props, id);
    this.is_active = this.props.is_active;
    this.description = this.props.description;
    this.props.created_at = this.props.created_at ?? new Date();
    this.props.updated_at = this.props.updated_at ?? new Date();
  }

  update(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.props.updated_at = new Date();
  }

  activate() {
    this.is_active = true;
    this.props.updated_at = new Date();
  }

  deactivate() {
    this.is_active = false;
    this.props.updated_at = new Date();
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  get description(): string | null {
    return this.props.description;
  }

  set description(value: string | null) {
    this.props.description = value ?? null;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  get updated_at(): Date {
    return this.props.updated_at;
  }
}
