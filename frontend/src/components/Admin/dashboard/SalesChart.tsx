import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
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
  BarElement
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
  const salesData = revenueByMonth;

  const filterData = (frame: string, data: ISalesData[] = salesData) => {
    const groupedData: ISalesData[] = [];
    const today = new Date();

    // Create a copy of the data to avoid modifying the original array
    const dataCopy = JSON.parse(JSON.stringify(data));

    if (frame === "daily") {
      dataCopy.forEach((item: any) => {
        const itemDate = new Date(item.date);
        if (
          itemDate.getDate() === today.getDate() &&
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear()
        ) {
          groupedData.push(item);
        }
      });
    } else if (frame === "weekly") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)

      dataCopy.forEach((item: any) => {
        const itemDate = new Date(item.date);
        if (itemDate >= startOfWeek && itemDate <= today) {
          groupedData.push(item);
        }
      });

      // Adjust the date format for the weekly range
      groupedData.forEach((item) => {
        const itemDate = new Date(item.date);
        const startOfWeek = new Date(itemDate);
        startOfWeek.setDate(itemDate.getDate() - itemDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week (Saturday)
        item.date = `${startOfWeek.toLocaleDateString()} to ${endOfWeek.toLocaleDateString()}`;
      });
    } else if (frame === "monthly") {
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      dataCopy.forEach((item: any) => {
        const itemDate = new Date(item.date);
        if (
          itemDate.getMonth() === currentMonth &&
          itemDate.getFullYear() === currentYear
        ) {
          groupedData.push(item);
        }
      });

      // Adjust the date format for the month
      groupedData.forEach((item) => {
        const itemDate = new Date(item.date);
        item.date = itemDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
      });
    } else if (frame === "yearly") {
      const currentYear = today.getFullYear();

      dataCopy.forEach((item: any) => {
        const itemDate = new Date(item.date);
        if (itemDate.getFullYear() === currentYear) {
          groupedData.push(item);
        }
      });

      // Adjust the date format for the year
      groupedData.forEach((item) => {
        const itemDate = new Date(item.date);
        item.date = itemDate.getFullYear().toString();
      });
    }

    // Set the filtered data
    setFilteredData(groupedData);
  };
  // Prepare the data for Chart.js
  const chartData = {
    labels: filteredData.map((item: any) => item.date), // Labels are the months
    datasets: [
      {
        label: "Revenue",
        data: filteredData.map((item: any) => item.revenue), // Revenue data for each month
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Sales Revenue (${timeFrame})`,
      },

      tooltip: {
        enabled: true, // Enable tooltips
        callbacks: {
          // Custom tooltip label
          label: function (tooltipItem: any) {
            const { datasetIndex, dataIndex } = tooltipItem;
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

  useEffect(() => {
    filterData(timeFrame);
  }, [timeFrame]);

  useEffect(() => {
    console.log("Filtered Data:", filteredData);
    console.log("revenue Data:", revenueByMonth);
  }, [filteredData]);

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
