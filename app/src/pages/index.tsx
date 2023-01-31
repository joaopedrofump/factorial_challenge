import Head from "next/head";

import { RiDashboard3Fill } from "react-icons/ri";

import styles from "@/pages/index.module.css";
import { useEffect, useState } from "react";
import { getAllMeasures } from "src/client/service/measure-service";
import { theme } from "src/client/theme";
import { Charts } from "src/client/ui/components/charts/charts";
import { Form } from "src/client/ui/components/form/form";
import { Measurement } from "src/common/model/measure";

export default function Home() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [error, setError] = useState("");

  const updateMeasures = (measurement: Measurement) => {
    const index = measurements.findIndex(
      ({ name }) => name === measurement.name
    );

    setMeasurements((prev) => {
      if (index === -1) {
        return [...prev, measurement];
      }

      const updated = [...prev];
      updated[index] = measurement;
      return updated;
    });
  };

  useEffect(() => {
    getAllMeasures()
      .then((result) => {
        setMeasurements(result);
      })

      .catch((err) => {
        setError(err);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.top}>
          <div className={styles.titlewraper}>
            <RiDashboard3Fill
              color={theme.colors.secondaryColor}
              size="1.5rem"
            />
            <h1 className={styles.title}>Factorial Dashboard</h1>
          </div>
          <div className={styles.formContainer}>
            <Form
              title="New Measure"
              updateMeasures={updateMeasures}
              elevated
            />
          </div>
        </div>
          <Charts
            error={error}
            measurementsList={measurements}
            updateMeasures={updateMeasures}
          />
      </main>

      <footer className={styles.footer}>
        <span>Powered by&nbsp;</span>
        <a
          href="https://joaopedrofurriel.pt"
          target="_blank"
          rel="noopener noreferrer"
        >
          João Pedro Furriel
        </a>
      </footer>
    </div>
  );
}
