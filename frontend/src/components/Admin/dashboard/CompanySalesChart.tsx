import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS , Tooltip, BarElement } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { getCompanyProfitDataApi } from '@/api/adminApi';


ChartJS.register(zoomPlugin, Tooltip, BarElement)
type TTimeline = 'daily' | 'weekly' | 'monthly' | 'yearly';
type TData = {
    orderCount: number,
    date: Date,
    revenue: number
}

const CompanySalesChart:React.FC = () => {

    const [timeFrame, setTimeFrame] = useState<TTimeline>('monthly')
    const [filteredData, setFilteredData] = useState<TData[]>([])

 useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await getCompanyProfitDataApi(timeFrame)
                setFilteredData(response.data)
            } catch (error) {
                console.error('error fetching userRegisterData', error)
            }
        }

        fetchData()
    },[timeFrame])

    const chartData = {
        labels: filteredData.map((item: any) => item.date), // Labels are the months
        datasets: [
          {
            label: "Revenue",
            data: filteredData.map((item: any) => item.revenue), // Revenue data for each month
            borderColor: "rgb(0, 255, 128, 1)",
            backgroundColor: "rgb(0, 255, 128, 0.2)",
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
       <div className=" rounded-lg items-center justify-center border p-1">
   
           {/* Dropdown to select the time frame */}
           <div className="mb-4 place-self-end ">
             <label htmlFor="timeFrame" className="mr-2 font-medium text-xs">
               Time Frame:
             </label>
             <select
               id="timeFrame"
               value={timeFrame}
               onChange={(e) => setTimeFrame(e.target.value as TTimeline)}
               className="border rounded px-2 py-1 text-xs"
             >
               <option value="daily">Daily</option>
               <option value="weekly">Weekly</option>
               <option value="monthly">Monthly</option>
               <option value="yearly">Yearly</option>
             </select>
           </div>
   
           <Bar data={chartData} options={options} />
         </div>
         </div>
  )
}

export default CompanySalesChart