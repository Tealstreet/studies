import { BarsStudy, StudyDrawArgs } from '../types';
import { PineJsStudyFactory, PineJsStudyInstance, PineJsStudyRuntime } from './types';

const getSettingNumber = (settings: Record<string, unknown>, id: string, fallback: number) => {
  const value = settings[id];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const getSettingString = (settings: Record<string, unknown>, id: string, fallback: string) => {
  const value = settings[id];
  return typeof value === 'string' && value.length > 0 ? value : fallback;
};

const getSettingBool = (settings: Record<string, unknown>, id: string, fallback: boolean) => {
  const value = settings[id];
  return typeof value === 'boolean' ? value : fallback;
};

const emptyPineJsConstructor = function (this: PineJsStudyInstance) {
  this.main = function () {
    return [];
  };
};

const getPvsraColorIndex = (bars: StudyDrawArgs['bars'], index: number, length: number): number => {
  const bar = bars[index];
  if (!bar) return 5;

  const { open, high, low, close, volume } = bar;
  const volumeSpread = volume * (high - low);
  const startIdx = Math.max(0, index - length + 1);
  let sumVolume = 0;
  let maxVolumeSpread = 0;

  for (let i = startIdx; i <= index; i++) {
    const currentBar = bars[i];
    if (!currentBar) continue;
    const currentSpread = currentBar.volume * (currentBar.high - currentBar.low);
    sumVolume += currentBar.volume;
    if (currentSpread > maxVolumeSpread) maxVolumeSpread = currentSpread;
  }

  const averageVolume = index - startIdx + 1 > 0 ? sumVolume / (index - startIdx + 1) : 0;
  if (volume >= 2 * averageVolume || volumeSpread >= maxVolumeSpread) {
    return close > open ? 1 : 0;
  }
  if (volume >= 1.5 * averageVolume) {
    return close > open ? 3 : 2;
  }
  return close > open ? 4 : 5;
};

const createPvsraCandlesPineJsStudy = ({ StudyInputType, StudyPlotType }: PineJsStudyRuntime) => ({
  name: 'PVSRA Candles',
  metainfo: {
    _metainfoVersion: 51,
    id: PvsraCandlesIndicator.fullId,
    description: 'PVSRA Candles',
    shortDescription: 'PVSRA Candles',
    isCustomIndicator: true,
    is_price_study: true,
    linkedToSeries: true,
    plots: [
      { id: 'plot_0', type: StudyPlotType.Line },
      { id: 'plot_1', type: StudyPlotType.Colorer, target: 'plot_0', palette: 'candleColors' },
      { id: 'plot_2', type: StudyPlotType.Line },
      { id: 'plot_3', type: StudyPlotType.Colorer, target: 'plot_2', palette: 'wickColors' },
      { id: 'plot_4', type: StudyPlotType.Line },
      { id: 'plot_5', type: StudyPlotType.Colorer, target: 'plot_4', palette: 'borderColors' },
    ],
    palettes: {
      candleColors: {
        colors: {
          red: { name: 'Red Vector Color' },
          green: { name: 'Green Vector Color' },
          violet: { name: 'Violet Vector Color' },
          blue: { name: 'Blue Vector Color' },
          regularUp: { name: 'Regular Candle Up Color' },
          regularDown: { name: 'Regular Candle Down Color' },
        },
      },
      wickColors: {
        colors: {
          red: { name: 'Red Vector Wick Color' },
          green: { name: 'Green Vector Wick Color' },
          violet: { name: 'Violet Vector Wick Color' },
          blue: { name: 'Blue Vector Wick Color' },
          regularUp: { name: 'Regular Candle Up Wick Color' },
          regularDown: { name: 'Regular Candle Down Wick Color' },
        },
      },
      borderColors: {
        colors: {
          red: { name: 'Red Vector Border Color' },
          green: { name: 'Green Vector Border Color' },
          violet: { name: 'Violet Vector Border Color' },
          blue: { name: 'Blue Vector Border Color' },
          regularUp: { name: 'Regular Candle Up Border Color' },
          regularDown: { name: 'Regular Candle Down Border Color' },
        },
      },
    },
    defaults: {
      palettes: {
        candleColors: {
          colors: {
            red: { color: '#FF0000', width: 1, style: 0 },
            green: { color: '#00FF00', width: 1, style: 0 },
            violet: { color: '#A020F0', width: 1, style: 0 },
            blue: { color: '#0000FF', width: 1, style: 0 },
            regularUp: { color: '#808080', width: 1, style: 0 },
            regularDown: { color: '#404040', width: 1, style: 0 },
          },
        },
        wickColors: {
          colors: {
            red: { color: '#FF0000', width: 1, style: 0 },
            green: { color: '#00FF00', width: 1, style: 0 },
            violet: { color: '#A020F0', width: 1, style: 0 },
            blue: { color: '#0000FF', width: 1, style: 0 },
            regularUp: { color: '#808080', width: 1, style: 0 },
            regularDown: { color: '#404040', width: 1, style: 0 },
          },
        },
        borderColors: {
          colors: {
            red: { color: '#FF0000', width: 1, style: 0 },
            green: { color: '#00FF00', width: 1, style: 0 },
            violet: { color: '#A020F0', width: 1, style: 0 },
            blue: { color: '#0000FF', width: 1, style: 0 },
            regularUp: { color: '#808080', width: 1, style: 0 },
            regularDown: { color: '#404040', width: 1, style: 0 },
          },
        },
      },
      styles: {
        plot_0: { visible: true },
        plot_2: { visible: true },
        plot_4: { visible: true },
      },
      precision: 4,
      inputs: {
        length: 10,
      },
    },
    styles: {
      plot_0: { title: 'Candles', histogramBase: 0 },
      plot_2: { title: 'Wicks', histogramBase: 0 },
      plot_4: { title: 'Borders', histogramBase: 0 },
    },
    inputs: [
      {
        id: 'length',
        name: 'Length',
        defval: 10,
        type: StudyInputType.Integer,
        min: 1,
        max: 100,
      },
    ],
    format: {
      type: 'price',
      precision: 4,
    },
  },
  constructor: emptyPineJsConstructor,
});

const createPvsraCombinedPineJsStudy = ({ StudyInputType, StudyPlotType }: PineJsStudyRuntime) => ({
  name: 'PVSRA Combined',
  metainfo: {
    _metainfoVersion: 51,
    id: PvsraCombinedIndicator.fullId,
    description: 'PVSRA Combined',
    shortDescription: 'PVSRA Combined',
    isCustomIndicator: true,
    is_price_study: true,
    linkedToSeries: true,
    plots: [
      { id: 'plot_0', type: StudyPlotType.Line },
      { id: 'plot_1', type: StudyPlotType.Colorer, target: 'plot_0', palette: 'barColors' },
      { id: 'plot_2', type: StudyPlotType.Line },
      { id: 'plot_3', type: StudyPlotType.Colorer, target: 'plot_2', palette: 'volumeColors' },
    ],
    palettes: {
      barColors: {
        colors: {
          red: { name: 'Red Vector Histogram Color' },
          green: { name: 'Green Vector Histogram Color' },
          violet: { name: 'Violet Vector Histogram Color' },
          blue: { name: 'Blue Vector Histogram Color' },
          regularUp: { name: 'Regular Candle Up Histogram Color' },
          regularDown: { name: 'Regular Candle Down Histogram Color' },
        },
      },
      volumeColors: {
        colors: {
          red: { name: 'Red Vector Histogram Color' },
          green: { name: 'Green Vector Histogram Color' },
          violet: { name: 'Violet Vector Histogram Color' },
          blue: { name: 'Blue Vector Histogram Color' },
          regularUp: { name: 'Regular Candle Up Histogram Color' },
          regularDown: { name: 'Regular Candle Down Histogram Color' },
        },
      },
    },
    defaults: {
      palettes: {
        barColors: {
          colors: {
            red: { color: '#FF0000', width: 1, style: 0 },
            green: { color: '#00FF00', width: 1, style: 0 },
            violet: { color: '#A020F0', width: 1, style: 0 },
            blue: { color: '#0000FF', width: 1, style: 0 },
            regularUp: { color: '#808080', width: 1, style: 0 },
            regularDown: { color: '#404040', width: 1, style: 0 },
          },
        },
        volumeColors: {
          colors: {
            red: { color: '#8B0000', width: 1, style: 0 },
            green: { color: '#228B22', width: 1, style: 0 },
            violet: { color: '#800080', width: 1, style: 0 },
            blue: { color: '#00008B', width: 1, style: 0 },
            regularUp: { color: '#808080', width: 1, style: 0 },
            regularDown: { color: '#404040', width: 1, style: 0 },
          },
        },
      },
      styles: {
        plot_0: { visible: true },
        plot_2: { visible: true },
      },
      precision: 2,
      inputs: {
        length: 10,
      },
    },
    styles: {
      plot_0: { title: 'Histogram', histogramBase: 0 },
      plot_2: { title: 'Volume', histogramBase: 0 },
    },
    inputs: [
      {
        id: 'length',
        name: 'Length',
        defval: 10,
        type: StudyInputType.Integer,
        min: 1,
        max: 100,
      },
    ],
    format: {
      type: 'volume',
      precision: 2,
    },
  },
  constructor: emptyPineJsConstructor,
});

const createPvsraHistogramPineJsStudy = ({ StudyInputType, StudyPlotType }: PineJsStudyRuntime) => ({
  name: 'PVSRA Histogram',
  metainfo: {
    _metainfoVersion: 51,
    id: PvsraHistogramIndicator.fullId,
    description: 'PVSRA Histogram',
    shortDescription: 'PVSRA Histogram',
    isCustomIndicator: true,
    is_price_study: true,
    linkedToSeries: true,
    plots: [
      { id: 'plot_0', type: StudyPlotType.Line },
      { id: 'plot_1', type: StudyPlotType.Colorer, target: 'plot_0', palette: 'histogramColors' },
    ],
    palettes: {
      histogramColors: {
        colors: {
          red: { name: 'Red Vector Histogram Color' },
          green: { name: 'Green Vector Histogram Color' },
          violet: { name: 'Violet Vector Histogram Color' },
          blue: { name: 'Blue Vector Histogram Color' },
          regularUp: { name: 'Regular Candle Up Histogram Color' },
          regularDown: { name: 'Regular Candle Down Histogram Color' },
        },
      },
    },
    defaults: {
      palettes: {
        histogramColors: {
          colors: {
            red: { color: '#8B0000', width: 1, style: 0 },
            green: { color: '#228B22', width: 1, style: 0 },
            violet: { color: '#800080', width: 1, style: 0 },
            blue: { color: '#00008B', width: 1, style: 0 },
            regularUp: { color: '#808080', width: 1, style: 0 },
            regularDown: { color: '#404040', width: 1, style: 0 },
          },
        },
      },
      styles: {
        plot_0: { visible: true },
      },
      precision: 2,
      inputs: {
        length: 10,
      },
    },
    styles: {
      plot_0: { title: 'Histogram', histogramBase: 0 },
    },
    inputs: [
      {
        id: 'length',
        name: 'Length',
        defval: 10,
        type: StudyInputType.Integer,
        min: 1,
        max: 100,
      },
    ],
    format: {
      type: 'volume',
      precision: 2,
    },
  },
  constructor: emptyPineJsConstructor,
});

export class PvsraCandlesIndicator extends BarsStudy {
  static fullId = 'Tealstreet-PvsraCandles@tv-basicstudies-1';
  static pineJsConfig: PineJsStudyFactory = createPvsraCandlesPineJsStudy;

  draw = ({ settings, ctx, candleCoords, bars }: StudyDrawArgs) => {
    if (candleCoords.length !== bars.length || candleCoords.length === 0 || bars.length === 0) {
      return;
    }

    const isWicksVisible = getSettingBool(settings, 'showWicks', true);
    const isBordersVisible = getSettingBool(settings, 'showBorders', true);
    const length = getSettingNumber(settings, 'length', 10);

    const candlePalette = [
      getSettingString(settings, 'palette_candleRed', '#FF0000'),
      getSettingString(settings, 'palette_candleGreen', '#00FF00'),
      getSettingString(settings, 'palette_candleViolet', '#A020F0'),
      getSettingString(settings, 'palette_candleBlue', '#0000FF'),
      getSettingString(settings, 'palette_candleRegularUp', '#808080'),
      getSettingString(settings, 'palette_candleRegularDown', '#404040'),
    ];

    const wickPalette = [
      getSettingString(settings, 'palette_wickRed', '#FF0000'),
      getSettingString(settings, 'palette_wickGreen', '#00FF00'),
      getSettingString(settings, 'palette_wickViolet', '#A020F0'),
      getSettingString(settings, 'palette_wickBlue', '#0000FF'),
      getSettingString(settings, 'palette_wickRegularUp', '#808080'),
      getSettingString(settings, 'palette_wickRegularDown', '#404040'),
    ];

    const borderPalette = [
      getSettingString(settings, 'palette_borderRed', '#FF0000'),
      getSettingString(settings, 'palette_borderGreen', '#00FF00'),
      getSettingString(settings, 'palette_borderViolet', '#A020F0'),
      getSettingString(settings, 'palette_borderBlue', '#0000FF'),
      getSettingString(settings, 'palette_borderRegularUp', '#808080'),
      getSettingString(settings, 'palette_borderRegularDown', '#404040'),
    ];

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const coordBar = candleCoords[i];
      if (!bar || !coordBar) continue;

      const colorIdx = getPvsraColorIndex(bars, i, length);
      const fillColor = candlePalette[colorIdx];
      const wickColor = wickPalette[colorIdx];
      const borderColor = borderPalette[colorIdx];

      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      const bodyTop = Math.min(coordBar.top, coordBar.bottom);
      const bodyHeight = Math.abs(coordBar.top - coordBar.bottom);
      ctx.fillRect(coordBar.left, bodyTop, coordBar.candleWidth, bodyHeight);

      if (isBordersVisible) {
        ctx.strokeRect(coordBar.left, bodyTop, coordBar.candleWidth, bodyHeight);
      }

      if (isWicksVisible) {
        ctx.strokeStyle = wickColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(coordBar.center, coordBar.high);
        ctx.lineTo(coordBar.center, coordBar.low);
        ctx.stroke();
      }

      ctx.restore();
    }
  };
}

