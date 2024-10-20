import Flashcard from "@/components/core/flash-card";

export default async function GeneratePage() {
  return (
    <div className="page-container bg-slate-50 dark:bg-black">
      <Flashcard />
    </div>
  );
}
