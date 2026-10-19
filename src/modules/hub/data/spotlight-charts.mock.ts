import type { SpotlightChartPoint } from "../types";

export const DOTA_CHART_WINDOWS: Record<string, SpotlightChartPoint[]> = {
  "24H": [
    { day: "00:00", floor: 114.2, metric: 52.8 },
    { day: "04:00", floor: 115.0, metric: 53.0 },
    { day: "08:00", floor: 116.1, metric: 53.2 },
    { day: "12:00", floor: 117.4, metric: 53.5 },
    { day: "16:00", floor: 117.9, metric: 53.6 },
    { day: "20:00", floor: 118.2, metric: 53.7 },
    { day: "Now", floor: 118.5, metric: 53.8 },
  ],
  "7D": [
    { day: "Day 1", floor: 104.2, metric: 49.7 },
    { day: "Day 2", floor: 105.8, metric: 50.2 },
    { day: "Day 3", floor: 107.4, metric: 50.9 },
    { day: "Day 4", floor: 110.1, metric: 51.5 },
    { day: "Day 5", floor: 113.6, metric: 52.3 },
    { day: "Day 6", floor: 116.2, metric: 53.0 },
    { day: "Day 7", floor: 118.5, metric: 53.8 },
  ],
  "30D": [
    { day: "W1", floor: 94.0, metric: 47.8 },
    { day: "W2", floor: 98.5, metric: 48.9 },
    { day: "W3", floor: 106.2, metric: 51.0 },
    { day: "W4", floor: 118.5, metric: 53.8 },
  ],
};

export const CS2_CHART_WINDOWS: Record<string, SpotlightChartPoint[]> = {
  "24H": [
    { day: "00:00", floor: 5140, metric: 60.1 },
    { day: "04:00", floor: 5155, metric: 60.3 },
    { day: "08:00", floor: 5170, metric: 60.5 },
    { day: "12:00", floor: 5185, metric: 60.7 },
    { day: "16:00", floor: 5195, metric: 60.9 },
    { day: "Now", floor: 5200, metric: 61.0 },
  ],
  "7D": [
    { day: "Day 1", floor: 4820, metric: 55.0 },
    { day: "Day 2", floor: 4890, metric: 56.1 },
    { day: "Day 3", floor: 4950, metric: 57.2 },
    { day: "Day 4", floor: 5030, metric: 58.4 },
    { day: "Day 5", floor: 5100, metric: 59.3 },
    { day: "Day 6", floor: 5160, metric: 60.2 },
    { day: "Day 7", floor: 5200, metric: 61.0 },
  ],
  "30D": [
    { day: "W1", floor: 4500, metric: 52.0 },
    { day: "W2", floor: 4680, metric: 54.5 },
    { day: "W3", floor: 4920, metric: 57.8 },
    { day: "W4", floor: 5200, metric: 61.0 },
  ],
};

export const CROSS_CHART_WINDOWS: Record<string, SpotlightChartPoint[]> = {
  "24H": [
    { day: "00:00", floor: 107.0, metric: 103.5 },
    { day: "06:00", floor: 108.2, metric: 104.2 },
    { day: "12:00", floor: 109.5, metric: 105.0 },
    { day: "Now", floor: 110.5, metric: 105.8 },
  ],
  "7D": [
    { day: "Day 1", floor: 100.0, metric: 98.2 },
    { day: "Day 2", floor: 101.4, metric: 99.0 },
    { day: "Day 3", floor: 103.0, metric: 100.5 },
    { day: "Day 4", floor: 104.5, metric: 101.2 },
    { day: "Day 5", floor: 106.0, metric: 102.8 },
    { day: "Day 6", floor: 108.2, metric: 104.1 },
    { day: "Day 7", floor: 110.5, metric: 105.8 },
  ],
  "30D": [
    { day: "W1", floor: 95.0, metric: 92.0 },
    { day: "W2", floor: 98.0, metric: 95.5 },
    { day: "W3", floor: 104.0, metric: 101.0 },
    { day: "W4", floor: 110.5, metric: 105.8 },
  ],
};
