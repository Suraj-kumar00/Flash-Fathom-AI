'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSearchParams } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DifficultyData {
  EASY: { correct: number; total: number };
  MEDIUM: { correct: number; total: number };
  HARD: { correct: number; total: number };
}

export function DifficultyInsights() {
  const [data, setData] = useState<DifficultyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const params = new URLSearchParams(searchParams.toString());
        const response = await fetch(`/api/analytics/difficulty-insights?${params.toString()}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchData();
  }, [searchParams]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Correct',
        data: [data.EASY.correct, data.MEDIUM.correct, data.HARD.correct],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Incorrect',
        data: [
          data.EASY.total - data.EASY.correct,
          data.MEDIUM.total - data.MEDIUM.correct,
          data.HARD.total - data.HARD.correct,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance by Difficulty Level',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            const total = context.chart.data.datasets.reduce((acc: number, dataset: any) => acc + dataset.data[context.dataIndex], 0);
            const value = context.raw;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0%';
            return `${label}${value} (${percentage})`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return <Bar options={chartOptions} data={chartData} />;
}
