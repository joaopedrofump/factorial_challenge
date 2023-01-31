import { Measure } from "src/common/model/measure";
import styles from "./custom-tooltip.module.css";

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Measure }[];
}) => {
  if (active && payload && payload.length > 0) {
    const measure = payload[0].payload;

    return (
      <div className={styles.tooltip}>
        <p>Value read: {measure.value}</p>
        <p>Timestamp: {new Date(measure.timestamp).toISOString()}</p>
      </div>
    );
  }

  return null;
};

export { CustomTooltip };
