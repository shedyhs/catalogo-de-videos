/* eslint-disable @typescript-eslint/ban-types */
export type Legible<Type> = {
  [Key in keyof Type]: Type[Key];
} & {};
