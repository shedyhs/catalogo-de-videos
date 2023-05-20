/* eslint-disable @typescript-eslint/ban-types */
export type Prettify<Type> = {
  [Key in keyof Type]: Type[Key];
} & {};