export class PvsraCombinedIndicator extends BarsStudy {
  static fullId = 'Tealstreet-PvsraCombined@tv-basicstudies-1';
  static pineJsConfig: PineJsStudyFactory = createPvsraCombinedPineJsStudy;

  draw = ({ settings, ctx, candleCoords, bars, chartHeight }: StudyDrawArgs) => {
    if (candleCoords.length !== bars.length || candleCoords.length === 0 || bars.length === 0) {
      return;
    }

    const showVolume = getSettingBool(settings, 'showVolume', true);
    const length = getSettingNumber(settings, 'length', 10);

    const barPalette = [
      getSettingString(settings, 'palette_barRed', '#FF0000'),
      getSettingString(settings, 'palette_barGreen', '#00FF00'),
      getSettingString(settings, 'palette_barViolet', '#A020F0'),
      getSettingString(settings, 'palette_barBlue', '#0000FF'),
      getSettingString(settings, 'palette_barRegularUp', '#808080'),
      getSettingString(settings, 'palette_barRegularDown', '#404040'),
    ];

    const volumePalette = [
      getSettingString(settings, 'palette_volumeRed', '#8B0000'),
      getSettingString(settings, 'palette_volumeGreen', '#228B22'),
      getSettingString(settings, 'palette_volumeViolet', '#800080'),
      getSettingString(settings, 'palette_volumeBlue', '#00008B'),
      getSettingString(settings, 'palette_volumeRegularUp', '#808080'),
      getSettingString(settings, 'palette_volumeRegularDown', '#404040'),
    ];

    for (let i = 0; i < bars.length; i++) {
      const coordBar = candleCoords[i];
      if (!bars[i] || !coordBar) continue;

      const fillColor = barPalette[getPvsraColorIndex(bars, i, length)];
      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      const bodyTop = Math.min(coordBar.top, coordBar.bottom);
      const bodyHeight = Math.abs(coordBar.top - coordBar.bottom);
      ctx.fillRect(coordBar.left, bodyTop, coordBar.candleWidth, bodyHeight);
      ctx.strokeRect(coordBar.left, bodyTop, coordBar.candleWidth, bodyHeight);
      ctx.restore();
    }

    if (!showVolume) return;

    let maxVolume = -Infinity;
    for (const bar of bars) {
      const volume = Math.abs(bar.volume);
      if (volume > maxVolume) maxVolume = volume;
    }
    if (maxVolume <= 0) return;

    const histHeight = chartHeight * 0.1;
    const histBaseY = chartHeight - histHeight;

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const coordBar = candleCoords[i];
      if (!bar || !coordBar) continue;

      const h = (Math.abs(bar.volume) / maxVolume) * histHeight;
      const fillColor = volumePalette[getPvsraColorIndex(bars, i, length)];
      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.fillRect(coordBar.left, histBaseY + (histHeight - h), coordBar.candleWidth, h);
      ctx.restore();
    }
  };
}

