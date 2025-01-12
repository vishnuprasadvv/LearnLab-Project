import { getJoinedUsersDataApi } from '@/api/adminApi';
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS , Tooltip, BarElement } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(zoomPlugin, Tooltip, BarElement)
type TTimeline = 'daily' | 'weekly' | 'monthly' | 'yearly';
type TData = {
    count: number,
    date: Date
}

const UserRegistrationChart:React.FC = () => {
    const [timeFrame, setTimeFrame] = useState<TTimeline>('monthly')
    const [filteredData, setFilteredData] = useState<TData[]>([])

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await getJoinedUsersDataApi(timeFrame)
                setFilteredData(response.data)
            } catch (error) {
                console.error('error fetching userRegisterData', error)
            }
        }

        fetchData()
    },[timeFrame])

    // Prepare the data for Chart.js
  const chartData = {
    labels: filteredData.map((item: any) => item.date), // Labels are the months
    datasets: [
      {
        label: "Users count",
        data: filteredData.map((item: any) => item.count), // Revenue data for each month
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
        maintainAspectRatio:true,
        plugins: {
          zoom: {
            zoom: {
              wheel: { enabled: true }, // Enable zooming with the mouse wheel
              pinch: { enabled: true }, // Enable zooming with touch gestures
              mode: 'x' as const, // Zoom on x-axis
            },
            pan: {
              enabled: true,
              mode: 'x' as const, // Pan on x-axis
            },
          },
          title: {
            display: true,
            text: `Joined users count (${timeFrame})`,
          },
    
          tooltip: {
            enabled: true, // Enable tooltips
            callbacks: {
              // Custom tooltip label
              label: function (tooltipItem: any) {
                const { dataIndex } = tooltipItem;
                const data = filteredData[dataIndex];
    
                // You can customize the tooltip data here
                return `Joined count: ${data.count}`;
              },
              // Custom tooltip title (optional)
              title: function (tooltipItem: any) {
                return `${tooltipItem[0].label}`; // Customize the title
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
                  return `${value}`;
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
           User Registration Analytics
          </h2>
        <div className="h-72 rounded-lg items-center justify-center border p-1">
    
            {/* Dropdown to select the time frame */}
            <div className="mb-4 place-self-end ">
              <label htmlFor="timeFrame" className="mr-2 font-medium text-xs">
                Filter:
              </label>
              <select
                id="timeFrame"
                value={timeFrame}
                onChange={(e) => 
                  setTimeFrame(e.target.value as TTimeline)
                }
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
  )
}

export default UserRegistrationChart