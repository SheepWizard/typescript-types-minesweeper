export type Concat<A extends any[], B extends any[]> = [...A, ...B];

export type Length<A extends any[]> = A["length"] extends number
  ? A["length"]
  : never;

export type If<Exp extends boolean, Then, Else> = Exp extends true
  ? Then
  : Else;

export type ArrForLen<
  L extends number,
  Acc extends any[] = []
> = Acc["length"] extends L ? Acc : ArrForLen<L, Concat<Acc, [any]>>;

export type ArrForLenNum<
  L extends number,
  Acc extends number[] = []
> = Acc["length"] extends L
  ? Acc
  : ArrForLenNum<L, Concat<Acc, [Acc["length"]]>>;

export type Add<A extends number, B extends number> = Length<
  Concat<ArrForLen<A>, ArrForLen<B>>
>;

export type Sub<A extends number, B extends number> = ArrForLen<A> extends [
  ...ArrForLen<B>,
  ...infer U
]
  ? Length<U>
  : never;

export type Mul<
  A extends number,
  B extends number,
  Acc extends number = 0
> = B extends 0 ? Acc : Mul<A, Sub<B, 1>, Add<Acc, A>>;

export type Div<
  A extends number,
  B extends number,
  Acc extends number = A,
  Count extends number = 0
> = Lte<A, B> extends true
  ? 0
  : Acc extends 0
  ? Count
  : Div<A, B, Sub<Acc, B>, Add<Count, 1>>;

export type DivFloor<
  A extends number,
  B extends number,
  Acc extends number = A,
  Count extends number = 0
> = Lte<A, B> extends true
  ? 0
  : Acc extends 0
  ? Count
  : Lt<Sub<Acc, B>, B> extends true
  ? Add<Count, 1>
  : DivFloor<A, B, Sub<Acc, B>, Add<Count, 1>>;

export type Mod<
  A extends number,
  B extends number,
  Acc extends number = A
> = Gte<Acc, B> extends true ? Mod<A, B, Sub<Acc, B>> : Acc;

export type Eq<A, B> = A extends B ? true : false;

export type Gt<A extends number, B extends number> = Sub<A, B> extends 0
  ? false
  : true;

export type Gte<A extends number, B extends number> = If<
  Gt<A, B>,
  true,
  If<Eq<A, B>, true, false>
>;

export type Lt<A extends number, B extends number> = Sub<B, A> extends 0
  ? false
  : true;

export type Lte<A extends number, B extends number> = If<
  Lt<A, B>,
  true,
  If<Eq<A, B>, true, false>
>;

export type Rand<
  Min extends number,
  Max extends number,
  Seed extends number
> = Add<Min, Mod<Mul<Seed, 12>, Max>>;
