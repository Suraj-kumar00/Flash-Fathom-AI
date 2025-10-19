import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Filters } from "@/components/analytics/Filters";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { RetentionCurveWrapper } from "@/components/analytics/RetentionCurveWrapper";
import { SessionHeatmapWrapper } from "@/components/analytics/SessionHeatmapWrapper";
import { SubjectProgressWrapper } from "@/components/analytics/SubjectProgressWrapper";
import type { Metadata } from "next";

// Disable static generation for this page since it uses Clerk
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Analytics - Flash Fathom AI",
  description: "In-depth performance analytics for your flashcard learning",
};

// Helper to build query string from filters
function buildQueryString(filters: { [key: string]: string | string[] | undefined }): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        // Handle array values - append each valid item
        value.forEach((item) => {
          const trimmedItem = item.trim();
          if (trimmedItem) {
            params.append(key, trimmedItem);
          }
        });
      } else if (typeof value === 'string') {
        // Handle string values - set if not empty
        const trimmedValue = value.trim();
        if (trimmedValue) {
          params.set(key, trimmedValue);
        }
      }
    }
  });
  
  return params.toString();
}

// Fetch analytics data from API routes
async function fetchAnalyticsData(userId: string, filters: { [key: string]: string | string[] | undefined }) {
  // Merge userId into filters for authentication/authorization
  const filtersWithUserId = { ...filters, userId };
  const queryString = buildQueryString(filtersWithUserId);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const [subjectProgressRes, retentionCurveRes, sessionHeatmapRes] = await Promise.all([
      fetch(`${baseUrl}/api/analytics/subject-progress?${queryString}`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      }),
      fetch(`${baseUrl}/api/analytics/retention-curve?${queryString}`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      }),
      fetch(`${baseUrl}/api/analytics/session-heatmap?${queryString}`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
      }),
    ]);

    const [subjectProgressData, retentionData, sessionData] = await Promise.all([
      subjectProgressRes.ok ? subjectProgressRes.json() : { labels: [], datasets: [] },
      retentionCurveRes.ok ? retentionCurveRes.json() : { labels: [], retention: [] },
      sessionHeatmapRes.ok ? sessionHeatmapRes.json() : Array.from({ length: 7 }, () => Array(24).fill(0)),
    ]);

    return { subjectProgressData, retentionData, sessionData };
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    // Return empty data on error
    return {
      subjectProgressData: { labels: [], datasets: [] },
      retentionData: { labels: [], retention: [] },
      sessionData: Array.from({ length: 7 }, () => Array(24).fill(0)),
    };
  }
}

export default async function AnalyticsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const resolvedSearchParams = await searchParams;
  
  // Fetch analytics data with filters
  const { subjectProgressData, retentionData, sessionData } = await fetchAnalyticsData(
    user.id,
    resolvedSearchParams
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">In-depth Performance Analytics</h1>

      <Filters />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">

        <div className="col-span-1">
          <Suspense fallback={<LoadingSpinner />}>
            <SubjectProgressWrapper data={subjectProgressData} />
          </Suspense>
        </div>
        <div className="col-span-1">
          <Suspense fallback={<LoadingSpinner />}>
            <RetentionCurveWrapper data={retentionData} />
          </Suspense>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Suspense fallback={<LoadingSpinner />}>
            <SessionHeatmapWrapper data={sessionData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
