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

interface RetentionCurveProps {
  data: {
    labels: string[];
    retention: number[];
  };
}

export function RetentionCurve({ data }: RetentionCurveProps) {
  // Transform data for chart
  const chartData = {
    labels: data.labels.length > 0 ? data.labels : ['No data'],
    datasets: [
      {
        label: 'Retention Rate',
        data: data.retention.length > 0 ? data.retention : [0],
        fill: false,
        borderColor: data.retention.length > 0 ? 'rgb(75, 192, 192)' : 'rgb(200, 200, 200)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
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
        text: 'Retention Rate Over Time',
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
