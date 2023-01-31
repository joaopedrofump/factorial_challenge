type Measurement = {
  name: string;
  measures: Measure[];
  mean?: {
    lastMin?: number;
    lastHour?: number;
    lastDay?: number;
  };
};

class Measure {
  value: number;
  measurement: string;
  timestamp: string;

  constructor({
    _value,
    _measurement,
    _time,
  }: {
    _value: number;
    _measurement: string;
    _time: string;
  }) {
    this.value = _value;
    this.measurement = _measurement;
    this.timestamp = _time;
  }
}

export { Measure };
export type { Measurement };
