import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
} from "chart.js";

// Registering chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  BarElement,
  zoomPlugin
);

interface ISalesGraphProps {
  revenueByMonth: { date: string; revenue: number; orderCount: number }[];
}
interface ISalesData {
  date: string;
  revenue: number;
  orderCount: number;
}

const SalesGraph: React.FC<ISalesGraphProps> = ({ revenueByMonth }) => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [filteredData, setFilteredData] = useState<ISalesData[]>([]);
  const salesData: ISalesData[] = revenueByMonth;

  const groupByDate = (
    data: ISalesData[],
    key: (date: string) => string
  ): Record<string, ISalesData> => {
    return data.reduce((acc: Record<string, ISalesData>, curr: ISalesData) => {
      const dateKey = key(curr.date);
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, revenue: 0, orderCount: 0 };
      }
      acc[dateKey].revenue += curr.revenue;
      acc[dateKey].orderCount += curr.orderCount;
      return acc;
    }, {});
  };

  const filterWeekly = (data: ISalesData[]): Record<string, ISalesData> => {
    return groupByDate(data, (date) => {
      const d = new Date(date);
      d.setDate(d.getDate() - d.getDay()); // Start of the week (Sunday)
      return d.toISOString().split("T")[0];
    });
  };

  const filterMonthly = (data: ISalesData[]): Record<string, ISalesData> => {
    return groupByDate(data, (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}`; // Year and month
    });
  };

  const filterYearly = (data: ISalesData[]): Record<string, ISalesData> => {
    return groupByDate(data, (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}`; // Year
    });
  };

  useEffect(() => {
    let result: ISalesData[] = [];
    if (timeFrame === "daily") result = salesData;
    else if (timeFrame === "weekly")
      result = Object.values(filterWeekly(salesData));
    else if (timeFrame === "monthly")
      result = Object.values(filterMonthly(salesData));
    else if (timeFrame === "yearly")
      result = Object.values(filterYearly(salesData));

    setFilteredData(result);
  }, [timeFrame, salesData]);
  // Prepare the data for Chart.js
  const chartData = {
    labels: filteredData.map((item: any) => item.date), // Labels are the months
    datasets: [
      {
        label: "Revenue",
        data: filteredData.map((item: any) => item.revenue), // Revenue data for each month
        borderColor: "rgb(161, 32, 255, 1)",
        backgroundColor: "rgb(161, 32, 255, 0.2)",
        fill: true,
        tension: 0.4,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      zoom: {
        zoom: {
          wheel: { enabled: true }, // Enable zooming with the mouse wheel
          pinch: { enabled: true }, // Enable zooming with touch gestures
          mode: "x" as const, // Zoom on x-axis
        },
        pan: {
          enabled: true,
          mode: "x" as const, // Pan on x-axis
        },
      },
      title: {
        display: true,
        text: `Sales Revenue (${timeFrame})`,
      },

      tooltip: {
        enabled: true, // Enable tooltips
        callbacks: {
          // Custom tooltip label
          label: function (tooltipItem: any) {
            const { dataIndex } = tooltipItem;
            const data = filteredData[dataIndex];
            const revenue = data.revenue;
            const count = data.orderCount;

            // You can customize the tooltip data here
            return `Revenue: ₹${revenue.toFixed(2)} | Order Nos: ${count}`;
          },
          // Custom tooltip title (optional)
          title: function (tooltipItem: any) {
            return `Sales Data (${tooltipItem[0].label})`; // Customize the title
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 10,
          callback: (value: string | number) => {
            if (typeof value === "number") {
              return `₹${value}`;
            }
            return value;
          },
        },
      },
    },
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Sales Revenue Analytics
      </h2>
      <div className="h-72 rounded-lg items-center justify-center border p-1">
        {/* Dropdown to select the time frame */}
        <div className="mb-4 place-self-end ">
          <label htmlFor="timeFrame" className="mr-2 font-medium text-xs">
            Time Frame:
          </label>
          <select
            id="timeFrame"
            value={timeFrame}
            onChange={(e) => {
              const frame = e.target.value;
              setTimeFrame(frame);
            }}
            className="border rounded px-2 py-1 text-xs"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* <Line data={chartData} options={options} /> */}

        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesGraph;
