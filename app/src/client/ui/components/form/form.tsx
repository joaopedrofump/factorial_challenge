import React, { FC, useRef } from "react";
import { getMeasure, saveMeasure } from "src/client/service/measure-service";
import { Measurement } from "src/common/model/measure";

import styles from "./form.module.css";

type Props = {
  updateMeasures: (measurement: Measurement) => void;
  hcMeasurement?: string;
  title?: string;
  valuePlaceHolder?: string;
  elevated?: boolean;
};

const Form: FC<Props> = ({
  updateMeasures,
  hcMeasurement,
  title,
  valuePlaceHolder,
  elevated,
}) => {
  const measurementRef = useRef<HTMLInputElement | null>(null);
  const valueRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const measurement = measurementRef?.current?.value as string;
    const value = valueRef?.current?.value as string;

    await saveMeasure(measurement, parseFloat(value));
    const updatedMeasurement = await getMeasure(measurement);

    updateMeasures(updatedMeasurement);
    (valueRef.current as HTMLInputElement).value = "";
  };

  return (
    <section className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <form
        onSubmit={handleSubmit}
        className={`${styles.form} ${elevated ? styles.paper : ""}`}
      >
        <input
          placeholder="metric*"
          required
          hidden={typeof hcMeasurement !== "undefined"}
          ref={measurementRef}
          type="text"
          {...(typeof hcMeasurement !== "undefined" && {
            readOnly: true,
            value: hcMeasurement,
          })}
        ></input>
        <input
          step={0.1}
          placeholder={valuePlaceHolder ?? "value*"}
          required
          ref={valueRef}
          type="number"
        ></input>
        <input type="submit" value="save" />
      </form>
    </section>
  );
};

export { Form };
