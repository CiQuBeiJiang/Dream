export interface TimeFilter {
  brightness: number;
  sepia: number;
  saturate: number;
  hueRotate: number;
}

export function getTimeFilter(sliderValue: number): TimeFilter {
  if (sliderValue <= 0.15) {
    const t = sliderValue / 0.15;
    return { brightness: 0.7 + t * 0.3, sepia: 0.3 - t * 0.3, saturate: 1, hueRotate: -30 + t * 15 };
  } else if (sliderValue <= 0.35) {
    const t = (sliderValue - 0.15) / 0.2;
    return { brightness: 1 + t * 0.1, sepia: 0, saturate: 1 + t * 0.06, hueRotate: -15 + t * 15 };
  } else if (sliderValue <= 0.55) {
    const t = (sliderValue - 0.35) / 0.2;
    return { brightness: 1.1 - t * 0.06, sepia: 0, saturate: 1.06, hueRotate: 0 };
  } else if (sliderValue <= 0.75) {
    const t = (sliderValue - 0.55) / 0.2;
    return { brightness: 0.9 - t * 0.3, sepia: t * 0.3, saturate: 1.06 - t * 0.06, hueRotate: -15 - t * 10 };
  } else {
    const t = (sliderValue - 0.75) / 0.25;
    return { brightness: 0.4 - t * 0.07, sepia: 0, saturate: 0.8, hueRotate: 0 };
  }
}
