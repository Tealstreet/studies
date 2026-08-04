export type PineJsStudyInputType = {
  Integer: string;
  Float: string;
  Price: string;
  Bool: string;
  Text: string;
  Symbol: string;
  Session: string;
  Source: string;
  Resolution: string;
  Time: string;
  BarTime: string;
  Color: string;
  Textarea: string;
};

export type PineJsStudyPlotType = {
  Line: string;
  Colorer: string;
  BarColorer: string;
  BgColorer: string;
  TextColorer: string;
  OhlcColorer: string;
  CandleWickColorer: string;
  CandleBorderColorer: string;
  UpColorer: string;
  DownColorer: string;
  Shapes: string;
  Chars: string;
  Arrows: string;
  Data: string;
  DataOffset: string;
  OhlcOpen: string;
  OhlcHigh: string;
  OhlcLow: string;
  OhlcClose: string;
};

export type PineJsStudyRuntime = {
  PineJS: unknown;
  StudyInputType: PineJsStudyInputType;
  StudyPlotType: PineJsStudyPlotType;
};

export type PineJsStudyFactory = (runtime: PineJsStudyRuntime) => unknown;

export type PineJsStudyInstance = {
  main?: (context: unknown, inputCallback: unknown) => unknown[];
};
