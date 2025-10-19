import { RetentionCurve } from './RetentionCurve';

interface RetentionCurveWrapperProps {
  data: {
    labels: string[];
    retention: number[];
  };
}

export function RetentionCurveWrapper({ data }: RetentionCurveWrapperProps) {
  return <RetentionCurve data={data} />;
}

