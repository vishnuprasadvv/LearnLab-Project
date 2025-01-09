import React, { useEffect, useState } from "react";

import { getDashboardEarningsApi } from "@/api/instructorApi";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



interface IEarning {
        totalAmount: number,
        paymentDate: Date | string
        
}

type FilteredData = {
    labels: string[]; // Time periods (e.g., dates, months, years)
    data: number[];   // Earnings corresponding to the labels
};
const SalesChartInstructor: React.FC = () => {

    const [earningData, setEarningData ] = useState<IEarning[] | []>([])
    const [filteredEarnings, setFilteredEarnings] = useState<FilteredData>({ labels: [], data: [] });
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const fetchEarnings = async () => {
        try {
            const response = await getDashboardEarningsApi();
            setEarningData(response.data)
            setFilteredEarnings(filterEarnings(response.data, filter));
        } catch (error) {
            console.error('Error fetching earnings data', error)
        }
    }
    fetchEarnings()
  },[])

  function filterEarnings(earnings : IEarning[], filterType: 'daily' | 'weekly' | 'monthly' | 'yearly'): FilteredData {
    const result:Record<string, number> = {};
    
    earnings.forEach((earning) => {
        const date = new Date(earning.paymentDate);

        let key: string;
        switch (filterType) {
            case 'daily':
                key = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
                break;
                case 'weekly': {
                  const weekStart = new Date(date);
                  weekStart.setDate(date.getDate() - date.getDay()); // Start of the week (Sunday)
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekStart.getDate() + 6); // End of the week (Saturday)
          
                  key = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                  break;
                }
            case 'monthly':
                key = `${date.getFullYear()}-${date.getMonth() + 1}`; // 'YYYY-MM'
                break;
            case 'yearly':
                key = `${date.getFullYear()}`; // 'YYYY'
                break;
            default:
                throw new Error('Invalid filter type');
        }
        if (!result[key]) {
            result[key] = 0;
        }
        result[key] += earning.totalAmount;
    });

    // Format data for the chart library
    const labels = Object.keys(result);
    const data = Object.values(result);

    return { labels, data };
}
  
  const handleFilterChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly';
    setFilter(selectedFilter);
    setFilteredEarnings(filterEarnings(earningData, selectedFilter)); // Apply filter immediately
  };

  const totalEarnings = parseFloat(filteredEarnings.data.reduce((acc, amount) => acc + amount, 0).toFixed(2))

  const chartData = {
    labels: filteredEarnings.labels, // X-axis labels (dates or periods)
    datasets: [
      {
        label: "Earnings", // Chart label
        data: filteredEarnings.data, 
        fill: true, 
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, 
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};
  return (
        <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Total Earnings: ₹{totalEarnings || ''}
      </h2>
    <div className="h-80 rounded-lg items-center justify-center border p-1">

        {/* Dropdown to select the time frame */}
        <div className="mb-4 place-self-end ">
          <label htmlFor="timeFrame" className="mr-2 font-medium text-xs">
            Filter by:
          </label>
          <select
            value={filter}
            onChange={handleFilterChange}
            id="timeFrame"
            className="border rounded px-2 py-1 text-xs dark:bg-slate-700"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      
        <Bar data={chartData} options={chartOptions}/>
      </div>
      </div>
  );
};

export default SalesChartInstructor;
