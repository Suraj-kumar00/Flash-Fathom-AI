import { SubjectProgress } from './SubjectProgress';

interface SubjectProgressWrapperProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
}

export function SubjectProgressWrapper({ data }: SubjectProgressWrapperProps) {
  return <SubjectProgress data={data} />;
}

