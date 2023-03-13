import { useSelector } from "react-redux";
import { ChartData, ChartDataset, ChartOptions } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { getColorTheme } from "store/core/getters";

import styles from "./Chart.module.scss";

interface Props {
  type?: "bar" | "doughnut";
  label?: string;
  labels: string[];
  data: number[];
  colors?: string[];
  options?: ChartOptions;
  maxWidth?: number;
  padding?: number;
}

export const ChartWrapper = ({
  data,
  label = "",
  labels,
  options = {},
  colors = ["#50a3a5", "#EB5233", "#D1D4D9"],
  type = "bar",
  maxWidth = 150,
  padding = 20,
}: Props) => {
  const theme = useSelector(getColorTheme);
  const calculatedW = labels?.length * 25;
  const width =
    (calculatedW && calculatedW > maxWidth ? maxWidth : calculatedW) +
    padding * 1.5;
  const sum = data.reduce((a: number, b: number) => a + b);

  const textColor = theme === "light" ? "#000" : "#e2e5e9";
  const borderColor = theme === "light" ? "#fff" : "#1a1e23";

  const datalabels: any = {
    color: textColor,
    align: "end",
    anchor: "end",
    offset: 4,
    font: {
      size: 8,
      family: "Inter, Roboto, Helvetica",
    },
    formatter: (value: number) => {
      if (!sum) return value;
      const percent = ((value / (sum as number)) * 100).toFixed(0);
      return percent + "%";
    },
  };

  switch (type) {
    case "bar":
      const barOptions = {
        layout: {
          padding: {
            top: 20,
            left: 10,
          },
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true,
          },
          x: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        animations: {
          colors: {
            duration: 0,
          },
        },
        plugins: {
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
          datalabels,
        },
      };
      return (
        <div style={{ width }} className={styles.Wrapper}>
          <Bar
            height={120}
            width={100}
            plugins={[ChartDataLabels] as any}
            data={{
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: colors,
                  borderColor,
                  barPercentage: 1,
                  categoryPercentage: 1,
                  borderRadius: 6,
                  borderWidth: 2,
                },
              ],
            }}
            options={{ ...barOptions, ...options }}
          />
        </div>
      );
    case "doughnut":
      const doughnutOptions = {
        cutout: 19,
        layout: {
          padding: 20,
        },
        stroke: {
          width: 10,
        },
        responsive: true,
        maintainAspectRatio: false,
        animations: {
          colors: {
            duration: 0,
          },
        },
        plugins: {
          datalabels,
          tooltip: {
            enabled: false,
          },
          legend: {
            display: false,
          },
        },
      };
      return (
        <div style={{ width: 150 }} className={styles.Wrapper}>
          <Doughnut
            height={150}
            width={150}
            plugins={[ChartDataLabels] as any}
            data={{
              labels,
              datasets: [
                {
                  data,
                  label,
                  backgroundColor: colors,
                  // borderAligh: "inner",
                  borderWidth: 4,
                  borderColor, // set after defining a context
                },
              ],
            }}
            options={{ ...doughnutOptions, ...options }}
          />
        </div>
      );
    default:
      return null;
  }
};
