import { useEffect, useRef } from "react";
import * as echarts from "echarts";

type Props = {
  monthlyValues: number[]; // length 12
  title?: string;
};

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function RspChart({ monthlyValues, title }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!chartRef.current) {
      chartRef.current = echarts.init(ref.current);
    }
    const option: echarts.EChartsOption = {
      title: {
        text: title || "",
        left: "center",
        top: 8,
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      xAxis: {
        type: "category",
        data: months,
      },
      yAxis: {
        type: "value",
        name: "RSP",
        min: 0,
      },
      series: [
        {
          name: "Monthly Average RSP",
          type: "bar",
          data: monthlyValues,
          barMaxWidth: 40,
          label: { show: false },
        },
      ],
      grid: { left: 40, right: 20, bottom: 40, top: 60 },
    };

    chartRef.current.setOption(option);
    function handleResize() {
      chartRef.current?.resize();
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [monthlyValues, title]);

  return <div ref={ref} style={{ width: "100%", height: 420 }} />;
}
