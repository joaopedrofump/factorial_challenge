import { FC } from "react";
import {
  Area,
  AreaChart, ResponsiveContainer,
  Tooltip
} from "recharts";
import { theme } from "src/client/theme";
import { Form } from "src/client/ui/components/form/form";
import { Measure, Measurement } from "src/common/model/measure";
import styles from "./chart.module.css";
import { CustomTooltip } from "./components/custom-tooltip";

type Props = {
  measurement: Measurement;
  index: number;
  updateMeasures: (measures: Measurement) => void;
};

const Chart: FC<Props> = ({
  measurement: { measures, name, mean },
  index,
  updateMeasures,
}) => {
  const color =
    index % 2 === 0 ? theme.colors.primaryColor : theme.colors.secondaryColor;

  return (
    <article id="app-title" className={styles.container}>
      <div className={styles.chartHeader}>
        <h3 className={styles.title}>{name}</h3>
        <div>
          {mean && (
            <ul className={styles.means}>
              {mean.lastMin && (
                <li>
                   <div className={styles.popover}>
                      Last Minute Mean
                    </div>
                  <div className={`${styles.dot} ${styles.dotMin}`}>
                    <div />
                  </div>
                  <span>{mean.lastMin.toFixed(1)}</span>
                </li>
              )}
              {mean.lastHour && (
                <li>
                   <div className={styles.popover}>
                      Last Hour Mean
                    </div>
                  <div className={`${styles.dot} ${styles.dotHour}`}>
                    <div />
                  </div>
                  <span>{mean.lastHour.toFixed(1)}</span>
                </li>
              )}
              {mean.lastDay && (
                <li>
                   <div className={styles.popover}>
                      Last Day Mean
                    </div>
                  <div className={`${styles.dot} ${styles.dotDay}`}>
                    <div />
                  </div>
                  <span>{mean.lastDay.toFixed(1)}</span>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="95%" height={200}>
          <AreaChart
            data={measures}
            margin={{
              top: 0,
              right: 7,
              left: 7,
              bottom: 0,
            }}
          >
            <Tooltip content={<CustomTooltip />} />
            <Area type="natural" dataKey="value" strokeWidth={0} fill={color} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.chartFooter}>
        <Form
          updateMeasures={updateMeasures}
          hcMeasurement={name}
          valuePlaceHolder="add more"
        />
      </div>
    </article>
  );
};



export { Chart };
