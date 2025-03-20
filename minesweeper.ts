import { Length, Add, Mul, Sub, ArrForLenNum, Mod, Rand } from "./Util";

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
  : C["num"] extends "M"
  ? "💣"
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
  mines: 2;
  seed: 6;
};

type MapCells<
  T extends number[],
  Acc extends Cell[] = []
> = Length<T> extends Length<Acc>
  ? Acc
  : MapCells<T, [...Acc, { num: 0; open: true }]>;

// type Rand<Min extends number, Max extends number> =

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

type MakeBoard = PlaceMines<
  MapCells<ArrForLenNum<Mul<Settings["rows"], Settings["columns"]>>>
>;

type State = OpenCell<MakeBoard, 0, 0, Settings["rows"]>;

type Display = DrawBoard<State>;

// type R2 = Rand<1,1,15>
