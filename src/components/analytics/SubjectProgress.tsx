'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SubjectProgressProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
}

// Color palette for different subjects
const colors = [
  'rgb(75, 192, 192)',
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
];

export function SubjectProgress({ data }: SubjectProgressProps) {
  // Transform data for chart
  const chartData = {
    labels: data.labels.length > 0 ? data.labels : ['No data'],
    datasets: data.datasets.length > 0 
      ? data.datasets.map((dataset, index) => ({
          label: dataset.label,
          data: dataset.data,
          fill: false,
          borderColor: colors[index % colors.length],
          tension: 0.1,
        }))
      : [{
          label: 'No data available',
          data: [0],
          fill: false,
          borderColor: 'rgb(200, 200, 200)',
          tension: 0.1,
        }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Subject Progress (Accuracy %)',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function(value: number | string) {
            return value + '%';
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}
