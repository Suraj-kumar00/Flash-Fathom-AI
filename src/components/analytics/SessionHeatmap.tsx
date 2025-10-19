'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SessionHeatmapProps {
  data: number[][]; // 7 days x 24 hours
}

const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function SessionHeatmap({ data }: SessionHeatmapProps) {
  // Validate input
  if (!data || data.length !== 7) {
    console.error('SessionHeatmap: expected data with 7 days');
    return null;
  }
  if (data.some(dayData => !Array.isArray(dayData) || dayData.length !== 24)) {
    console.error('SessionHeatmap: expected each day to have 24 hours');
    return null;
  }

  // Calculate total sessions per day
  const dailyTotals = data.map((dayData, dayIndex) => ({
    day: dayLabels[dayIndex],
    total: dayData.reduce((sum, val) => sum + val, 0),
  }));
  // Create chart data
  const chartData = {
    labels: dailyTotals.map(d => d.day),
    datasets: [
      {
        label: 'Study Sessions',
        data: dailyTotals.map(d => d.total),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Study Sessions by Day of Week',
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            const dayIndex = context.dataIndex;
            const dayData = data[dayIndex];
            
            // Defensive checks for dayData
            if (!dayData || !Array.isArray(dayData) || dayData.length === 0) {
              return [
                `Sessions: ${context.parsed?.y ?? 0}`,
                `Peak hour: N/A`,
              ];
            }
            
            // Compute peak hour only when we have valid data
            const maxValue = Math.max(...dayData);
            const maxIndex = dayData.indexOf(maxValue);
            const peakHour = maxIndex >= 0 ? `${maxIndex}:00` : 'N/A';
            
            return [
              `Sessions: ${context.parsed?.y ?? 0}`,
              `Peak hour: ${peakHour}`,
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}
