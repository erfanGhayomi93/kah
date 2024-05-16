declare type ClassesValue =
	| string
	| number
	| null
	| false
	| boolean
	| undefined
	| string[]
	| Record<string, null | boolean | undefined>
	| ClassesValue[];

declare type ReactNode = null | undefined | false | React.ReactElement;

declare type RecordClasses<T extends string> = Partial<Record<T, ClassesValue>>;

declare type NestedObject = { [key: string | number]: NestedObject | string | number };

declare type ElementType<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;

declare type PartialK<T, K extends PropertyKey = PropertyKey> = Partial<Pick<T, Extract<keyof T, K>>> &
	Omit<T, K> extends infer O
	? { [P in keyof O]: O[P] }
	: never;

declare type PickByType<T, Value> = {
	[P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

declare type RequiredK<T, K extends PropertyKey = PropertyKey> = Required<Pick<T, Extract<keyof T, K>>> &
	Omit<T, K> extends infer O
	? { [P in keyof O]: O[P] }
	: never;

declare type Nullable<T> = null | T;
