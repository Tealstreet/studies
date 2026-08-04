export interface StudyBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CandleCoordinates {
  top: number;
  bottom: number;
  center: number;
  left: number;
  right: number;
  candleWidth: number;
  high: number;
  low: number;
  wickWidth: number;
}

export interface StudyDrawArgs {
  ctx: CanvasRenderingContext2D;
  bars: StudyBar[];
  candleCoords: CandleCoordinates[];
  settings: Record<string, unknown>;
  exchange: string;
  symbol: string;
  resolutionString: string;
  chartWidth: number;
  chartHeight: number;
  priceToCoord: (price: number) => number;
  coordToPrice: (coord: number) => number;
}

export class BarsStudy {
  isVisible(): boolean {
    return true;
  }

  getTooltipText(_args: unknown): [] {
    return [];
  }

  destroy(): void {}

  drawBehind(_args: StudyDrawArgs): void {}

  draw(_args: StudyDrawArgs): void {}

  drawInFront(_args: StudyDrawArgs): void {}
}

export type BarsStudyConstructor = new () => BarsStudy;
