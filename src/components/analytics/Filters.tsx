'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(event.target.name, event.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" onChange={handleFilterChange} />
      </div>
      <div>
        <Label htmlFor="dateRange">Date Range</Label>
        <Input id="dateRange" name="dateRange" type="date" onChange={handleFilterChange} />
      </div>
      <div>
        <Label htmlFor="difficulty">Difficulty</Label>
        <Input id="difficulty" name="difficulty" onChange={handleFilterChange} />
      </div>
      <Button onClick={() => router.push('/analytics')} className="md:ml-auto">Clear Filters</Button>
    </div>
  );
}