import { FC } from "react";
import { Measurement } from "src/common/model/measure";
import styles from "./charts.module.css";
import { Chart } from "./components/chart/chart";

type Props = {
  measurementsList: Measurement[];
  error?: string;
  updateMeasures: (measures: Measurement) => void;
};

const Charts: FC<Props> = ({ measurementsList, error, updateMeasures }) => {
  return (
    <section className={styles.container}>
      {error && <span>{error}</span>}
      {measurementsList.map((measurement, index) => (
        <Chart
          index={index}
          key={measurement.name}
          measurement={measurement}
          updateMeasures={updateMeasures}
        />
      ))}
    </section>
  );
};

export { Charts };
