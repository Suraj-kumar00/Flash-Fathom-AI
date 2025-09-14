'use client';

import { useEffect, useState } from 'react';

interface RecommendationData {
  bestTimeToStudy: number;
  urgentRevisionDecks: { name: string; retention: number }[];
}

export function Recommendations() {
  const [data, setData] = useState<RecommendationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics/recommendations`);
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading recommendations...</div>;
  }

  const formatHour = (hour: number) => {
      if (hour === -1) return "Not enough data";
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour} ${ampm}`;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Personalized Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Best Time to Study</h3>
          <p className="text-lg">{formatHour(data.bestTimeToStudy)}</p>
        </div>
        <div>
          <h3 className="font-semibold">Subjects for Urgent Revision</h3>
          <ul className="list-disc list-inside">
            {data.urgentRevisionDecks.map(deck => (
              <li key={deck.name}>{deck.name} ({deck.retention.toFixed(2)}% retention)</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
