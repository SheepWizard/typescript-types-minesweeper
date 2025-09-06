import {
  Length,
  Add,
  Mul,
  Sub,
  ArrForLenNum,
  Rand,
  Mod,
  DivFloor,
} from "./Util";

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

type IndexGet<Row extends number, Col extends number> = Add<
  Mul<Row, Settings["columns"]>,
  Col
>;

type OpenNeighbourCells<
  Cells extends Cell[],
  Neighbours extends number[],
  Count extends number = 0,
  CurrIndex extends [number, number] = Index2<
    Neighbours[Count],
    Settings["columns"]
  >
> = Count extends Length<Neighbours>
  ? Cells
  : OpenNeighbourCells<
      OpenCell<Cells, CurrIndex[0], CurrIndex[1]>,
      Neighbours,
      Add<Count, 1>
    >;

type OpenCell<
  Cells extends Cell[],
  Row extends number,
  Column extends number,
  CurrIndex extends number = IndexGet<Row, Column>
> = Cells[CurrIndex]["open"] extends true
  ? Cells
  : Cells[CurrIndex]["num"] extends 0
  ? OpenNeighbourCells<
      UpdateCellList<Cells, UpdateCellOpen<Cells[CurrIndex]>, CurrIndex>,
      Cells[CurrIndex]["neighbours"]
    >
  : Cells[CurrIndex]["num"] extends 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "M"
  ? UpdateCellList<Cells, UpdateCellOpen<Cells[CurrIndex]>, CurrIndex>
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
  Acc extends Cell[] = [],
  CurrIndex extends [number, number] = Index2<Length<Acc>, Settings["columns"]>
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
            CurrIndex[0],
            CurrIndex[1],
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

type Settings = {
  rows: 5;
  columns: 3;
  mines: 4;
  seed: 1;
};

type State = OpenCell<MakeBoard, 2, 0>;

type Dislay = DrawBoard<State>;

const d: Dislay;
