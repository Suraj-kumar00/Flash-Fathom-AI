import Flashcard from "@/components/core/flash-card";

// Disable static generation for this page since it uses Clerk
export const dynamic = 'force-dynamic';

export default async function GeneratePage() {
  return (
    <div className="page-container bg-slate-50 dark:bg-black">
      <Flashcard />
    </div>
  );
}
