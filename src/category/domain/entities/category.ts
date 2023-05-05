import { randomUUID } from 'crypto';

export type CategoryProperties = {
  name: string;
  is_active?: boolean;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
};

export class Category {
  public readonly id: string;

  constructor(public readonly props: CategoryProperties, id?: string) {
    this.id = id ?? randomUUID();
    this.is_active = this.props.is_active;
    this.description = this.props.description;
    this.props.created_at = this.props.created_at ?? new Date();
    this.props.updated_at = this.props.updated_at ?? new Date();
  }

  get name(): string {
    return this.props.name;
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
