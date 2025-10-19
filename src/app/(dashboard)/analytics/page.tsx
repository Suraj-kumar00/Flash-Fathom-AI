import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Filters } from "@/components/analytics/Filters";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { RetentionCurve } from "@/components/analytics/RetentionCurve";
import { SessionHeatmap } from "@/components/analytics/SessionHeatmap";
import { SubjectProgress } from "@/components/analytics/SubjectProgress";
import type { Metadata } from "next";

// Disable static generation for this page since it uses Clerk
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Analytics - Flash Fathom AI",
  description: "In-depth performance analytics for your flashcard learning",
};

// Explicit interface for Next.js 15 compatibility
interface AnalyticsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const resolvedSearchParams = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">In-depth Performance Analytics</h1>

      <Filters />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">

        <div className="col-span-1">
          <Suspense fallback={<LoadingSpinner />}>
            <SubjectProgress />
          </Suspense>
        </div>
        <div className="col-span-1">
          <Suspense fallback={<LoadingSpinner />}>
            <RetentionCurve />
          </Suspense>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Suspense fallback={<LoadingSpinner />}>
            <SessionHeatmap />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
