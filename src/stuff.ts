const output = `

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

type CellVal = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "F" | "M";

type Cell = {
  num: CellVal;
  open: boolean;
  neighbours: number[];
};

type UpdateCellVal<C extends Cell, Val extends CellVal> = {
  num: Val;
  open: C["open"];
  neighbours: C["neighbours"];
} extends Cell
  ? { num: Val; open: C["open"]; neighbours: C["neighbours"] }
  : never;

type UpdateCellOpen<C extends Cell> = {
  num: C["num"];
  open: true;
  neighbours: C["neighbours"];
} extends Cell
  ? { num: C["num"]; open: true; neighbours: C["neighbours"] }
  : never;

type UpdateCellList<
  Cells extends Cell[],
  C extends Cell,
  Idx extends number,
  Acc extends Cell[] = []
> = Length<Cells> extends Length<Acc>
  ? Acc
  : Length<Acc> extends Idx
  ? UpdateCellList<Cells, C, Idx, [...Acc, C]>
  : UpdateCellList<Cells, C, Idx, [...Acc, Cells[Length<Acc>]]>;

type IndexGet<
  Row extends number,
  Col extends number,
  MaxRows extends number
> = Add<Mul<Row, MaxRows>, Col>;


type OpenCellNeighbours<
  Cells extends Cell[],
  Row extends number,
  Column extends number,
  MaxRows extends number
> =
  //@ts-ignore
  OpenCell<
    //@ts-ignore
    OpenCell<
      //@ts-ignore
      OpenCell<
        //@ts-ignore
        OpenCell<
          //@ts-ignore
          OpenCell<
            //@ts-ignore
            OpenCell<
              //@ts-ignore
              OpenCell<
                //@ts-ignore
                OpenCell<Cells, Add<Row, 1>, Column, MaxRows>,
                Add<Row, 1>,
                Add<Column, 1>,
                MaxRows
              >,
              Row,
              Add<Column, 1>,
              MaxRows
            >,
            Sub<Row, 1>,
            Add<Column, 1>,
            MaxRows
          >,
          Sub<Row, 1>,
          Column,
          MaxRows
        >,
        Sub<Row, 1>,
        Sub<Column, 1>,
        MaxRows
      >,
      Row,
      Sub<Column, 1>,
      MaxRows
    >,
    Add<Row, 1>,
    Sub<Column, 1>,
    MaxRows
  >;

type N2<
  Cells extends Cell[],
  Neighbours extends number[],
  Count extends number = 0
> = Count extends Length<Neighbours>
  ? Cells
  : N2<
      OpenCell<
        Cells,
        Index2<Neighbours[Count], 8>[0],
        Index2<Neighbours[Count], 8>[1]
      >,
      Neighbours,
      Add<Count, 1>
    >;


type OpenCell<
  Cells extends Cell[],
  Row extends number,
  Column extends number,
  MaxRows extends number = Settings["rows"]
> = Cells[IndexGet<Row, Column, MaxRows>]["open"] extends true
  ? Cells
  : Cells[IndexGet<Row, Column, MaxRows>]["num"] extends 0
  ? N2<
      UpdateCellList<
        Cells,
        UpdateCellOpen<Cells[IndexGet<Row, Column, MaxRows>]>,
        IndexGet<Row, Column, MaxRows>
      >,
      Cells[IndexGet<Row, Column, MaxRows>]["neighbours"]
    >
  : Cells[IndexGet<Row, Column, MaxRows>]["num"] extends
      | 1
      | 2
      | 3
      | 4
      | 5
      | 6
      | 7
      | 8
      | "M"
  ? UpdateCellList<
      Cells,
      UpdateCellOpen<Cells[IndexGet<Row, Column, MaxRows>]>,
      IndexGet<Row, Column, MaxRows>
    >
  : Cells;

type DrawCell<C extends Cell> = C["open"] extends false
  ? "C"
  : C["num"] extends "M"
  ? "M"
  : C["num"] extends 0
  ? "O"
  : C["num"] extends 1
  ? "1"
  : C["num"] extends 2
  ? "2"
  : C["num"] extends 3
  ? "3"
  : C["num"] extends 4
  ? "4"
  : C["num"] extends 5
  ? "5"
  : C["num"] extends 6
  ? "6"
  : C["num"] extends 7
  ? "7"
  : C["num"] extends 8
  ? "8"
  : "";

type MapCellList<
  Cells extends Cell[],
  Row extends number,
  MaxRow extends number,
  Count extends number = 0,
  Acc extends string = ""
> = Count extends MaxRow
  ? Acc
  : MapCellList<
      Cells,
      Row,
      MaxRow,
      Add<Count, 1>,
      \`\${Acc}\${DrawCell<Cells[Add<Count, Mul<Row, MaxRow>>]>}\`
    >;

type DrawBoard<Cells extends Cell[]> = {
  [Data in ArrForLenNum<Settings["rows"]>[number]]: MapCellList<
    Cells,
    Data,
    Settings["columns"]
  >;
};

type Index2<A extends number, MaxColumn extends number> = [
  DivFloor<A, MaxColumn>,
  Mod<A, MaxColumn>
];

type GetNeighbours<
  Index extends number,
  Row extends number,
  Column extends number,
  MaxRows extends number,
  MaxColumns extends number
> = Row extends 0
  ? Column extends 0
    ? [Add<Index, 1>, Add<Index, MaxColumns>, Add<Add<Index, MaxColumns>, 1>]
    : Column extends Sub<MaxColumns, 1>
    ? [Sub<Index, 1>, Add<Index, MaxColumns>, Sub<Add<Index, MaxColumns>, 1>]
    : [
        Add<Index, 1>,
        Sub<Index, 1>,
        Add<Index, MaxColumns>,
        Sub<Add<Index, MaxColumns>, 1>,
        Add<Add<Index, MaxColumns>, 1>
      ]
  : Column extends 0
  ? Row extends Sub<MaxRows, 1>
    ? [Add<Index, 1>, Sub<Index, MaxColumns>, Add<Sub<Index, MaxColumns>, 1>]
    : [
        Add<Index, 1>,
        Add<Index, MaxColumns>,
        Add<Add<Index, MaxColumns>, 1>,
        Add<Sub<Index, MaxColumns>, 1>,
        Sub<Index, MaxColumns>
      ]
  : Column extends Sub<MaxColumns, 1>
  ? Row extends Sub<MaxRows, 1>
    ? [Sub<Index, 1>, Sub<Index, MaxColumns>, Sub<Sub<Index, MaxColumns>, 1>]
    : [
        Sub<Index, 1>,
        Sub<Sub<Index, MaxColumns>, 1>,
        Sub<Index, MaxColumns>,
        Sub<Sub<Index, MaxColumns>, 1>,
        Sub<Add<Index, MaxColumns>, 1>,
        Add<Index, MaxColumns>
      ]
  : Row extends Sub<MaxRows, 1>
  ? [
      Sub<Index, 1>,
      Add<Index, 1>,
      Sub<Sub<Index, MaxColumns>, 1>,
      Add<Sub<Index, MaxColumns>, 1>,
      Sub<Index, MaxColumns>
    ]
  : [
      Sub<Index, 1>,
      Add<Index, 1>,
      Sub<Index, MaxColumns>,
      Sub<Sub<Index, MaxColumns>, 1>,
      Add<Sub<Index, MaxColumns>, 1>,
      Add<Index, MaxColumns>,
      Add<Add<Index, MaxColumns>, 1>,
      Sub<Add<Index, MaxColumns>, 1>
    ];

type PlaceCellNumber<
  Cells extends Cell[],
  C extends Cell,
  Count extends CellVal = 0,
  Index extends number = 0
> = Length<C["neighbours"]> extends Index
  ? UpdateCellVal<C, Count>
  : Cells[C["neighbours"][Index]]["num"] extends "M"
  ? PlaceCellNumber<Cells, C, Add<Count, 1>, Add<Index, 1>>
  : PlaceCellNumber<Cells, C, Count, Add<Index, 1>>;

type PlaceNumbers<
  Cells extends Cell[],
  Acc extends Cell[] = []
> = Length<Cells> extends Length<Acc>
  ? Acc
  : Cells[Length<Acc>]["num"] extends "M"
  ? PlaceNumbers<Cells, [...Acc, Cells[Length<Acc>]]>
  : PlaceNumbers<Cells, [...Acc, PlaceCellNumber<Cells, Cells[Length<Acc>]>]>;

type MapCells<
  T extends number[],
  Acc extends Cell[] = []
> = Length<T> extends Length<Acc>
  ? Acc
  : MapCells<
      T,
      [
        ...Acc,
        {
          num: 0;
          open: false;
          neighbours: GetNeighbours<
            Length<Acc>,
            Index2<Length<Acc>, Settings["columns"]>[0],
            Index2<Length<Acc>, Settings["columns"]>[1],
            Settings["rows"],
            Settings["columns"]
          >;
        }
      ]
    >;

type IndexSwap<
  List extends any[],
  A extends number,
  B extends number,
  Acc extends any[] = []
> = Length<List> extends Length<Acc>
  ? Acc
  : Length<Acc> extends A
  ? IndexSwap<List, A, B, [...Acc, List[B]]>
  : Length<Acc> extends B
  ? IndexSwap<List, A, B, [...Acc, List[A]]>
  : IndexSwap<List, A, B, [...Acc, List[Length<Acc>]]>;

type FishShuffleInternal<
  List extends number[],
  Total extends number,
  Seed extends number,
  Count extends number = Length<List>,
  Acc extends number[] = []
> = Length<Acc> extends Total
  ? Acc
  : FishShuffleInternal<
      IndexSwap<List, Rand<1, Count, Seed>, Count>,
      Total,
      Add<Seed, 1>,
      Sub<Count, 1>,
      [...Acc, List[Rand<1, Count, Seed>]]
    >;

type FishShuffle<
  Max extends number,
  Total extends number,
  Seed extends number
  //@ts-ignore
> = FishShuffleInternal<ArrForLenNum<Max>, Total, Seed>;

type PlaceMine<
  C extends Cell[],
  Index extends number,
  Acc extends Cell[] = []
> = Length<C> extends Length<Acc>
  ? Acc
  : Length<Acc> extends Index
  ? PlaceMine<C, Index, [...Acc, UpdateCellVal<C[Length<Acc>], "M">]>
  : PlaceMine<C, Index, [...Acc, C[Length<Acc>]]>;

type PlaceMines<
  C extends Cell[],
  //@ts-ignore
  Rand extends number[] = FishShuffle<
    Length<C>,
    Settings["mines"],
    Settings["seed"]
  >,
  Count extends number = 0
> = Count extends Settings["mines"]
  ? C
  : PlaceMines<PlaceMine<C, Rand[Count]>, Rand, Add<Count, 1>>;

type MakeBoard = PlaceNumbers<
  PlaceMines<MapCells<ArrForLenNum<Mul<Settings["rows"], Settings["columns"]>>>>
>;



`;

export default output;
