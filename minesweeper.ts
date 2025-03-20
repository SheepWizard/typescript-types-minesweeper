type Concat<A extends any[], B extends any[]> = [...A, ...B];

type Length<A extends any[]> = A["length"] extends number ? A["length"] : never;

type If<Exp extends boolean, Then, Else> = Exp extends true ? Then : Else;

type ArrForLen<
  L extends number,
  Acc extends any[] = []
> = Acc["length"] extends L ? Acc : ArrForLen<L, Concat<Acc, [any]>>;

type ArrForLenNum<
  L extends number,
  Acc extends number[] = []
> = Acc["length"] extends L
  ? Acc
  : ArrForLenNum<L, Concat<Acc, [Acc["length"]]>>;

type Add<A extends number, B extends number> = Length<
  Concat<ArrForLen<A>, ArrForLen<B>>
>;

type Sub<A extends number, B extends number> = ArrForLen<A> extends [
  ...ArrForLen<B>,
  ...infer U
]
  ? Length<U>
  : never;

type Mul<
  A extends number,
  B extends number,
  Acc extends number = 0
> = B extends 0 ? Acc : Mul<A, Sub<B, 1>, Add<Acc, A>>;

type Div<
  A extends number,
  B extends number,
  Acc extends number = A,
  Count extends number = 0
> = Lte<A, B> extends true
  ? 0
  : Acc extends 0
  ? Count
  : Div<A, B, Sub<Acc, B>, Add<Count, 1>>;

type DivFloor<
  A extends number,
  B extends number,
  Acc extends number = A,
  Count extends number = 0
> = Lte<A, B> extends true
  ? 0
  : Acc extends 0
  ? Count
  : Lte<Sub<Acc, B>, B> extends true
  ? Add<Count, 1>
  : DivFloor<A, B, Sub<Acc, B>, Add<Count, 1>>;

type Mod<A extends number, B extends number> = Sub<A, Mul<B, DivFloor<A, B>>>;

type Eq<A, B> = A extends B ? true : false;

type Gt<A extends number, B extends number> = Sub<A, B> extends 0
  ? false
  : true;

type Gte<A extends number, B extends number> = If<
  Gt<A, B>,
  true,
  If<Eq<A, B>, true, false>
>;

type Lt<A extends number, B extends number> = Sub<B, A> extends 0
  ? false
  : true;

type Lte<A extends number, B extends number> = If<
  Lt<A, B>,
  true,
  If<Eq<A, B>, true, false>
>;

type CellVal = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "F" | "M";

type Cell = {
  num: CellVal;
  open: boolean;
};

type UpdateCellVal<C extends Cell, Val extends CellVal> = {
  num: Val;
  open: C["open"];
} extends Cell
  ? { num: Val; open: C["open"] }
  : never;

type UpdateCellOpen<C extends Cell> = {
  num: C["num"];
  open: true;
} extends Cell
  ? { num: C["num"]; open: true }
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

type OpenCell<
  Cells extends Cell[],
  Row extends number,
  Column extends number,
  MaxRows extends number
> = Cells[IndexGet<Row, Column, MaxRows>]["open"] extends true
  ? Cells
  : Cells[IndexGet<Row, Column, MaxRows>]["num"] extends 0
  ? OpenCellNeighbours<
      UpdateCellList<
        Cells,
        UpdateCellOpen<Cells[IndexGet<Row, Column, MaxRows>]>,
        IndexGet<Row, Column, MaxRows>
      >,
      Row,
      Column,
      MaxRows
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
  ? UpdateCellList<
      Cells,
      UpdateCellOpen<Cells[IndexGet<Row, Column, MaxRows>]>,
      IndexGet<Row, Column, MaxRows>
    >
  : Cells;

type DrawCell<C extends Cell> = C["open"] extends false
  ? "⬜"
  : C["num"] extends 0
  ? "🟦"
  : C["num"] extends 1
  ? "1️⃣"
  : C["num"] extends 2
  ? "2️⃣"
  : C["num"] extends 3
  ? "3️⃣"
  : C["num"] extends 4
  ? "4️⃣"
  : C["num"] extends 5
  ? "5️⃣"
  : C["num"] extends 6
  ? "6️⃣"
  : C["num"] extends 7
  ? "7️⃣"
  : C["num"] extends 8
  ? "8️⃣"
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
      `${Acc}${DrawCell<Cells[Add<Count, Mul<Row, MaxRow>>]>}`
    >;

type DrawBoard<Cells extends Cell[]> = {
  [Data in ArrForLenNum<3>[number]]: MapCellList<Cells, Data, 3>;
};

type Settings = {
  rows: 3;
  columns: 3;
};

type MapCells<
  T extends number[],
  Acc extends Cell[] = []
> = Length<T> extends Length<Acc>
  ? Acc
  : MapCells<T, [...Acc, { num: 0; open: false }]>;

type MakeBoard = MapCells<
  ArrForLenNum<Mul<Settings["rows"], Settings["columns"]>>
>;

type State = OpenCell<MakeBoard, 0, 0, Settings["rows"]>;

type Display = DrawBoard<State>;
