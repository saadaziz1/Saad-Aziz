'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
  UTCTimestamp,
  CandlestickData,
  HistogramData,
  ISeriesApi,
} from 'lightweight-charts';

interface TradingChartProps {
  type: 'candlestick' | 'histogram';
  data: any[];
  currentPrice: number;
  interval: '1m' | '1h' | '4h' | '1d';
}

export default function TradingChart({
  type,
  data,
  currentPrice,
  interval,
}: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Histogram'> | null>(null);
  const lastCandleRef = useRef<CandlestickData<UTCTimestamp> | null>(null);

  /* ---------------- Chart Init ---------------- */
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: {
          type: ColorType.Solid,
          color: 'transparent', // 🔥 inherit theme
        },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: 'rgba(55,65,81,0.3)' },
        horzLines: { color: 'rgba(55,65,81,0.3)' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.15, bottom: 0.15 },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        rightBarStaysOnScroll: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      autoSize: true,
      height: 320,
    });

    const series =
      type === 'candlestick'
        ? chart.addSeries(CandlestickSeries, {
            upColor: '#10B981',
            downColor: '#EF4444',
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
            borderUpColor: '#10B981',
            borderDownColor: '#EF4444',
          })
        : chart.addSeries(HistogramSeries, {
            color: '#10B981',
            priceFormat: { type: 'volume' },
          });

    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver(() => {
      chart.timeScale().fitContent();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [type]);

  /* ---------------- Historical Data ---------------- */
  useEffect(() => {
    if (!seriesRef.current || !data?.length) return;

    if (type === 'candlestick') {
      const candles: CandlestickData<UTCTimestamp>[] = data.map((d) => ({
        time: Math.floor(d.timestamp / 1000) as UTCTimestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      seriesRef.current.setData(candles);
      lastCandleRef.current = candles[candles.length - 1];
      chartRef.current.timeScale().fitContent(); // 🔥 fit candles
    } else {
      const volumes: HistogramData<UTCTimestamp>[] = data.map((d) => ({
        time: Math.floor(d.timestamp / 1000) as UTCTimestamp,
        value: d.volume || Math.random() * 10000000 + 1000000,
      }));

      console.log('Setting histogram data:', volumes.slice(0, 3));
      seriesRef.current.setData(volumes);
      chartRef.current.timeScale().fitContent();
    }
  }, [data, type]);

  /* ---------------- Live Candle Update ---------------- */
  useEffect(() => {
    if (type !== 'candlestick' || !lastCandleRef.current) return;

    const price = currentPrice;
    if (!price) return;

    const candle: CandlestickData<UTCTimestamp> = {
      ...lastCandleRef.current,
      high: Math.max(lastCandleRef.current.high, price),
      low: Math.min(lastCandleRef.current.low, price),
      close: price,
    };

    (seriesRef.current as ISeriesApi<'Candlestick'>).update(candle);
    lastCandleRef.current = candle;
  }, [currentPrice, type]);

  /* ---------------- New Candle Per Interval ---------------- */
  useEffect(() => {
    if (type !== 'candlestick') return;

    const ms = getIntervalMs(interval);
    const timer = setInterval(() => {
      if (!lastCandleRef.current) return;

      const now = Date.now();
      const start = Math.floor(now / ms) * ms;
      const last = lastCandleRef.current.time * 1000;

      if (start > last) {
        const price = currentPrice;
        if (!price) return;

        const newCandle: CandlestickData<UTCTimestamp> = {
          time: Math.floor(start / 1000) as UTCTimestamp,
          open: price,
          high: price,
          low: price,
          close: price,
        };

        (seriesRef.current as ISeriesApi<'Candlestick'>).update(newCandle);
        lastCandleRef.current = newCandle;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [interval, currentPrice, type]);

  return <div ref={containerRef} className="w-full h-80" />;
}

/* ---------------- Helpers ---------------- */
function getIntervalMs(interval: string): number {
  return {
    '1m': 60_000,
    '1h': 3_600_000,
    '4h': 14_400_000,
    '1d': 86_400_000,
  }[interval]!;
}