export class PvsraHistogramIndicator extends BarsStudy {
  static fullId = 'Tealstreet-PvsraHistogram@tv-basicstudies-1';
  static pineJsConfig: PineJsStudyFactory = createPvsraHistogramPineJsStudy;

  draw = ({ settings, ctx, candleCoords, bars, chartHeight }: StudyDrawArgs) => {
    if (candleCoords.length !== bars.length || candleCoords.length === 0 || bars.length === 0) {
      return;
    }

    const length = getSettingNumber(settings, 'length', 10);
    const histogramPalette = [
      getSettingString(settings, 'palette_histogramRed', '#8B0000'),
      getSettingString(settings, 'palette_histogramGreen', '#228B22'),
      getSettingString(settings, 'palette_histogramViolet', '#800080'),
      getSettingString(settings, 'palette_histogramBlue', '#00008B'),
      getSettingString(settings, 'palette_histogramRegularUp', '#808080'),
      getSettingString(settings, 'palette_histogramRegularDown', '#404040'),
    ];

    let maxVolume = -Infinity;
    for (const bar of bars) {
      const volume = Math.abs(bar.volume);
      if (volume > maxVolume) maxVolume = volume;
    }
    if (maxVolume <= 0) return;

    const histHeight = chartHeight * 0.1;
    const histBaseY = chartHeight - histHeight;

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const coordBar = candleCoords[i];
      if (!bar || !coordBar) continue;

      const h = (Math.abs(bar.volume) / maxVolume) * histHeight;
      const fillColor = histogramPalette[getPvsraColorIndex(bars, i, length)];
      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.fillRect(coordBar.left, histBaseY + (histHeight - h), coordBar.candleWidth, h);
      ctx.restore();
    }
  };
}

export const pvsraPineJsStudyConfigs: PineJsStudyFactory[] = [
  PvsraCombinedIndicator.pineJsConfig,
  PvsraCandlesIndicator.pineJsConfig,
  PvsraHistogramIndicator.pineJsConfig,
];
