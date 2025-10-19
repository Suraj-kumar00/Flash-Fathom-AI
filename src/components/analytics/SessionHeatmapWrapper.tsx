import { SessionHeatmap } from './SessionHeatmap';

interface SessionHeatmapWrapperProps {
  data: number[][];
}

export function SessionHeatmapWrapper({ data }: SessionHeatmapWrapperProps) {
  return <SessionHeatmap data={data} />;
}

